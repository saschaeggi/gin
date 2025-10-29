<?php

namespace Drupal\gin\Hook;

use Drupal\Component\Render\FormattableMarkup;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\DependencyInjection\ClassResolverInterface;
use Drupal\Core\Entity\EntityForm;
use Drupal\Core\Entity\EntityFormInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\File\Exception\FileException;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Hook\Attribute\Hook;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Render\Element;
use Drupal\Core\State\StateInterface;
use Drupal\Core\StreamWrapper\StreamWrapperManager;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\Core\Url;
use Drupal\gin\ClassResolverTrait;
use Drupal\gin\Helper;
use Drupal\gin\Settings;
use Drupal\media\MediaForm;
use Drupal\user\Routing\RouteSubscriber;
use Drupal\views\Form\ViewsForm;
use Drupal\views_ui\Form\Ajax\ViewsFormInterface;

/**
 * Provides form related hook implementations.
 */
class FormHooks {

  use ClassResolverTrait;
  use StringTranslationTrait;

  /**
   * Constructs the form related hooks.
   */
  public function __construct(
    protected ClassResolverInterface $classResolver,
    protected readonly ModuleHandlerInterface $moduleHandler,
    protected readonly ConfigFactoryInterface $configFactory,
    protected readonly StateInterface $state,
    protected readonly MessengerInterface $messenger,
  ) {}

