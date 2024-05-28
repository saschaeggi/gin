<?php

/**
 * @file
 * Hooks for gin theme.
 */

/**
 * @addtogroup hooks
 * @{
 */

/**
 * Register routes to apply Gin’s content edit form layout.
 *
 * Leverage this hook to achieve a consistent user interface layout on
 * administrative edit forms, similar to the node edit forms. Any module
 * providing a custom entity type or form mode may wish to implement this
 * hook for their form routes. Please note that not every content entity
 * form route should enable the Gin edit form layout, for example the
 * delete entity form does not need it.
 *
 * @return array
 *   An array of route names.
 *
 * @see GinContentFormHelper->isContentForm()
 * @see hook_gin_content_form_routes_alter()
 */
function hook_gin_content_form_routes() {
  return [
    // Layout a custom node form.
    'entity.node.my_custom_form',

    // Layout a custom entity type edit form.
    'entity.my_type.edit_form',
  ];
}

/**
 * Alter the registered routes to enable or disable Gin’s edit form layout.
 *
 * @param array $routes
 *   The list of routes.
 *
 * @see GinContentFormHelper->isContentForm()
 * @see hook_gin_content_form_routes()
 */
function hook_gin_content_form_routes_alter(array &$routes) {
  // Example: disable Gin edit form layout customizations for an entity type.
  $routes = array_diff($routes, ['entity.my_type.edit_form']);
}

/**
 * Register form ids to apply Gin’s sticky action buttons.
 *
 * Leverage this hook to achieve a consistent user interface layout on
 * administrative edit forms, similar to the node edit forms. Any module
 * providing a custom entity type or form mode may wish to implement this
 * hook for their form routes. Please note that not every content entity
 * form route should enable the Gin edit form layout, for example the
 * delete entity form does not need it.
 *
 * Note that if you already hooked into hook_gin_content_form_routes()
 * this is not necessary and will automatically be done.
 *
 * @return array
 *   An array of form ids.
 *
 * @see GinContentFormHelper->stickyActionButtons()
 * @see hook_gin_sticky_form_actions_alter()
 */
function hook_gin_sticky_form_actions() {
  return [
    // My custom form.
    'my_custom_form',
  ];
}

/**
 * Alter the registered form ids to enable or disable Gin’s sticky form actions.
 *
 * @param array $form_ids
 *   The list of form ids.
 *
 * @see GinContentFormHelper->stickyActionButtons()
 * @see hook_gin_sticky_form_actions()
 */
function hook_gin_sticky_form_actions_alter(array &$form_ids) {
  // Example: disable Sticky form actions customizations for a specific form.
  $routes = array_diff($form_ids, ['my_custom_edit_form']);
}

/**
 * @} End of "addtogroup hooks".
 */
