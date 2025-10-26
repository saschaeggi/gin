<?php

namespace Drupal\gin;

use Drupal\Component\Utility\Html;
use Drupal\Component\Utility\NestedArray;

/**
 * Admin helper methods.
 */
final class Helper {

  /**
   * Flag if admin is active.
   *
   * @var bool|null
   */
  private static ?bool $active = NULL;

  /**
   * List of checked modules if they are active.
   *
   * @var array
   */
  private static array $modules = [];

  /**
   * Accent colors.
   */
  public static function accentColors(): array {
    return [
      'blue' => [
        'label' => t('Blue (Default)'),
        'hex' => '#015efe',
      ],
      'light_blue' => [
        'label' => t('Light Blue'),
        'hex' => '#2f6dd0',
      ],
      'dark_purple' => [
        'label' => t('Dark Purple'),
        'hex' => '#4300bf',
      ],
      'purple' => [
        'label' => t('Purple'),
        'hex' => '#5b00ff',
      ],
      'teal' => [
        'label' => t('Teal'),
        'hex' => '#0e7772',
      ],
      'green' => [
        'label' => t('Green'),
        'hex' => '#02742d',
      ],
      'pink' => [
        'label' => t('Pink'),
        'hex' => '#d12f70',
      ],
      'red' => [
        'label' => t('Red'),
        'hex' => '#d8002f',
      ],
      'orange' => [
        'label' => t('Orange'),
        'hex' => '#c55228',
      ],
      'yellow' => [
        'label' => t('Yellow'),
        'hex' => '#966705',
      ],
      'neutral' => [
        'label' => t('Neutral'),
        'hex' => '#111111',
      ],
      'custom' => [
        'label' => t('Custom'),
        // Fallback value.
        'hex' => '#000',
      ],
    ];
  }

  /**
   * Accent color element.
   */
  public static function accentRadios(array $element): array {
    $options = array_keys($element['#options']);

    foreach ($options as $values) {
      // Old way.
      $element[$values]['#attributes']['data-gin-accent'] = $element[$values]['#return_value'];

      // New way.
      $accent_colors = self::accentColors();
      $preset = $element[$values]['#return_value'];
      $element[$values]['#attributes']['style'] = '--accent-base: ' . $accent_colors[$preset]['hex'] . ';';
    }

    return $element;
  }