  /**
   * Implements hook_form_alter().
   */
  #[Hook('form_alter')]
  public function formAlter(array &$form, FormStateInterface $form_state, string $form_id): void {
    $build_info = $form_state->getBuildInfo();
    $form_object = $form_state->getFormObject();

    // Make entity forms delete link use the action-link component.
    if (isset($form['actions']['delete']['#type']) && $form['actions']['delete']['#type'] === 'link' && !empty($build_info['callback_object']) && $build_info['callback_object'] instanceof EntityForm) {
      $form['actions']['delete'] = Helper::convertLinkToActionLink($form['actions']['delete'], 'trash', 'default', 'danger');
    }

    if (isset($form['actions']['delete_translation']['#type']) && $form['actions']['delete_translation']['#type'] === 'link' && !empty($build_info['callback_object']) && $build_info['callback_object'] instanceof EntityForm) {
      $form['actions']['delete_translation'] = Helper::convertLinkToActionLink($form['actions']['delete_translation'], 'trash', 'default', 'danger');
    }

    if (($form_object instanceof ViewsForm || $form_object instanceof ViewsFormInterface) && isset($form['override']['#prefix'])) {
      // Replace form--inline class so positioning of override form elements
      // don't have to depend on floats.
      $form['override']['#prefix'] = str_replace('form--inline', 'form--flex', $form['override']['#prefix']);
    }

    if ($form_object instanceof ViewsForm && str_starts_with($form_object->getBaseFormId(), 'views_form_media_library')) {
      if (isset($form['header'])) {
        $form['header']['#attributes']['class'][] = 'media-library-views-form__header';
        $form['header']['media_bulk_form']['#attributes']['class'][] = 'media-library-views-form__bulk_form';
      }
      $form['actions']['submit']['#attributes']['class'] = ['media-library-select'];
      $form['#attributes']['class'][] = 'media-library-views-form';
    }

    if ($form_object instanceof ViewsForm && !empty($form['header'])) {
      $view = $form_state->getBuildInfo()['args'][0];
      $view_title = $view->getTitle();

      // Determine if the Views form includes a bulk operations form. If it
      // does, move it to the bottom and remove the second bulk operations
      // submit.
      foreach (Element::children($form['header']) as $key) {
        if (str_contains($key, '_bulk_form')) {
          // Move the bulk actions form from the header to its own container.
          $form['bulk_actions_container'] = $form['header'][$key];
          // Remove the supplementary bulk operations submit button as it
          // appears in the same location the form was moved to.
          unset($form['header'][$key], $form['actions']);

          $form['bulk_actions_container']['#attributes']['data-drupal-views-bulk-actions'] = '';
          $form['bulk_actions_container']['#attributes']['class'][] = 'views-bulk-actions';
          $form['bulk_actions_container']['actions']['submit']['#button_type'] = 'primary';
          $form['bulk_actions_container']['actions']['submit']['#attributes']['class'][] = 'button--small';
          $label = $this->t('Perform actions on the selected items in the %view_title view', ['%view_title' => $view_title]);
          $label_id = $key . '_group_label';

          // Group the bulk actions select and submit elements, and add a label
          // that makes the purpose of these elements more clear to
          // screen readers.
          $form['bulk_actions_container']['#attributes']['role'] = 'group';
          $form['bulk_actions_container']['#attributes']['aria-labelledby'] = $label_id;
          $form['bulk_actions_container']['group_label'] = [
            '#type' => 'container',
            '#markup' => $label,
            '#attributes' => [
              'id' => $label_id,
              'class' => ['visually-hidden'],
            ],
            '#weight' => -1,
          ];

          // Add a status label for counting the number of items selected.
          $form['bulk_actions_container']['status'] = [
            '#type' => 'container',
            '#markup' => $this->t('No items selected'),
            '#weight' => -1,
            '#attributes' => [
              'class' => [
                'js-views-bulk-actions-status',
                'views-bulk-actions__item',
                'views-bulk-actions__item--status',
                'js-show',
              ],
              'data-drupal-views-bulk-actions-status' => '',
            ],
          ];

          // Loop through bulk actions items and add the needed CSS classes.
          $bulk_action_item_keys = Element::children($form['bulk_actions_container'], TRUE);
          $bulk_last_key = NULL;
          $bulk_child_before_actions_key = NULL;
          foreach ($bulk_action_item_keys as $bulk_action_item_key) {
            if (!empty($form['bulk_actions_container'][$bulk_action_item_key]['#type'])) {
              if ($form['bulk_actions_container'][$bulk_action_item_key]['#type'] === 'actions') {
                // We need the key of the element that precedes the actions
                // element.
                $bulk_child_before_actions_key = $bulk_last_key;
                $form['bulk_actions_container'][$bulk_action_item_key]['#attributes']['class'][] = 'views-bulk-actions__item';
              }

              if (!in_array($form['bulk_actions_container'][$bulk_action_item_key]['#type'], ['hidden', 'actions'])) {
                $form['bulk_actions_container'][$bulk_action_item_key]['#wrapper_attributes']['class'][] = 'views-bulk-actions__item';
                $bulk_last_key = $bulk_action_item_key;
              }
            }
          }

          if ($bulk_child_before_actions_key) {
            $form['bulk_actions_container'][$bulk_child_before_actions_key]['#wrapper_attributes']['class'][] = 'views-bulk-actions__item--preceding-actions';
          }
        }
      }
    }

    $this->getContentFormHelper()->formAlter($form, $form_state, $form_id);

    // User form (Login, Register or Forgot password).
    if (str_contains($form_id, 'user_login') || str_contains($form_id, 'user_register') || str_contains($form_id, 'user_pass')) {
      $form['actions']['submit']['#attributes']['class'][] = 'button--primary';
      // Check if site is in maintenance mode.
      // Display a message if true.
      if ($this->state->get('system.maintenance_mode')) {
        $this->messenger->addWarning(
          new FormattableMarkup($this->configFactory->get('system.maintenance')->get('message'), [
            '@site' => $this->configFactory->get('system.site')->get('name'),
          ])
        );
      }
    }
    // Adding button/links to Register and Forgot password.
    if (str_contains($form_id, 'user_login')) {
      // Move actions before new elements.
      $form['actions']['#weight'] = '98';

      // Add new class to submit button.
      $form['actions']['submit']['#attributes']['class'][] = 'button-login';

      // New wrapper.
      $form['more-links'] = [
        '#type' => 'container',
        '#weight' => '99',
        '#attributes' => ['class' => ['more-links']],
      ];

      // Register button.
      $register_url = Url::fromRoute('user.register');
      if ($register_url->access()) {
        $form['more-links']['register_button'] = [
          '#type' => 'link',
          '#url' => $register_url,
          '#title' => $this->t('Create new account'),
          '#attributes' => [
            'class' => [
              'register-button',
              'button',
              'button--secondary',
            ],
          ],
          '#weight' => '1',
        ];
      }

      // Forgot password link.
      $form['more-links']['forgot_password_link'] = [
        '#type' => 'link',
        '#url' => Url::fromRoute('user.pass'),
        '#title' => $this->t('Forgot your password?'),
        '#attributes' => ['class' => ['link', 'forgot-password-link']],
        '#weight' => '2',
      ];
    }
    // Changing name of Reset button.
    if (str_contains($form_id, 'user_pass')) {
      $form['actions']['submit']['#value'] = $this->t('Reset');
    }

    // Bulk forms: update action & actions to small variants.
    if (isset($form['header']) && str_contains($form_id, 'views_form')) {
      $bulk_form = current(preg_grep('/_bulk_form/', array_keys($form['header'])));

      if (isset($form['header'][$bulk_form])) {
        $form['header'][$bulk_form]['action']['#attributes']['class'][] = 'form-element--type-select--small';
        $form['header'][$bulk_form]['actions']['submit']['#attributes']['class'][] = 'button--small';

        // Remove double entry of submit button.
        unset($form['actions']['submit']);
      }
    }

    // Delete forms: alter buttons.
    if (str_contains($form_id, 'delete_form')) {
      $form['actions']['submit']['#attributes']['class'][] = 'button--danger';
      $form['actions']['cancel']['#attributes']['class'][] = 'button--secondary';
    }
  }

