<?php

namespace Drupal\gin;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\user\UserDataInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Service to handle the overwritten user settings.
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
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  /**
   * Settings constructor.
   *
   * @param \Drupal\user\UserDataInterface $userData
   *   The user data service.
   * @param \Drupal\Core\Session\AccountProxyInterface $currentUser
   *   The current user.
   */
  public function __construct(UserDataInterface $userData, AccountProxyInterface $currentUser) {
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
   *
   * @return array|bool|mixed|null
   *   The current value.
   */
  public function get($setting) {

    if ($this->userOverwritesEnabled()) {
      $settings = $this->userData->get('gin', $this->currentUser->id(), 'settings');
      if (isset($settings[$setting])) {
        return $settings[$setting];
      }
    }
    return theme_get_setting($setting);
  }

  /**
   * Set user overwrites.
   *
   * @param array $settings
   *   The user specific theme settings.
   */
  public function setAll(array $settings) {
    $this->userData->set('gin', $this->currentUser->id(), 'enable_user_settings', TRUE);
    $this->userData->set('gin', $this->currentUser->id(), 'settings', $settings);
  }

  /**
   * Clears all gin settings for the current user.
   */
  public function clear() {
    $this->userData->delete('gin', $this->currentUser->id());
  }

  /**
   * Determine if user overrides are allowed.
   *
   * @return bool
   *   TRUE or FALSE.
   */
  public function allowUserOverwrites() {
    return (bool) theme_get_setting('show_user_theme_settings');
  }

  /**
   * Determine if the user enabled overrides.
   *
   * @return bool
   *   TRUE or FALSE.
   */
  public function userOverwritesEnabled() {
    return $this->allowUserOverwrites() && (bool) $this->userData->get('gin', $this->currentUser->id(), 'enable_user_settings');
  }

}
