<?php

namespace Drupal\Tests\gin\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Tests the gin admin theme.
 *
 * @group gin
 */
class GinTest extends BrowserTestBase {

  /**
   * Modules to enable.
   *
   * Install the shortcut module so that gin.settings has its schema checked.
   * There's currently no way for Gin to provide a default and have valid
   * configuration as themes cannot react to a module install.
   *
   * @var string[]
   */
  protected static $modules = [
    'shortcut',
    'toolbar',
  ];

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * Sets up the test.
   */
  protected function setUp(): void {
    parent::setUp();

    $this->assertTrue(\Drupal::service('theme_installer')->install(['gin']));
    $this->container->get('config.factory')
      ->getEditable('system.theme')
      ->set('default', 'gin')
      ->set('admin', 'gin')
      ->save();

    $adminUser = $this->drupalCreateUser([
      'access administration pages',
      'administer themes',
      'access toolbar',
    ]);
    $this->drupalLogin($adminUser);
  }

  /**
   * Tests that the Gin theme always adds its message CSS and Classy's.
   */
  public function testDefaultGinSettings() {
    $response = $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertStringContainsString('"darkmode":"0"', $response);
    $this->assertStringContainsString('"preset_accent_color":"blue"', $response);
    $this->assertStringContainsString('"preset_focus_color":"gin"', $response);
    $this->assertSession()->responseContains('gin.css');
    $this->assertSession()->responseContains('toolbar.css');
    $this->assertSession()->responseNotContains('classic_toolbar.css');
  }

  /**
   * Tests Darkmode setting.
   */
  public function testDarkModeSetting() {
    \Drupal::configFactory()->getEditable('gin.settings')->set('enable_darkmode', '1')->save();
    $response = $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertStringContainsString('"darkmode":"1"', $response);
  }

  /**
   * Tests Classic Drupal Toolbar setting.
   */
  public function testClassicToolbarSetting() {
    \Drupal::configFactory()->getEditable('gin.settings')->set('classic_toolbar', 'classic')->save();
    $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertSession()->responseContains('classic_toolbar.css');
  }

  /**
   * Tests Color Accent setting.
   */
  public function testAccentColorSetting() {
    \Drupal::configFactory()->getEditable('gin.settings')->set('preset_accent_color', 'red')->save();
    $response = $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertStringContainsString('"preset_accent_color":"red"', $response);
  }

  /**
   * Tests Focus Accent setting.
   */
  public function testFocusColorSetting() {
    \Drupal::configFactory()->getEditable('gin.settings')->set('preset_focus_color', 'blue')->save();
    $response = $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertStringContainsString('"preset_focus_color":"blue"', $response);
  }

  /**
   * Test user settings.
   */
  public function testUserSettings() {
    \Drupal::configFactory()->getEditable('gin.settings')->set('show_user_theme_settings', TRUE)->save();

    $user1 = $this->createUser();
    $this->drupalLogin($user1);

    // Change something on the logged in user form.
    $this->assertStringContainsString('"darkmode":"0"', $this->drupalGet($user1->toUrl('edit-form')));

    $this->submitForm([
      'enable_user_settings' => TRUE,
      'enable_darkmode' => '1',
    ], 'Save', 'user-form');
    $this->assertStringContainsString('"darkmode":"1"', $this->drupalGet($user1->toUrl('edit-form')));

    // Login as admin.
    $this->drupalLogin($this->rootUser);
    $this->assertStringContainsString('"darkmode":"0"', $this->drupalGet('edit-form'));

    // Change something on user1 edit form.
    $this->drupalGet($user1->toUrl('edit-form'));
    $this->submitForm([
      'enable_user_settings' => TRUE,
      'high_contrast_mode' => TRUE,
      'enable_darkmode' => '1',
    ], 'Save', 'user-form');

    // Check logged-in's user is not affected.
    $loggedInUserResponse = $this->drupalGet('edit-form');
    $this->assertStringContainsString('"highcontrastmode":false', $loggedInUserResponse);
    $this->assertStringContainsString('"darkmode":"0"', $loggedInUserResponse);

    // Check settings of user1.
    $this->drupalLogin($user1);
    $rootUserResponse = $this->drupalGet($user1->toUrl('edit-form'));
    $this->assertStringContainsString('"highcontrastmode":true', $rootUserResponse);
    $this->assertStringContainsString('"darkmode":"1"', $rootUserResponse);
  }

  /**
   * Fills and submits a form.
   *
   * @param array $edit
   *   Field data in an associative array. Changes the current input fields
   *   (where possible) to the values indicated.
   *
   *   A checkbox can be set to TRUE to be checked and should be set to FALSE to
   *   be unchecked.
   * @param string $submit
   *   Value of the submit button whose click is to be emulated. For example,
   *   'Save'. The processing of the request depends on this value. For example,
   *   a form may have one button with the value 'Save' and another button with
   *   the value 'Delete', and execute different code depending on which one is
   *   clicked.
   * @param string $form_html_id
   *   (optional) HTML ID of the form to be submitted. On some pages
   *   there are many identical forms, so just using the value of the submit
   *   button is not enough. For example: 'trigger-node-presave-assign-form'.
   *   Note that this is not the Drupal $form_id, but rather the HTML ID of the
   *   form, which is typically the same thing but with hyphens replacing the
   *   underscores.
   */
  protected function submitForm(array $edit, $submit, $form_html_id = NULL) {
    $assert_session = $this->assertSession();

    // Get the form.
    if (isset($form_html_id)) {
      $form = $assert_session->elementExists('xpath', "//form[@id='$form_html_id']");
      $submit_button = $assert_session->buttonExists($submit, $form);
      $action = $form->getAttribute('action');
    }
    else {
      // Gin Form Test: Change check to include //form
      // so we keep the search in scope of a form.
      $submit_button = $assert_session->elementExists('xpath', "//form //input[@value='$submit']");
      $form = $assert_session->elementExists('xpath', './ancestor::form', $submit_button);
      $action = $form->getAttribute('action');
    }

    // Edit the form values.
    foreach ($edit as $name => $value) {
      $field = $assert_session->fieldExists($name, $form);

      // Provide support for the values '1' and '0' for checkboxes instead of
      // TRUE and FALSE.
      // @todo Get rid of supporting 1/0 by converting all tests cases using
      // this to boolean values.
      $field_type = $field->getAttribute('type');
      if ($field_type === 'checkbox') {
        $value = (bool) $value;
      }

      $field->setValue($value);
    }

    // Submit form.
    $this->prepareRequest();
    $submit_button->press();

    // Ensure that any changes to variables in the other thread are picked up.
    $this->refreshVariables();

    // Check if there are any meta refresh redirects (like Batch API pages).
    if ($this->checkForMetaRefresh()) {
      // We are finished with all meta refresh redirects, so reset the counter.
      $this->metaRefreshCount = 0;
    }

    // Log only for WebDriverTestBase tests because for tests using
    // DrupalTestBrowser we log with ::getResponseLogHandler.
    if ($this->htmlOutputEnabled && !$this->isTestUsingGuzzleClient()) {
      $out = $this->getSession()->getPage()->getContent();
      $html_output = 'POST request to: ' . $action .
        '<hr />Ending URL: ' . $this->getSession()->getCurrentUrl();
      $html_output .= '<hr />' . $out;
      $html_output .= $this->getHtmlOutputHeaders();
      $this->htmlOutput($html_output);
    }

  }

}