  /**
   * Implements hook_form_BASE_FORM_ID_alter() for \Drupal\media\MediaForm.
   */
  #[Hook('form_media_form_alter')]
  public function formMediaFormAlter(array &$form, FormStateInterface $form_state): void {
    // Only attach CSS from core if this form comes from Media core, and not
    // from the contrib Media Entity 1.x branch.
    if ($this->moduleHandler->moduleExists('media') && $form_state->getFormObject() instanceof MediaForm) {
      // @todo Revisit after https://www.drupal.org/node/2892304 is in. It
      //   introduces a footer region to these forms which will allow for us to
      //   display a top border over the published checkbox by defining a
      //   media-edit-form.html.twig template the same way node does.
      $form['#attached']['library'][] = 'gin/media-form';
    }
  }

  /**
   * Implements hook_form_BASE_FORM_ID_alter().
   */
  #[Hook('form_media_library_add_form_alter')]
  public function formMediaLibraryAddFormAlter(array &$form): void {
    $form['#attributes']['class'][] = 'media-library-add-form';
    $form['#attached']['library'][] = 'gin/media_library.theme';

    // If there are unsaved media items, apply styling classes to various parts
    // of the form.
    if (isset($form['media'])) {
      $form['#attributes']['class'][] = 'media-library-add-form--with-input';

      // Put a wrapper around the informational message above the unsaved media
      // items.
      $form['description']['#template'] = '<p class="media-library-add-form__description">{{ text }}</p>';
    }
    else {
      $form['#attributes']['class'][] = 'media-library-add-form--without-input';
    }
  }

  /**
   * Implements hook_form_FORM_ID_alter().
   */
  #[Hook('form_media_library_add_form_oembed_alter')]
  public function formMediaLibraryAddFormOembedAlter(array &$form): void {
    $form['#attributes']['class'][] = 'media-library-add-form--oembed';

    // If no media items have been added yet, add a couple of styling classes
    // to the initial URL form.
    if (isset($form['container'])) {
      $form['container']['#attributes']['class'][] = 'media-library-add-form__input-wrapper';
      $form['container']['url']['#attributes']['class'][] = 'media-library-add-form-oembed-url';
      $form['container']['submit']['#attributes']['class'][] = 'media-library-add-form-oembed-submit';
    }
  }

