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
   * {@inheritdoc}
   */
  protected $defaultTheme = 'gin';

  public function setUp() {
    parent::setUp();
    $adminUser = $this->drupalCreateUser(['access administration pages', 'administer themes']);
    $this->drupalLogin($adminUser);
  }

  /**
   * Tests that the Gin theme always adds its message CSS and Classy's.
   */
  public function testDefaultGinSettings() {
    $response = $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertContains('"darkmode":false', $response);
    $this->assertContains('"preset_accent_color":"blue"', $response);
    $this->assertContains('"preset_focus_color":"gin"', $response);
    $this->assertSession()->responseContains('gin.css');
    $this->assertSession()->responseContains('gin_toolbar.css');
    $this->assertSession()->responseNotContains('gin_classic_toolbar.css');
  }

  public function testDarkModeSetting(){
    \Drupal::configFactory()->getEditable('gin.settings')->set('enable_darkmode', true)->save();
    $response = $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertContains('"darkmode":true', $response);
  }

  public function testClassicToolbarSetting(){
    \Drupal::configFactory()->getEditable('gin.settings')->set('classic_toolbar', true)->save();
    $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertSession()->responseContains('gin_classic_toolbar.css');
  }

  public function testAccentColorSetting(){
    \Drupal::configFactory()->getEditable('gin.settings')->set('preset_accent_color', 'red')->save();
    $response = $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertContains('"preset_accent_color":"red"', $response);
  }

  public function testFocusColorSetting(){
    \Drupal::configFactory()->getEditable('gin.settings')->set('preset_focus_color', 'blue')->save();
    $response = $this->drupalGet('/admin/content');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertContains('"preset_focus_color":"blue"', $response);
  }

}
