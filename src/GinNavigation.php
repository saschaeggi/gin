<?php

namespace Drupal\gin;

use Drupal\block_content\Entity\BlockContentType;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Menu\MenuTreeParameters;
use Drupal\Core\Url;
use Drupal\taxonomy\Entity\Vocabulary;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Service to handle overridden user settings.
 */
class GinNavigation implements ContainerInjectionInterface {

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static();
  }

  /**
   * Get Navigation Admin Menu Items.
   */
  public function getNavigationAdminMenuItems(): array {
    $parameters = new MenuTreeParameters();
    $parameters->setMinDepth(2)->setMaxDepth(4)->onlyEnabledLinks();
    $menu_tree = \Drupal::service('menu.link_tree');
    $tree = $menu_tree->load('admin', $parameters);
    $manipulators = [
      ['callable' => 'menu.default_tree_manipulators:checkAccess'],
      ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
      ['callable' => 'toolbar_menu_navigation_links'],
    ];
    $tree = $menu_tree->transform($tree, $manipulators);
    $build = $menu_tree->build($tree);
    /** @var \Drupal\Core\Menu\MenuLinkInterface $link */
    $first_link = reset($tree)->link;
    // Get the menu name of the first link.
    $menu_name = $first_link->getMenuName();
    $build['#menu_name'] = $menu_name;
    $build['#theme'] = 'menu_region__middle';

    // Remove content and help from admin menu.
    unset($build['#items']['system.admin_content']);
    unset($build['#items']['help.main']);
    $build['#title'] = t('Administration');
    return $build;
  }

  /**
   * Get Navigation Bookmarks.
   */
  public function getNavigationBookmarksMenuItems(): array {
    // Check if the shortcut module is installed.
    if (\Drupal::hasService('shortcut.lazy_builders') === TRUE) {
      $shortcuts = \Drupal::service('shortcut.lazy_builders')->lazyLinks()['shortcuts'];
      $shortcuts['#theme'] = 'menu_region__top';
      $shortcuts['#menu_name'] = 'bookmarks';
      $shortcuts['#title'] = t('Bookmarks');
      return $shortcuts;
    }
    else {
      return [];
    }
  }

  /**
   * Get Navigation Content menu.
   */
  public function getNavigationContentMenuItems(): array {
    // Get the Entity Type Manager service.
    $entity_type_manager = \Drupal::entityTypeManager();

    // Get node types.
    $content_types = $entity_type_manager->getStorage('node_type')->loadMultiple();
    $content_items = [];
    foreach ($content_types as $item) {
      $content_items[] = [
        'title' => $item->label(),
        'url' => Url::fromRoute('node.add', ['node_type' => $item->id()]),
      ];
    }

    // Get block types.
    $block_content_types = BlockContentType::loadMultiple();
    $block_items = [];
    foreach ($block_content_types as $item) {
      $block_items[] = [
        'title' => $item->label(),
        'url' => Url::fromRoute('block_content.add_form', ['block_content_type' => $item->id()]),
      ];
    }

    // Get media types.
    $media_types = $entity_type_manager->getStorage('media_type')->loadMultiple();
    $media_items = [];
    foreach ($media_types as $item) {
      $media_items[] = [
        'title' => $item->label(),
        'url' => Url::fromRoute('entity.media.add_form', ['media_type' => $item->id()]),
      ];
    }

    // Get taxomony types.
    $taxonomy_types = Vocabulary::loadMultiple();
    $taxonomy_items = [];
    foreach ($taxonomy_types as $item) {
      $taxonomy_items[] = [
        'title' => $item->label(),
        'url' => Url::fromRoute('entity.taxonomy_term.add_form', ['taxonomy_vocabulary' => $item->id()]),
      ];
    }

    $create_items = [
      ...$content_items,
      [
        'title' => t('Blocks'),
        'url' => '',
        'below' => $block_items,
      ],
      [
        'title' => t('Media'),
        'url' => '',
        'below' => $media_items,
      ],
      [
        'title' => t('Taxonomy'),
        'url' => '',
        'below' => $taxonomy_items,
      ],
    ];

    $content_items = [
      [
        'title' => t('Create'),
        'url' => Url::fromRoute('node.add_page')->toString(),
        'below' => $create_items,
      ],
      [
        'title' => t('Content'),
        'url' => Url::fromRoute('system.admin_content')->toString(),
      ],
      [
        'title' => t('Blocks'),
        'url' => Url::fromRoute('entity.block_content.collection')->toString(),
      ],
      [
        'title' => t('Files'),
        'url' => '/admin/content/files',
      ],
      [
        'title' => t('Media'),
        'url' => '/admin/content/media',
      ],
    ];
    return [
      '#theme' => 'menu_region__middle',
      '#items' => $content_items,
      '#menu_name' => 'content',
      '#title' => t('Content Navigation'),
    ];
  }

  /**
   * Get Navigation User menu.
   */
  public function getMenuNavigationUserItems(): array {
    $user_items = [
      [
        'title' => t('Profile'),
        'url' => Url::fromRoute('user.page')->toString(),
      ],
      [
        'title' => t('Settings'),
        'url' => Url::fromRoute('entity.user.admin_form')->toString(),
      ],
      [
        'title' => t('Log out'),
        'url' => Url::fromRoute('user.logout')->toString(),
      ],
    ];
    return [
      '#theme' => 'menu_region__bottom',
      '#items' => $user_items,
      '#menu_name' => 'user',
      '#title' => t('User'),
    ];
  }

}