  /**
   * Implements hook_form_FORM_ID_alter().
   */
  #[Hook('form_media_library_add_form_upload_alter')]
  public function formMediaLibraryAddFormUploadAlter(array &$form): void {
    $form['#attributes']['class'][] = 'media-library-add-form--upload';
    if (isset($form['container']['upload'])) {
      // Set this flag so we can prevent the details element from being added
      // in \Drupal\gin\Hook\ThemeHooks::managedFile.
      $form['container']['upload']['#do_not_wrap_in_details'] = TRUE;
    }
    if (isset($form['container'])) {
      $form['container']['#attributes']['class'][] = 'media-library-add-form__input-wrapper';
    }
  }

  /**
   * Implements hook_form_BASE_FORM_ID_alter() for MenuLinkContentForm.
   *
   * Alters the menu_link_content_form by organizing form elements into
   * different 'details' sections.
   */
  #[Hook('form_menu_link_content_form_alter')]
  public function formMenuLinkContentFormAlter(array &$form): void {
    $form['#theme'] = ['menu_link_form'];
    $form['#attached']['library'][] = 'gin/form-two-columns';
    $form['advanced'] = [
      '#type' => 'container',
      '#weight' => 10,
      '#accordion' => TRUE,
    ];
    $form['menu_parent']['#wrapper_attributes'] = ['class' => ['accordion__item', 'entity-meta__header']];
    $form['menu_parent']['#prefix'] = '<div class="accordion">';
    $form['menu_parent']['#suffix'] = '</div>';
    $form['menu_parent']['#group'] = 'advanced';

    $form['menu_link_display_settings'] = [
      '#type' => 'details',
      '#group' => 'advanced',
      '#title' => $this->t('Display settings'),
      '#attributes' => ['class' => ['entity-meta__options']],
      '#tree' => FALSE,
      '#accordion' => TRUE,
    ];
    if (!empty($form['weight'])) {
      $form['menu_link_display_settings']['weight'] = $form['weight'];
      unset($form['weight'], $form['menu_link_display_settings']['weight']['#weight']);
    }
    if (!empty($form['expanded'])) {
      $form['menu_link_display_settings']['expanded'] = $form['expanded'];
      unset($form['expanded']);
    }

    if (isset($form['description'])) {
      $form['menu_link_description'] = [
        '#type' => 'details',
        '#group' => 'advanced',
        '#title' => $this->t('Description'),
        '#attributes' => ['class' => ['entity-meta__description']],
        '#tree' => FALSE,
        '#accordion' => TRUE,
        'description' => $form['description'],
      ];
      unset($form['description']);
    }
  }

  /**
   * Implements hook_form_FORM_ID_alter() for MenuLinkEditForm.
   *
   * Alters the menu_link_edit form by organizing form elements into different
   * 'details' sections.
   */
  #[Hook('form_menu_link_edit_alter')]
  public function formMenuLinkEditAlter(array &$form): void {
    $this->formMenuLinkContentFormAlter($form);
  }

  /**
   * Implements hook_form_BASE_FORM_ID_alter() for \Drupal\node\Form\NodeForm.
   *
   * Changes vertical tabs to container.
   */
  #[Hook('form_node_form_alter')]
  public function formNodeFormAlter(array &$form): void {
    $form['#theme'] = ['node_edit_form'];
    $form['#attached']['library'][] = 'gin/form-two-columns';
    $this->getContentFormHelper()->ensureAdvancedSettings($form);
  }

  /**
   * Implements hook_form_FORM_ID_alter().
   */
  #[Hook('form_node_preview_form_select_alter')]
  public function formNodePreviewFormSelectAlter(array &$form): void {
    if (isset($form['backlink'])) {
      $form['backlink']['#options']['attributes']['class'][] = 'action-link';
      $form['backlink']['#options']['attributes']['class'][] = 'action-link--icon-chevron-left';
    }
  }

