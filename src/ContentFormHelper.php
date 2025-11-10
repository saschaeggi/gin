<?php

namespace Drupal\gin;

use Drupal\Core\Ajax\AjaxHelperTrait;
use Drupal\Core\DependencyInjection\ClassResolverInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\ContentEntityFormInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Site\Settings;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Theme\ThemeManagerInterface;
use Drupal\user\Routing\RouteSubscriber;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Service to handle content form overrides.
 */
final class ContentFormHelper implements ContainerInjectionInterface {

  use AjaxHelperTrait;
  use ClassResolverTrait;
  use StringTranslationTrait;

  /**
   * ContentFormHelper constructor.
   *
   * @param \Drupal\Core\Session\AccountInterface $currentUser
   *   The current user.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $moduleHandler
   *   The module handler.
   * @param \Drupal\Core\Routing\RouteMatchInterface $routeMatch
   *   The current route match.
   * @param \Drupal\Core\Theme\ThemeManagerInterface $themeManager
   *   The theme manager.
   * @param \Symfony\Component\HttpFoundation\RequestStack $requestStack
   *   The HTTP request stack.
   * @param \Drupal\Core\DependencyInjection\ClassResolverInterface $classResolver
   *   The class resolver.
   */
  public function __construct(
    protected AccountInterface $currentUser,
    protected ModuleHandlerInterface $moduleHandler,
    protected RouteMatchInterface $routeMatch,
    protected ThemeManagerInterface $themeManager,
    protected RequestStack $requestStack,
    protected ClassResolverInterface $classResolver,
  ) {
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): ContentFormHelper {
    return new ContentFormHelper(
      $container->get('current_user'),
      $container->get('module_handler'),
      $container->get('current_route_match'),
      $container->get('theme.manager'),
      $container->get('request_stack'),
      $container->get('class_resolver'),
    );
  }

  /**
   * Determines the feature flag to use for sticky action buttons.
   *
   * @param bool $is_content_form
   *   TRUE if this should return the flag for content forms, FALSE if it should
   *   return the flag for any form.
   *
   * @return bool
   *   TRUE if core_admin_theme_use_sticky_action_buttons is enabled, FALSE
   *   otherwise.
   */
  private static function useStickyActionButtons(bool $is_content_form = TRUE): bool {
    $flag = Settings::get('core_admin_theme_use_sticky_action_buttons', 'never');
    return $is_content_form ?
      $flag === 'content_forms' || $flag === 'always' :
      $flag === 'always';
  }

