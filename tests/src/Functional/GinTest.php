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
  public static $modules = ['shortcut'];

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

    $adminUser = $this->drupalCreateUser(['access administration pages', 'administer themes']);
    $this->drupalLogin($adminUser);
  }

  /**
   * Tests that the Gin theme always adds its message CSS and Classy's.
   */
  public function testDefaultGinSettings() {
    $response = $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertStringContainsString('"darkmode":false', $response);
    $this->assertStringContainsString('"preset_accent_color":"blue"', $response);
    $this->assertStringContainsString('"preset_focus_color":"gin"', $response);
    $this->assertSession()->responseContains('gin.css');
    $this->assertSession()->responseContains('gin_toolbar.css');
    $this->assertSession()->responseNotContains('gin_classic_toolbar.css');
  }

  /**
   * Tests Darkmode setting.
   */
  public function testDarkModeSetting() {
    \Drupal::configFactory()->getEditable('gin.settings')->set('enable_darkmode', TRUE)->save();
    $response = $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertStringContainsString('"darkmode":true', $response);
  }

  /**
   * Tests Classic Drupal Toolbar setting.
   */
  public function testClassicToolbarSetting() {
    \Drupal::configFactory()->getEditable('gin.settings')->set('classic_toolbar', 'classic')->save();
    $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertSession()->responseContains('gin_classic_toolbar.css');
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
    $this->drupalGet($user1->toUrl('edit-form'));
    $this->assertSession()->pageTextContains('"darkmode":false');
    $this->submitForm([
      'enable_user_settings' => TRUE,
      'enable_darkmode' => TRUE,
    ], 'Save');
    $this->assertSession()->pageTextContains('"darkmode":true');

    // Login as admin.
    $this->drupalLogin($this->rootUser);
    $this->assertSession()->pageTextContains('"darkmode":false');
    // Change something on user1 edit form.
    $this->drupalGet($user1->toUrl('edit-form'));
    $this->submitForm([
      'enable_user_settings' => TRUE,
      'high_contrast_mode' => TRUE,
      'enable_darkmode' => TRUE,
    ], 'Save');

    // Check logged-in's user is not affected.
    $this->assertSession()->pageTextContains('"highcontrastmode":false');
    $this->assertSession()->pageTextContains('"darkmode":false');

    // Check settings of user1.
    $this->drupalLogin($user1);
    $this->assertSession()->pageTextContains('"highcontrastmode":true');
    $this->assertSession()->pageTextContains('"darkmode":true');
  }

}