  /**
   * Implements hook_form_FORM_ID_alter() for the system_modules form.
   */
  #[Hook('form_system_modules_alter')]
  public function formSystemModulesAlter(array &$form): void {
    if (isset($form['filters'])) {
      $form['filters']['#attributes']['class'][] = 'modules-table-filter';
      if (isset($form['filters']['text'])) {
        unset($form['filters']['text']['#title_display']);
        $form['filters']['text']['#title'] = $this->t('Filter');
      }
    }

    // Convert module links to action links.
    foreach (Element::children($form['modules']) as $key) {
      $link_key_to_action_link_type = [
        'help' => 'questionmark',
        'permissions' => 'key',
        'configure' => 'cog',
      ];
      if (isset($form['modules'][$key]['#type']) && $form['modules'][$key]['#type'] === 'details') {
        $form['modules'][$key]['#module_package_listing'] = TRUE;
        foreach (Element::children($form['modules'][$key]) as $module_key) {
          if (isset($form['modules'][$key][$module_key]['links'])) {
            foreach ($form['modules'][$key][$module_key]['links'] as $link_key => &$link) {
              if (array_key_exists($link_key, $link_key_to_action_link_type)) {
                $action_link_type = $link_key_to_action_link_type[$link_key];
                $link['#options']['attributes']['class'][] = 'action-link';
                $link['#options']['attributes']['class'][] = 'action-link--small';
                $link['#options']['attributes']['class'][] = "action-link--icon-$action_link_type";
              }
            }
          }
        }
      }
    }
  }

  /**
   * Custom theme settings.
   */
  #[Hook('form_system_theme_settings_alter')]
  public function formSystemThemeSettingsAlter(array &$form): void {
    if (!isset($form['config_key']['#value']) || $form['config_key']['#value'] !== 'gin.settings') {
      return;
    }
    $settings = $this->getSettings();

    /*
     * //////////////////////////
     * Move default theme settings to bottom.
     * * //////////////////////////
     */
    $form['logo']['#open'] = FALSE;
    $form['logo']['#weight'] = 97;
    $form['favicon']['#open'] = FALSE;
    $form['favicon']['#weight'] = 98;
    $form['theme_settings']['#open'] = FALSE;
    $form['theme_settings']['#weight'] = 99;

    /*
     * //////////////////////////
     * General settings.
     * * ////////////////////////
     */
    $form['custom_settings'] = [
      '#type' => 'details',
      '#open' => TRUE,
      '#title' => $this->t('Settings'),
    ] + $settings->getSettingsForm();

    // Allow user settings.
    $form['custom_settings']['show_user_theme_settings'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Users can override admin settings'),
      '#description' => $this->t('Expose the admin theme settings to users.'),
      '#default_value' => $settings->getDefault('show_user_theme_settings'),
    ];

    /*
     * //////////////////////////
     * Modern Login settings.
     * * ////////////////////////
     */
    if (RouteSubscriber::isUserLoginAdminThemeEnabled() && $this->moduleHandler->moduleExists('file')) {
      $form['brand_image'] = [
        '#type' => 'details',
        '#open' => FALSE,
        '#title' => $this->t('Login wallpaper'),
        '#weight' => 100,
      ];
      $form['brand_image']['default_brand_image'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('Use random image'),
        '#default_value' => $settings->getDefault('brand_image.use_default'),
        '#tree' => FALSE,
      ];
      $form['brand_image']['settings'] = [
        '#type' => 'container',
        '#states' => [
          'invisible' => [
            'input[name="default_brand_image"]' => ['checked' => TRUE],
          ],
        ],
      ];
      $form['brand_image']['settings']['brand_image_path'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Path to custom image'),
        '#default_value' => $settings->getDefault('brand_image.path') ? $settings->getDefault('brand_image.path') : '',
      ];
      $form['brand_image']['settings']['brand_image_upload'] = [
        '#type' => 'file',
        '#title' => $this->t('Upload image'),
        '#description' => $this->t("If you don't have direct file access to the server, use this field to upload your brand image."),
        '#upload_validators' => [
          'FileIsImage' => [],
          'FileExtension' => [
            'extensions' => 'png gif jpg jpeg apng webp avif',
          ],
        ],
      ];
    }

    // Add handler.
    $form['#validate'][] = [__CLASS__, 'formSystemThemeSettingsAlterValidate'];
    $form['#submit'][] = [__CLASS__, 'formSystemThemeSettingsAlterSubmit'];

    // Attach custom library.
    $form['#attached']['library'][] = 'gin/settings';
  }