  /**
   * Converts a link render element to an action link.
   *
   * This helper merges every attributes from $link['#attributes'], from
   * $link['#options']['attributes'] and from the Url object's.
   *
   * @param array $link
   *   Link renderable array.
   * @param string|null $icon_name
   *   The name of the needed icon. When specified, a CSS class will be added
   *   with the following pattern: 'action-link--icon-[icon_name]'. If the
   *   needed icon is not implemented in CSS, no icon will be added.
   *   Currently available icons are:
   *    - checkmark,
   *    - cog,
   *    - ex,
   *    - plus,
   *    - trash.
   * @param string $size
   *   Name of the small action link variant. Defaults to 'default'.
   *   Supported sizes are:
   *    - default,
   *    - small,
   *    - extrasmall.
   * @param string $variant
   *   Variant of the action link. Supported variants are 'default' and
   *   'danger'. Defaults to 'default'.
   *
   * @return array
   *   The link renderable converted to action link.
   */
  public static function convertLinkToActionLink(array $link, ?string $icon_name = NULL, string $size = 'default', string $variant = 'default'): array {
    // Early opt-out if we cannot do anything.
    if (empty($link['#type']) || $link['#type'] !== 'link' || empty($link['#url'])) {
      return $link;
    }

    // \Drupal\Core\Render\Element\Link::preRenderLink adds $link['#attributes']
    // to $link[#options]['attributes'] if it is not empty, but it does not
    // merges the 'class' subkey deeply.
    // Because of this, when $link[#options]['attributes']['class'] is set, the
    // classes defined in $link['#attributes']['class'] are ignored.
    //
    // To keep this behavior we repeat this for action-link, which means that
    // this conversion happens a bit earlier. We unset $link['#attributes'] to
    // prevent Link::preRenderLink() doing the same, because for action-links,
    // that would be needless.
    $link += ['#options' => []];
    if (isset($link['#attributes'])) {
      $link['#options'] += [
        'attributes' => [],
      ];
      $link['#options']['attributes'] += $link['#attributes'];
      unset($link['#attributes']);
    }
    $link['#options'] += ['attributes' => []];
    $link['#options']['attributes'] += ['class' => []];

    // Determine the needed (type) variant.
    $variants_supported = ['default', 'danger'];
    $variant = in_array($variant, $variants_supported) ? $variant : reset($variants_supported);

    // Remove button, button modifier CSS classes and other unwanted ones.
    $link['#options']['attributes']['class'] = array_diff($link['#options']['attributes']['class'], [
      'button',
      'button--action',
      'button--primary',
      'button--danger',
      'button--small',
      'button--extrasmall',
      'link',
    ]);

    // Adding the needed CSS classes.
    $link['#options']['attributes']['class'][] = 'action-link';

    // Add the variant-modifier CSS class only if the variant is not the
    // default.
    if ($variant !== reset($variants_supported)) {
      $link['#options']['attributes']['class'][] = Html::getClass("action-link--$variant");
    }

    // Add the icon modifier CSS class.
    if (!empty($icon_name)) {
      $link['#options']['attributes']['class'][] = Html::getClass("action-link--icon-$icon_name");
    }

    if (in_array($size, ['small', 'extrasmall'])) {
      $link['#options']['attributes']['class'][] = Html::getClass("action-link--$size");
    }

    // If the provided $link is an item of the 'links' theme function, then only
    // the attributes of the Url object are processed during rendering.
    $url_attributes = $link['#url']->getOption('attributes') ?: [];
    $url_attributes = NestedArray::mergeDeep($url_attributes, $link['#options']['attributes']);
    $link['#url']->setOption('attributes', $url_attributes);

    return $link;
  }

  /**
   * Helper function for check if admin is active.
   */
  public static function isActive(): bool {
    if (self::$active === NULL) {
      // Check if set as admin theme.
      $admin_theme_name = \Drupal::config('system.theme')->get('admin');
      if ($admin_theme_name === 'gin') {
        return TRUE;
      }

      $theme_handler = \Drupal::service('theme_handler')->listInfo();

      // Check if set as frontend theme.
      $frontend_theme_name = \Drupal::config('system.theme')->get('default');

      // Check if base themes are set.
      if (isset($theme_handler[$frontend_theme_name]->base_themes)) {
        $frontend_base_themes = $theme_handler[$frontend_theme_name]->base_themes;
      }

      // Add theme name to base theme array.
      $frontend_base_themes[$frontend_theme_name] = $frontend_theme_name;

      // Admin theme will have no value if it is set to use the default theme.
      if ($admin_theme_name && isset($theme_handler[$admin_theme_name]->base_themes)) {
        $admin_base_themes = $theme_handler[$admin_theme_name]->base_themes;
        $admin_base_themes[$admin_theme_name] = $admin_theme_name;
      }
      else {
        $admin_base_themes = $frontend_base_themes;
      }

      $base_themes = array_merge($admin_base_themes, $frontend_base_themes);
      self::$active = array_key_exists('gin', $base_themes);
    }

    return self::$active;
  }

  /**
   * Set and get the form actions of the current request.
   *
   * @param array|null $actions
   *   If not NULL, the given actions will be remembered for the current request
   *   so that they can be retrieved later when processing the page.
   *
   * @return array|null
   *   If set, the previously stored actions, NULL otherwise.
   */
  public static function formActions(?array $actions = NULL): ?array {
    static $preparedActions;
    if ($actions !== NULL) {
      $preparedActions = $actions;
    }
    return $preparedActions;
  }

  /**
   * Helper function for check if a module is active.
   */
  public static function moduleIsActive(string $module): bool {
    if (!isset(self::$modules[$module])) {
      self::$modules[$module] = \Drupal::service('module_handler')->moduleExists($module);
    }
    return self::$modules[$module];
  }

}
