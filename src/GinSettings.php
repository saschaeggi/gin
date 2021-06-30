<?php

namespace Drupal\gin;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\user\UserDataInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Service to handle overridden user settings.
 */
class GinSettings implements ContainerInjectionInterface {

  /**
   * The user data service.
   *
   * @var \Drupal\user\UserDataInterface
   */
  protected $userData;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * Settings constructor.
   *
   * @param \Drupal\user\UserDataInterface $userData
   *   The user data service.
   * @param \Drupal\Core\Session\AccountInterface $currentUser
   *   The current user.
   */
  public function __construct(UserDataInterface $userData, AccountInterface $currentUser) {
    $this->userData = $userData;
    $this->currentUser = $currentUser;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static($container->get('user.data'), $container->get('current_user'));
  }

  /**
   * Get the setting for the current user.
   *
   * @param string $name
   *   The name of the setting.
   * @param \Drupal\Core\Session\AccountInterface|null $account
   *   The account object. Current user if NULL.
   *
   * @return array|bool|mixed|null
   *   The current value.
   */
  public function get($name, AccountInterface $account = NULL) {
    $value = NULL;
    if (!$account) {
      $account = $this->currentUser;
    }
    if ($this->userOverrideEnabled()) {
      $settings = $this->userData->get('gin', $account->id(), 'settings');
      if (isset($settings[$name])) {
        $value = $settings[$name];
      }
      else {
        // Try loading legacy settings from user data.
        $value = $this->userData->get('gin', $account->id(), $name);
      }
    }
    if (is_null($value)) {
      $admin_theme = $this->getAdminTheme();
      $value = theme_get_setting($name, $admin_theme);
    }
    return $this->handleLegacySettings($name, $value);
  }

  /**
   * Get the default setting from theme.
   *
   * @param string $name
   *   The name of the setting.
   *
   * @return array|bool|mixed|null
   *   The current value.
   */
  public function getDefault($name) {
    $admin_theme = $this->getAdminTheme();
    return $this->handleLegacySettings($name, theme_get_setting($name, $admin_theme));
  }

  /**
   * Set user overrides.
   *
   * @param array $settings
   *   The user specific theme settings.
   * @param \Drupal\Core\Session\AccountInterface|null $account
   *   The account object. Current user if NULL.
   */
  public function setAll(array $settings, AccountInterface $account = NULL) {
    if (!$account) {
      $account = $this->currentUser;
    }
    // All settings are deleted to remove legacy settings.
    $this->userData->delete('gin', $account->id());
    $this->userData->set('gin', $account->id(), 'enable_user_settings', TRUE);
    $this->userData->set('gin', $account->id(), 'settings', $settings);
  }

  /**
   * Clears all gin settings for the current user.
   *
   * @param \Drupal\Core\Session\AccountInterface|null $account
   *   The account object. Current user if NULL.
   */
  public function clear(AccountInterface $account = NULL) {
    if (!$account) {
      $account = $this->currentUser;
    }
    $this->userData->delete('gin', $account->id());
  }

  /**
   * Determine if user overrides are allowed.
   *
   * @return bool
   *   TRUE or FALSE.
   */
  public function allowUserOverrides() {
    $admin_theme = $this->getAdminTheme();
    return theme_get_setting('show_user_theme_settings', $admin_theme);
  }

  /**
   * Determine if the user enabled overrides.
   *
   * @param \Drupal\Core\Session\AccountInterface|null $account
   *   The account object. Current user if NULL.
   *
   * @return bool
   *   TRUE or FALSE.
   */
  public function userOverrideEnabled(AccountInterface $account = NULL) {
    if (!$account) {
      $account = $this->currentUser;
    }
    return $this->allowUserOverrides() && (bool) $this->userData->get('gin', $account->id(), 'enable_user_settings');
  }

  /**
   * Check if the user setting overrides the global setting.
   *
   * @param string $name
   *   Name of the setting to check.
   * @param \Drupal\Core\Session\AccountInterface|null $account
   *   The account object. Current user if NULL.
   *
   * @return bool
   *   TRUE or FALSE.
   */
  public function overridden($name, AccountInterface $account = NULL) {
    if (!$account) {
      $account = $this->currentUser;
    }
    $admin_theme = $this->getAdminTheme();
    return $this->handleLegacySettings($name, theme_get_setting($name, $admin_theme)) !== $this->get($name, $account);
  }

  /**
   * Return a massaged value from deprecated theme settings.
   *
   * @param string $name
   *   Name of the setting to check.
   * @param array|bool|mixed|null $value
   *   The value of the currently used setting.
   *
   * @return array|bool|mixed|null
   *   The value determined by a legacy setting.
   */
  private function handleLegacySettings($name, $value) {
    if ($name === 'enable_darkmode') {
      $value = (bool) $value;
    }
    if ($name === 'high_contrast_mode') {
      $value = (bool) $value;
    }
    if ($name === 'preset_accent_color') {
      $value = $value === 'claro_blue' ? 'blue' : $value;
    }
    if ($name === 'classic_toolbar') {
      $value = $value === TRUE || $value === 'true' ||  $value === '1' || $value === 1 ? 'classic' : $value;
    }
    return $value;
  }

  /**
   * Return the active admin theme.
   *
   * @return string
   *   The active admin theme name.
   */
  private function getAdminTheme() {
    $admin_theme = \Drupal::configFactory()->get('system.theme')->get('admin');
    if (empty($admin_theme)) {
      $admin_theme = \Drupal::configFactory()->get('system.theme')->get('default');
    }
    return $admin_theme;
  }

}