  /**
   * Validate theme settings.
   */
  public static function formSystemThemeSettingsAlterValidate(array &$form, FormStateInterface $form_state): void {
    // When intending to use the default logo, unset the logo_path.
    if ($form_state->getValue('default_brand_image')) {
      $form_state
        ->unsetValue('brand_image_path')
        ->unsetValue('brand_image_upload');
    }
    else {
      $file = _file_save_upload_from_form($form['brand_image']['settings']['brand_image_upload'], $form_state, 0);
      if ($file) {
        // Put the temporary file in form_values so we can save it on submit.
        $form_state->setValue('brand_image_upload', $file);
      }

    }
    // If the user provided a path for a brand image, make sure a file exists at
    // that path.
    $path = $form_state->getValue('brand_image_path');

    // Move brand image values to properties to avoid config schema errors when
    // the form submission saves all values in the form to config before the
    // form submission handler below can do its cleanup.
    $brandProperties = [
      $form_state->getValue('default_brand_image'),
      $form_state->getValue('brand_image_path'),
      $form_state->getValue('brand_image_upload'),
    ];
    $form_state->set('brand_image', $brandProperties);
    $form_state
      ->unsetValue('default_brand_image')
      ->unsetValue('brand_image_path')
      ->unsetValue('brand_image_upload');
    if ($path !== NULL) {
      // Absolute local file paths are invalid.
      if (\Drupal::service('file_system')->realpath($path) !== $path) {
        // A path relative to the Drupal root or a fully qualified URI is valid.
        if (is_file($path)) {
          return;
        }
        // Prepend 'public://' for relative file paths within public filesystem.
        if (StreamWrapperManager::getScheme($path) === FALSE) {
          $path = 'public://' . $path;
        }
        if (is_file($path)) {
          $brandProperties[1] = $path;
          $form_state->set('brand_image', $brandProperties);
          return;
        }
      }
      $form_state->setErrorByName('brand_image_path', new TranslatableMarkup('The custom brand image path is invalid.'));
    }
  }

  /**
   * Submit theme settings.
   */
  public static function formSystemThemeSettingsAlterSubmit(array &$form, FormStateInterface $form_state): void {
    $config = \Drupal::configFactory()->getEditable('gin.settings');
    [$default, $path, $upload] = $form_state->get('brand_image');
    if ($default) {
      $config
        ->set('brand_image.use_default', TRUE)
        ->clear('brand_image.path');
    }
    else {
      // If the user uploaded a new brand image, save it to a permanent
      // location and use it in place of the default theme-provided file.
      $default_scheme = \Drupal::configFactory()->get('system.file')->get('default_scheme');
      try {
        if (!empty($upload)) {
          $path = \Drupal::service('file_system')->copy($upload->getFileUri(), $default_scheme . '://');
        }
      }
      catch (FileException) {
        // Ignore.
      }
      $config
        ->set('brand_image.use_default', FALSE)
        ->set('brand_image.path', $path);
    }
    $config->save();
  }

  /**
   * Implements hook_form_FORM_ID_alter() for the user_admin_permissions form.
   */
  #[Hook('form_user_admin_permissions_alter')]
  public function formUserAdminPermissionsAlter(array &$form): void {
    if (isset($form['filters'])) {
      $form['filters']['#attributes']['class'][] = 'permissions-table-filter';
      if (isset($form['filters']['text'])) {
        unset($form['filters']['text']['#title_display']);
        $form['filters']['text']['#title'] = $this->t('Filter');
      }
    }
  }

