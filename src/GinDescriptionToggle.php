<?php

namespace Drupal\gin;

use Drupal\Core\DependencyInjection\ClassResolverInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Service to handle toggling form descriptions.
 */
final class GinDescriptionToggle implements ContainerInjectionInterface {

  use ClassResolverTrait;

  /**
   * GinDescriptionToggle constructor.
   *
   * @param \Drupal\Core\DependencyInjection\ClassResolverInterface $classResolver
   *   The class resolver.
   */
  public function __construct(
    protected ClassResolverInterface $classResolver,
  ) {
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): GinDescriptionToggle {
    return new GinDescriptionToggle(
      $container->get('class_resolver'),
    );
  }

  /**
   * Generic preprocess enabling toggle.
   *
   * @param array $variables
   *   The variables array (modify in place).
   */
  public function preprocess(array &$variables): void {
    if ((isset($variables['element']['#description_toggle']) && $variables['element']['#description_toggle']) || $this->isEnabled()) {
      if (!empty($variables['description'])) {
        $variables['description_display'] = 'invisible';
        $variables['description_toggle'] = TRUE;
      }
      // Add toggle for text_format, description is in wrapper.
      elseif (!empty($variables['element']['#description_toggle'])) {
        $variables['description_toggle'] = TRUE;
      }
    }
  }

  /**
   * Functionality is enabled via setting on content forms.
   *
   * @return bool
   *   Wether feature is enabled or not.
   */
  public function isEnabled(): bool {
    return $this->getSettings()->get('show_description_toggle') && $this->getContentFormHelper()->isContentForm();
  }

}