  /**
   * Add some major form overrides.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   * @param string $form_id
   *   The form id.
   *
   * @see hook_form_alter()
   */
  public function formAlter(array &$form, FormStateInterface $form_state, string $form_id): void {
    if ($this->isModalOrOffcanvas()) {
      $form['is_ajax_request'] = ['#weight' => -1];
      return;
    }
    if (RouteSubscriber::useAdminThemeForLogin()) {
      return;
    }
    if (
      str_ends_with($form_id, '_exposed_form') ||
      str_starts_with($form_id, 'views_ui_')
    ) {
      return;
    }

    // Save form types and behaviors.
    $is_content_form = $this->isContentForm($form_state, $form_id);

    // If there are action buttons, and they should either be sticky or there
    // is a content form, where the sidebar toggle is required, prepare the
    // sticky action container for the top bar.
    if (isset($form['actions']) && (self::useStickyActionButtons($is_content_form) || $is_content_form)) {
      // Sticky action container.
      $form['gin_sticky_actions'] = [
        '#type' => 'container',
        '#weight' => -1,
        '#multilingual' => TRUE,
        '#attributes' => [
          'class' => ['gin-sticky-form-actions'],
        ],
      ];
      $form['#after_build'][] = [__CLASS__, 'formAfterBuild'];
    }

    // Sticky action buttons.
    if (self::useStickyActionButtons($is_content_form) && isset($form['actions'])) {
      // Add sticky class.
      $form['actions']['#attributes']['class'][] = 'gin-sticky-form-actions';

      // Add a class to identify modified forms.
      if (!isset($form['#attributes']['class'])) {
        $form['#attributes']['class'] = [];
      }
      elseif (is_string($form['#attributes']['class'])) {
        $form['#attributes']['class'] = [$form['#attributes']['class']];
      }
      $form['#attributes']['class'][] = 'gin--has-sticky-form-actions';

      // Assign status to gin_actions.
      $form['gin_sticky_actions']['status'] = [
        '#type' => 'container',
        '#weight' => -1,
        '#multilingual' => TRUE,
      ];

      // Only alter the status field on content forms.
      if ($is_content_form) {
        // Set form id to status field.
        if (isset($form['status']['widget']['value'])) {
          $form['status']['widget']['value']['#attributes']['form'] = $form['#id'];
          $widget_type = $form['status']['widget']['value']['#type'] ?? FALSE;
        }
        else {
          $widget_type = $form['status']['widget']['#type'] ?? FALSE;
        }
        // Only move status to status group if it is a checkbox.
        if ($widget_type === 'checkbox') {
          $form['status']['#group'] = 'status';
        }
      }

      // Helper item to move focus to sticky header.
      $form['gin_move_focus_to_sticky_bar'] = [
        '#markup' => '<a href="#" class="visually-hidden" role="button" gin-move-focus-to-sticky-bar>Moves focus to sticky header actions</a>',
        '#weight' => 999,
      ];

      // Attach library.
      $form['#attached']['library'][] = 'gin/more_actions';
    }

    // Remaining changes only apply to content forms.
    if (!$is_content_form) {
      return;
    }

    // Provide a default meta form element if not already provided.
    // @see NodeForm::form()
    $form['advanced']['#attributes']['class'][] = 'entity-meta';
    if (!isset($form['meta'])) {
      $form['meta'] = [
        '#group' => 'advanced',
        '#weight' => -10,
        '#title' => $this->t('Status'),
        '#attributes' => ['class' => ['entity-meta__header']],
        '#tree' => TRUE,
      ];
    }

    $this->ensureAdvancedSettings($form);

    // Add sidebar toggle.
    $hide_panel = $this->t('Hide sidebar panel');
    $form['gin_sticky_actions']['gin_sidebar_toggle'] = [
      '#markup' => '<a href="#toggle-sidebar" class="meta-sidebar__trigger trigger" role="button" title="' . $hide_panel . '" aria-controls="gin_sidebar"><span class="visually-hidden">' . $hide_panel . '</span></a>',
      '#weight' => 1000,
    ];
    $form['#attached']['library'][] = 'gin/sidebar';

    // Create gin_sidebar group.
    $form['gin_sidebar'] = [
      '#group' => 'meta',
      '#type' => 'container',
      '#weight' => 99,
      '#multilingual' => TRUE,
      '#attributes' => [
        'class' => [
          'gin-sidebar',
        ],
      ],
    ];
    // Copy footer over.
    $form['gin_sidebar']['footer'] = ($form['footer']) ?? [];

    // Sidebar close button.
    $close_sidebar_translation = $this->t('Close sidebar panel');
    $form['gin_sidebar']['gin_sidebar_close'] = [
      '#markup' => '<a href="#close-sidebar" class="meta-sidebar__close trigger" role="button" title="' . $close_sidebar_translation . '"><span class="visually-hidden">' . $close_sidebar_translation . '</span></a>',
    ];

    $form['gin_sidebar_overlay'] = [
      '#markup' => '<div class="meta-sidebar__overlay trigger"></div>',
    ];

    // Specify necessary node form theme and library.
    // @see gin_form_node_form_alter
    $form['#theme'] = ['node_edit_form'];
    // Attach libraries.
    $form['#attached']['library'][] = 'gin/node-form';
    $form['#attached']['library'][] = 'gin/edit_form';

    // Add a class that allows the logic in edit_form.js to identify the form.
    $form['#attributes']['class'][] = 'gin-node-edit-form';

    // If not logged in hide changed and author node info on add forms.
    $not_logged_in = $this->currentUser->isAnonymous();
    $route = $this->routeMatch->getRouteName();

    if ($not_logged_in && $route === 'node.add') {
      unset($form['meta']['changed'], $form['meta']['author']);
    }
  }