  /**
   * Implements form_user_form_alter().
   */
  #[Hook('form_user_form_alter')]
  public function formUserFormAlter(array &$form, FormStateInterface $form_state): void {
    // If new user account, don't show settings yet.
    $formObject = $form_state->getFormObject();
    if ($formObject instanceof EntityFormInterface && $formObject->getEntity()->isNew()) {
      return;
    }

    if ($this->getSettings()->allowUserOverrides()) {
      // Inject the settings for the dark mode feature.
      $form['gin_theme_settings'] = [
        '#type' => 'details',
        '#title' => $this->t('Admin theme settings'),
        '#open' => TRUE,
        '#weight' => 90,
      ];

      /** @var \Drupal\Core\Session\AccountInterface $account */
      $account = $form_state->getBuildInfo()['callback_object']->getEntity();
      $form['gin_theme_settings']['enable_user_settings'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('Enable overrides'),
        '#description' => $this->t("Enables default admin theme overrides."),
        '#default_value' => $this->getSettings()->userOverrideEnabled($account),
        '#weight' => 0,
      ];

      $form['gin_theme_settings']['user_settings'] = [
        '#type' => 'container',
        '#states' => [
          // Show if met.
          'visible' => [
            ':input[name="enable_user_settings"]' => ['checked' => TRUE],
          ],
        ],
      ] + $this->getSettings()->getSettingsForm($account);

      // Attach custom library.
      $form['#attached']['library'][] = 'gin/settings';

      array_unshift($form['actions']['submit']['#submit'], [__CLASS__, 'userFormSubmit']);
    }
  }

  /**
   * Submit handler for the user form.
   */
  public static function userFormSubmit(array &$form, FormStateInterface $form_state): void {
    /** @var \Drupal\Core\Session\AccountInterface $account */
    $account = $form_state->getBuildInfo()['callback_object']->getEntity();

    $settings = \Drupal::classResolver(Settings::class);
    $enabledUserOverrides = $form_state->getValue('enable_user_settings');
    if ($enabledUserOverrides) {
      $user_settings = [
        'preset_accent_color' => $form_state->getValue('preset_accent_color'),
        'preset_focus_color' => $form_state->getValue('preset_focus_color'),
        'enable_darkmode' => $form_state->getValue('enable_darkmode'),
        'high_contrast_mode' => (bool) $form_state->getValue('high_contrast_mode'),
        'accent_color' => $form_state->getValue('accent_color'),
        'focus_color' => $form_state->getValue('focus_color'),
        'layout_density' => $form_state->getValue('layout_density'),
        'show_description_toggle' => $form_state->getValue('show_description_toggle'),
      ];
      $settings->setAll($user_settings, $account);
    }
    else {
      $settings->clear($account);
    }
  }

  /**
   * Implements hook_form_FORM_ID_alter() for views_exposed_form.
   */
  #[Hook('form_views_exposed_form_alter')]
  public function formViewsExposedFormAlter(array &$form, FormStateInterface $form_state): void {
    $view = $form_state->getStorage()['view'];
    $view_title = $view->getTitle();

    // Add a label so screen readers can identify the purpose of the exposed
    // form without having to scan content that appears further down the page.
    $form['#attributes']['aria-label'] = $this->t('Filter the contents of the %view_title view', ['%view_title' => $view_title]);
  }

  /**
   * Implements hook_form_FORM_ID_alter() for Views UI add handler form.
   */
  #[Hook('form_views_ui_add_handler_form_alter')]
  public function formViewsUiAddHandlerFormAlter(array &$form): void {
    // Remove container-inline class to allow more control over styling.
    if (isset($form['selected']['#attributes']['class'])) {
      $form['selected']['#attributes']['class'] = array_diff($form['selected']['#attributes']['class'], ['container-inline']);
    }
    // Move all form elements in controls to its parent, this places them all in
    // the same div, which makes it possible to position them with flex styling
    // instead of floats.
    if (isset($form['override']['controls'])) {
      foreach (Element::children($form['override']['controls']) as $key) {
        $form['override']["controls_$key"] = $form['override']['controls'][$key];

        // The wrapper array for controls is removed after this loop completes.
        // The wrapper ensured that its child elements were hidden in browsers
        // without JavaScript. To replicate this functionality, the `.js-show`
        // class is added to each item previously contained in the wrapper.
        if (isset($form['override']['controls']['#id']) && $form['override']['controls']['#id'] === 'views-filterable-options-controls') {
          $form['override']["controls_$key"]['#wrapper_attributes']['class'][] = 'js-show';
        }
      }

      unset($form['override']['controls']);
    }
  }

