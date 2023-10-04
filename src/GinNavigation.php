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
   * Get Navigation Create menu.
   */
  public function getNavigationCreateMenuItems(): array {
    // Get the Entity Type Manager service.
    $entity_type_manager = \Drupal::entityTypeManager();

    // Get node types.
    $content_types = $entity_type_manager->getStorage('node_type')->loadMultiple();
    $content_type_items = [];
    foreach ($content_types as $item) {
      $content_type_items[] = [
        'title' => $item->label(),
        'url' => Url::fromRoute('node.add', ['node_type' => $item->id()]),
      ];
    }

    // Get block types.
    $block_content_types = BlockContentType::loadMultiple();
    $block_type_items = [];
    foreach ($block_content_types as $item) {
      $block_type_items[] = [
        'title' => $item->label(),
        'url' => Url::fromRoute('block_content.add_form', ['block_content_type' => $item->id()]),
      ];
    }

    // Get media types.
    $media_types = $entity_type_manager->getStorage('media_type')->loadMultiple();
    $media_type_items = [];
    foreach ($media_types as $item) {
      $media_type_items[] = [
        'title' => $item->label(),
        'url' => Url::fromRoute('entity.media.add_form', ['media_type' => $item->id()]),
      ];
    }

    // Get taxomony types.
    $taxonomy_types = Vocabulary::loadMultiple();
    $taxonomy_type_items = [];
    foreach ($taxonomy_types as $item) {
      $taxonomy_type_items[] = [
        'title' => $item->label(),
        'url' => Url::fromRoute('entity.taxonomy_term.add_form', ['taxonomy_vocabulary' => $item->id()]),
      ];
    }

    // Needs to be this syntax to
    // support older PHP versions
    // for Druapl 9.0+.
    $create_type_items = array_merge(
      $content_type_items,
      [
        [
          'title' => t('Blocks'),
          'url' => '',
          'below' => $block_type_items,
        ],
        [
          'title' => t('Media'),
          'url' => '',
          'below' => $media_type_items,
        ],
        [
          'title' => t('Taxonomy'),
          'url' => '',
          'below' => $taxonomy_type_items,
        ],
      ]
    );

    $create_items = [
      [
        'title' => t('Create'),
        'url' => Url::fromRoute('node.add_page')->toString(),
        'below' => $create_type_items,
      ],
    ];
    return [
      '#theme' => 'menu_region__middle',
      '#items' => $create_items,
      '#menu_name' => 'create',
      '#title' => t('Create Navigation'),
    ];
  }

  /**
   * Get Navigation Content menu.
   */
  public function getNavigationContentMenuItems(): array {
    $content_items = [
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

  /**
   * Get Navigation.
   */
  public function getNavigationStructure() {
    // Get navigation items.
    $menu['top']['create'] = $this->getNavigationCreateMenuItems();
    $menu['middle']['content'] = $this->getNavigationContentMenuItems();
    $menu['middle']['admin'] = $this->getNavigationAdminMenuItems();
    $menu['bottom']['user'] = $this->getMenuNavigationUserItems();

    return [
      '#theme' => 'navigation',
      '#menu_top' => $menu['top'],
      '#menu_middle' => $menu['middle'],
      '#menu_bottom' => $menu['bottom'],
      '#attached' => [
        'library' => [
          'gin/navigation',
        ],
      ],
      '#access' => \Drupal::currentUser()->hasPermission('access toolbar'),
    ];
  }

  /**
   * Get Active trail.
   */
  public function getNavigationActiveTrail() {
    // Get the breadcrumb paths to maintain active trail in the toolbar.
    $links = \Drupal::service('breadcrumb')->build(\Drupal::routeMatch())->getLinks();
    $paths = [];
    foreach ($links as $link) {
      $paths[] = $link->getUrl()->getInternalPath();
    }

    return $paths;
  }

}