  /**
   * Check if we´re on a content edit form.
   *
   * _gin_is_content_form() is replaced by
   * \Drupal::classResolver(ContentFormHelper::class)->isContentForm().
   *
   * @param \Drupal\Core\Form\FormStateInterface|null $form_state
   *   The current state of the form.
   * @param string $form_id
   *   The form id.
   */
  public function isContentForm(?FormStateInterface $form_state = NULL, string $form_id = ''): bool {
    static $is_content_form;
    if ($is_content_form) {
      return TRUE;
    }
    if ($form_id) {
      // Forms to exclude.
      // If media library widget, don't use new content edit form.
      // gin_preprocess_html is not triggered here, so checking
      // the form id is enough.
      $form_ids_to_ignore = [
        'media_library_add_form_',
        'views_form_media_library_widget_',
        'views_exposed_form',
      ];
      $form_ids_to_ignore = array_merge($this->moduleHandler->invokeAll('admin_content_form_ignore_form_ids'), $form_ids_to_ignore);
      foreach ($form_ids_to_ignore as $form_id_to_ignore) {
        if (str_contains($form_id, $form_id_to_ignore)) {
          return FALSE;
        }
      }
    }
    if ($form_state && (($form_state->getBuildInfo()['base_form_id'] ?? NULL) === 'node_form' || $form_state->getFormObject() instanceof ContentEntityFormInterface)) {
      $is_content_form = TRUE;
      return TRUE;
    }

    static $is_content_form_route;
    if (!isset($is_content_form_route)) {
      // Get route name.
      $route_name = $this->routeMatch->getRouteName();

      // Routes to include.
      $route_names = [
        'node.add',
        'block_content.add_page',
        'block_content.add_form',
        'entity.block_content.canonical',
        'entity.media.add_form',
        'entity.media.canonical',
        'entity.media.edit_form',
        'entity.node.content_translation_add',
        'entity.node.content_translation_edit',
        'entity.node.edit_form',
        'entity.menu.add_link_form',
        'menu_ui.link_edit',
      ];

      // API check.
      $additional_routes = $this->moduleHandler->invokeAll('admin_content_form_routes');
      $route_names = array_merge($additional_routes, $route_names);
      $this->moduleHandler->alter('admin_content_form_routes', $route_names);
      $this->themeManager->alter('admin_content_form_routes', $route_names);

      $is_content_form_route = in_array($route_name, $route_names, TRUE);
    }
    return $is_content_form_route;
  }

  /**
   * Check the context we're in.
   *
   * Checks if the form is in either
   * a modal or an off-canvas dialog.
   */
  private function isModalOrOffcanvas(): bool {
    $wrapper_format = $this->getRequestWrapperFormat() ?? '';
    return str_contains($wrapper_format, 'drupal_modal') ||
      str_contains($wrapper_format, 'drupal_dialog');
  }

  /**
   * Helper function to remember the form actions after form has been built.
   */
  public static function formAfterBuild(array $form): array {
    if (self::useStickyActionButtons()) {
      // Allowlist for visible actions.
      $includes = ['save', 'submit', 'preview'];

      // Build actions.
      foreach (Element::children($form['actions']) as $key) {
        $button = ($form['actions'][$key]) ?? [];

        if (!($button['#access'] ?? TRUE)) {
          continue;
        }

        if (Helper::moduleIsActive('navigation')) {
          $form['gin_sticky_actions']['actions'][$key] = $button;
        }

        // The media_type_add_form form is a special case.
        // @see https://www.drupal.org/project/gin/issues/3534385
        // @see \Drupal\media\MediaTypeForm::actions
        if ((isset($button['#type']) && $button['#type'] === 'submit') || $form['#form_id'] === 'media_type_add_form') {
          // Update button.
          $button['#attributes']['id'] = 'gin-sticky-' . $button['#id'];
          $button['#attributes']['form'] = $form['#id'];
          $button['#attributes']['data-drupal-selector'] = 'gin-sticky-' . $button['#attributes']['data-drupal-selector'];
          $button['#attributes']['data-gin-sticky-form-selector'] = $button['#attributes']['data-drupal-selector'];

          // Add the button to the form actions array.
          if (!empty($button['#gin_action_item']) || Helper::moduleIsActive('navigation') || in_array($key, $includes, TRUE)) {
            $form['gin_sticky_actions']['actions'][$key] = $button;
          }
        }
      }
    }

    Helper::formActions($form['gin_sticky_actions'] ?? NULL);
    unset($form['gin_sticky_actions']);

    return $form;
  }

  /**
   * Ensure correct settings for advanced, meta and revision form elements.
   *
   * @param array $form
   *   The form.
   */
  public function ensureAdvancedSettings(array &$form): void {
    $form['advanced']['#type'] = 'container';
    $form['advanced']['#accordion'] = TRUE;
    $form['meta']['#type'] = 'container';
    $form['meta']['#access'] = TRUE;

    $form['revision_information']['#type'] = 'container';
    $form['revision_information']['#group'] = 'meta';
    $form['revision_information']['#attributes']['class'][] = 'entity-meta__revision';
  }

}
