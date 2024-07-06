<?php

namespace Drupal\gin;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\EventSubscriber\MainContentViewSubscriber;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Theme\ThemeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Service to handle content form overrides.
 */
class GinContentFormHelper implements ContainerInjectionInterface {

  use StringTranslationTrait;

  /**
   * The current user object.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * The module handler service.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected $moduleHandler;

  /**
   * The current route match.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected $routeMatch;

  /**
   * The theme manager.
   *
   * @var \Drupal\Core\Theme\ThemeManagerInterface
   */
  protected $themeManager;

  /**
   * The HTTP request stack.
   *
   * @var \Symfony\Component\HttpFoundation\RequestStack
   */
  protected $requestStack;

  /**
   * GinContentFormHelper constructor.
   *
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler.
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The current route match.
   * @param \Drupal\Core\Theme\ThemeManagerInterface $theme_manager
   *   The theme manager.
   * @param \Symfony\Component\HttpFoundation\RequestStack $request_stack
   *   The HTTP request stack.
   */
  public function __construct(AccountInterface $current_user, ModuleHandlerInterface $module_handler, RouteMatchInterface $route_match, ThemeManagerInterface $theme_manager, RequestStack $request_stack) {
    $this->currentUser = $current_user;
    $this->moduleHandler = $module_handler;
    $this->routeMatch = $route_match;
    $this->themeManager = $theme_manager;
    $this->requestStack = $request_stack;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('current_user'),
      $container->get('module_handler'),
      $container->get('current_route_match'),
      $container->get('theme.manager'),
      $container->get('request_stack'),
    );
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
  public function formAlter(array &$form, FormStateInterface $form_state, $form_id) {
    if ($this->isModalOrOffcanvas()) {
      $form['is_ajax_request'] = ['#weight' => -1];
      return FALSE;
    }

    // Sticky action buttons.
    if ($this->stickyActionButtons($form, $form_state, $form_id) || $this->isContentForm($form, $form_state, $form_id)) {
      // Action buttons.
      if (isset($form['actions'])) {
        if (isset($form['actions']['preview'])) {
          // Put Save after Preview.
          $save_weight = $form['actions']['preview']['#weight'] ? $form['actions']['preview']['#weight'] + 1 : 11;
          $form['actions']['submit']['#weight'] = $save_weight;
        }

        // Add sticky class.
        $form['actions']['#attributes']['class'][] = 'gin-sticky-form-actions';
        // Move to last position possible.
        $form['actions']['#weight'] = 999;

        // Add a class to identify modified forms.
        if (!isset($form['#attributes']['class'])) {
          $form['#attributes']['class'] = [];
        }
        elseif (is_string($form['#attributes']['class'])) {
          $form['#attributes']['class'] = [$form['#attributes']['class']];
        }
        $form['#attributes']['class'][] = 'gin--has-sticky-form-actions';

        // Create gin_more_actions group.
        $toggle_more_actions = t('More actions');
        $form['actions']['gin_more_actions'] = [
          '#type' => 'container',
          '#multilingual' => TRUE,
          '#weight' => 998,
          '#attributes' => [
            'class' => ['gin-more-actions'],
          ],
          'gin_more_actions_toggle' => [
            '#markup' => '<a href="#toggle-more-actions" class="gin-more-actions__trigger trigger" data-gin-tooltip role="button" title="' . $toggle_more_actions . '" aria-controls="gin_more_actions"><span class="visually-hidden">' . $toggle_more_actions . '</span></a>',
            '#weight' => 1,
          ],
          'gin_more_actions_items' => [
            '#type' => 'container',
            '#multilingual' => TRUE,
          ],
        ];

        // Prepare actions.
        foreach (Element::children($form['actions']) as $key => $item) {
          // Attach to original form id.
          $form['actions'][$item]['#attributes']['form'] = $form['#id'];
        }

        // Move all actions over.
        $form['actions']['gin_more_actions']['gin_more_actions_items'] = ($form['actions']) ?? [];
        $form['actions']['gin_more_actions']['gin_more_actions_items']['#weight'] = 2;
        $form['actions']['gin_more_actions']['gin_more_actions_items']['#attributes']['class'] = ['gin-more-actions__menu'];

        // Unset all items we move to the more actions menu.
        $excludes = ['save', 'submit', 'preview', 'gin_more_actions'];
        foreach (Element::children($form['actions']) as $key => $item) {
          if (!empty($form['actions'][$item]['#gin_action_item'])) {
            $excludes[] = $item;
          }
          if (!in_array($item, $excludes, TRUE)) {
            unset($form['actions'][$item]);
          }
          else {
            unset($form['actions']['gin_more_actions']['gin_more_actions_items'][$item]);
          }
        }

        // Assign status to gin_actions.
        $form['actions']['gin_actions'] = [
          '#type' => 'container',
          '#weight' => -1,
          '#multilingual' => TRUE,
        ];

        // Set form id to status field.
        if (isset($form['status']['widget']) && isset($form['status']['widget']['value'])) {
          $form['status']['widget']['value']['#attributes']['form'] = $form['#id'];
        }
        $form['status']['#group'] = 'gin_actions';

        // Helper item to move focus to sticky header.
        $form['gin_move_focus_to_sticky_bar'] = [
          '#markup' => '<a href="#" class="visually-hidden" role="button" gin-move-focus-to-sticky-bar>Moves focus to sticky header actions</a>',
          '#weight' => 999,
        ];

        // Attach library.
        $form['#attached']['library'][] = 'gin/more_actions';

        $form['#after_build'][] = 'gin_form_after_build';
      }
    }

    // Are we on an edit form?
    if (!$this->isContentForm($form, $form_state, $form_id)) {
      return;
    }

    // Provide a default meta form element if not already provided.
    // @see NodeForm::form()
    $form['advanced']['#attributes']['class'][] = 'entity-meta';
    if (!isset($form['meta'])) {
      $form['meta'] = [
        '#type' => 'container',
        '#group' => 'advanced',
        '#weight' => -10,
        '#title' => $this->t('Status'),
        '#attributes' => ['class' => ['entity-meta__header']],
        '#tree' => TRUE,
        '#access' => TRUE,
      ];
    }

    // Ensure correct settings for advanced, meta and revision form elements.
    $form['advanced']['#type'] = 'container';
    $form['advanced']['#accordion'] = TRUE;
    $form['meta']['#type'] = 'container';
    $form['meta']['#access'] = TRUE;

    $form['revision_information']['#type'] = 'container';
    $form['revision_information']['#group'] = 'meta';
    $form['revision_information']['#attributes']['class'][] = 'entity-meta__revision';

    // Action buttons.
    if (isset($form['actions'])) {
      // Add sidebar toggle.
      $hide_panel = t('Hide sidebar panel');
      $form['actions']['gin_sidebar_toggle'] = [
        '#markup' => '<a href="#toggle-sidebar" class="meta-sidebar__trigger trigger" data-gin-tooltip role="button" title="' . $hide_panel . '" aria-controls="gin_sidebar"><span class="visually-hidden">' . $hide_panel . '</span></a>',
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
      $close_sidebar_translation = t('Close sidebar panel');
      $form['gin_sidebar']['gin_sidebar_close'] = [
        '#markup' => '<a href="#close-sidebar" class="meta-sidebar__close trigger" data-gin-tooltip role="button" title="' . $close_sidebar_translation . '"><span class="visually-hidden">' . $close_sidebar_translation . '</span></a>',
      ];

      $form['gin_sidebar_overlay'] = [
        '#markup' => '<div class="meta-sidebar__overlay trigger"></div>',
      ];
    }

    // Specify necessary node form theme and library.
    // @see claro_form_node_form_alter
    $form['#theme'] = ['node_edit_form'];
    // Attach libraries.
    $form['#attached']['library'][] = 'claro/node-form';
    $form['#attached']['library'][] = 'gin/edit_form';

    // Add a class that allows the logic in edit_form.js to identify the form.
    $form['#attributes']['class'][] = 'gin-node-edit-form';

    // If not logged in hide changed and author node info on add forms.
    $not_logged_in = $this->currentUser->isAnonymous();
    $route = $this->routeMatch->getRouteName();

    if ($not_logged_in && $route == 'node.add') {
      unset($form['meta']['changed']);
      unset($form['meta']['author']);
    }

  }

  /**
   * Sticky action buttons.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   * @param string $form_id
   *   The form id.
   */
  public function stickyActionButtons(array $form = NULL, FormStateInterface $form_state = NULL, $form_id = NULL) {
    // Generally don't use sticky buttons in Ajax requests (modals).
    if ($this->isModalOrOffcanvas()) {
      return FALSE;
    }

    /** @var \Drupal\gin\GinSettings $settings */
    $settings = \Drupal::classResolver(GinSettings::class);

    // Get route name.
    $route_name = $this->routeMatch->getRouteName();

    // Sets default to TRUE if setting is enabled.
    $sticky_action_buttons = $settings->get('sticky_action_buttons') ? TRUE : FALSE;

    // API check.
    $form_ids = $this->moduleHandler->invokeAll('gin_ignore_sticky_form_actions');
    $this->moduleHandler->alter('gin_ignore_sticky_form_actions', $form_ids);
    $this->themeManager->alter('gin_ignore_sticky_form_actions', $form_ids);

    if (
      strpos($form_id, '_exposed_form') !== FALSE ||
      strpos($form_id, '_preview_form') !== FALSE ||
      strpos($form_id, '_delete_form') !== FALSE ||
      strpos($form_id, '_confirm_form') !== FALSE ||
      in_array($form_id, $form_ids, TRUE) ||
      in_array($route_name, $form_ids, TRUE)
    ) {
      $sticky_action_buttons = FALSE;
    }

    return $sticky_action_buttons;
  }

  /**
   * Check if we´re on a content edit form.
   *
   * _gin_is_content_form() is replaced by
   * \Drupal::classResolver(GinContentFormHelper::class)->isContentForm().
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   * @param string $form_id
   *   The form id.
   */
  public function isContentForm(array $form = NULL, FormStateInterface $form_state = NULL, $form_id = '') {
    // Generally ignore all forms in Ajax requests (modals).
    if ($this->isModalOrOffcanvas()) {
      return FALSE;
    }

    // Forms to exclude.
    // If media library widget, don't use new content edit form.
    // gin_preprocess_html is not triggered here, so checking
    // the form id is enough.
    $form_ids_to_ignore = [
      'media_library_add_form_',
      'views_form_media_library_widget_',
      'views_exposed_form',
      'date_recur_modular_sierra_occurrences_modal',
      'date_recur_modular_sierra_modal',
    ];

    foreach ($form_ids_to_ignore as $form_id_to_ignore) {
      if ($form_id && strpos($form_id, $form_id_to_ignore) !== FALSE) {
        return FALSE;
      }
    }

    $is_content_form = FALSE;

    // Get route name.
    $route_name = $this->routeMatch->getRouteName();

    // Routes to include.
    $route_names = [
      'node.add',
      'block_content.add_page',
      'entity.block_content.canonical',
      'entity.media.add_form',
      'entity.media.canonical',
      'entity.node.content_translation_add',
      'entity.node.content_translation_edit',
      'quick_node_clone.node.quick_clone',
      'entity.node.edit_form',
    ];

    // API check.
    $additional_routes = $this->moduleHandler->invokeAll('gin_content_form_routes');
    $route_names = array_merge($additional_routes, $route_names);
    $this->moduleHandler->alter('gin_content_form_routes', $route_names);
    $this->themeManager->alter('gin_content_form_routes', $route_names);

    if (
      in_array($route_name, $route_names, TRUE) ||
      ($form_state && ($form_state->getBuildInfo()['base_form_id'] ?? NULL) === 'node_form') ||
      ($route_name === 'entity.group_content.create_form' && substr($this->routeMatch->getParameter('plugin_id'), 0, 11) === "group_node:") ||
      ($route_name === 'entity.group_relationship.create_form' && substr($this->routeMatch->getParameter('plugin_id'), 0, 11) === "group_node:")
    ) {
      $is_content_form = TRUE;
    }

    return $is_content_form;
  }

  /**
   * Check the context we're in.
   *
   * Checks if the form is in either
   * a modal or an off-canvas dialog.
   */
  private function isModalOrOffcanvas() {
    $wrapper_format = \Drupal::request()->query->get(MainContentViewSubscriber::WRAPPER_FORMAT);
    return (in_array($wrapper_format, [
      'drupal_modal',
      'drupal_dialog',
      'drupal_dialog.off_canvas',
    ])) ? TRUE : FALSE;
  }

}
