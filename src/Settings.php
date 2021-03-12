<?php

namespace Drupal\gin;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\user\UserDataInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Service to handle overridden user settings.
 */
class Settings implements ContainerInjectionInterface {

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
   * @param string $setting
   *   The name of the setting.
   * @param \Drupal\Core\Session\AccountInterface|null $account
   *   The account object. Current user if NULL.
   *
   * @return array|bool|mixed|null
   *   The current value.
   */
  public function get($setting, AccountInterface $account = NULL) {
    if (!$account) {
      $account = $this->currentUser;
    }

    if ($this->userOverrideEnabled()) {
      $settings = $this->userData->get('gin', $account->id(), 'settings');
      if (isset($settings[$setting])) {
        return $settings[$setting];
      }
    }
    return theme_get_setting($setting);
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
    return theme_get_setting('show_user_theme_settings');
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
   * @param string $setting
   *   Name of the setting to check.
   * @param \Drupal\Core\Session\AccountInterface|null $account
   *   The account object. Current user if NULL.
   *
   * @return bool
   *   TRUE or FALSE.
   */
  public function overridden($setting, AccountInterface $account = NULL) {
    if (!$account) {
      $account = $this->currentUser;
    }
    return theme_get_setting($setting) !== $this->get($setting, $account);
  }

}
