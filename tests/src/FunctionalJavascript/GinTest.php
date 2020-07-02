<?php

namespace Drupal\Tests\gin\FunctionalJavascript;

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
  public function setUp() {
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
    \Drupal::configFactory()->getEditable('gin.settings')->set('classic_toolbar', 1)->save();
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

}