  /**
   * Implements hook_form_FORM_ID_alter() for the Views UI config form.
   */
  #[Hook('form_views_ui_config_item_form_alter')]
  public function formViewsUiConfigItemFormAlter(array &$form, FormStateInterface $form_state): void {
    $type = $form_state->get('type');

    if ($type === 'filter') {
      // Remove clearfix classes from several elements. They add unwanted
      // whitespace and are no longer needed because uses of `float:` in this
      // form have been removed.
      // @todo Many of the changes to classes within this conditional may not be
      //   needed or require refactoring in https://drupal.org/node/3164890
      unset($form['options']['clear_markup_start'], $form['options']['clear_markup_end']);
      if (isset($form['options']['expose_button']['#prefix'])) {
        $form['options']['expose_button']['#prefix'] = str_replace('clearfix', '', $form['options']['expose_button']['#prefix']);
      }
      if (isset($form['options']['group_button']['#prefix'])) {
        $form['options']['group_button']['#prefix'] = str_replace('clearfix', '', $form['options']['group_button']['#prefix']);
      }

      // Remove `views-(direction)-(amount)` classes, replace with
      // `views-group-box--operator`, and add a `views-config-group-region`
      // wrapper.
      if (isset($form['options']['operator']['#prefix'])) {
        foreach (['views-left-30', 'views-left-40'] as $left_class) {
          if (str_contains($form['options']['operator']['#prefix'], $left_class)) {
            $form['options']['operator']['#prefix'] = '<div class="views-config-group-region">' . str_replace($left_class, 'views-group-box--operator', $form['options']['operator']['#prefix']);
            $form['options']['value']['#suffix'] = ($form['options']['value']['#suffix'] ?? '') . '</div>';
          }
        }
      }

      // Some instances of this form input have an added wrapper that needs to
      // be removed in order to style these forms consistently.
      // @see \Drupal\views\Plugin\views\filter\InOperator::valueForm
      $wrapper_div_to_remove = '<div id="edit-options-value-wrapper">';
      if (isset($form['options']['value']['#prefix']) && str_contains($form['options']['value']['#prefix'], $wrapper_div_to_remove)) {
        $form['options']['value']['#prefix'] = str_replace($wrapper_div_to_remove, '', $form['options']['value']['#prefix']);
        $form['options']['value']['#suffix'] = preg_replace('/<\/div>/', '', $form['options']['value']['#suffix'], 1);
      }

      if (isset($form['options']['value']['#prefix'])) {
        foreach (['views-right-70', 'views-right-60'] as $right_class) {
          if (str_contains($form['options']['value']['#prefix'], $right_class)) {
            $form['options']['value']['#prefix'] = str_replace($right_class, 'views-group-box--value', $form['options']['value']['#prefix']);
          }
        }
      }

      // If the form includes a `value` field, the `.views-group-box--value` and
      // `.views-group-box` classes must be present in a wrapper div. Add them
      // here if it they are not yet present.
      if (!isset($form['options']['value']['#prefix']) || !str_contains($form['options']['value']['#prefix'], 'views-group-box--value')) {
        $prefix = $form['options']['value']['#prefix'] ?? '';
        $suffix = $form['options']['value']['#suffix'] ?? '';
        $form['options']['value']['#prefix'] = '<div class="views-group-box views-group-box--value">' . $prefix;
        $form['options']['value']['#suffix'] = $suffix . '</div>';
      }

      // If operator or value have no children, remove them from the render
      // array so their prefixes and suffixes aren't added without any content.
      foreach (['operator', 'value'] as $form_item) {
        if (isset($form['options'][$form_item]['#prefix']) && count($form['options'][$form_item]) === 2 && $form['options'][$form_item]['#suffix']) {
          unset($form['options'][$form_item]);
        }
      }
    }
  }

}
