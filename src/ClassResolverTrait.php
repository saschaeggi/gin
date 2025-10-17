<?php

namespace Drupal\gin;

use Drupal\Core\DependencyInjection\ClassResolverInterface;

/**
 * Provides class resolver methods for Gin services.
 */
trait ClassResolverTrait {

  /**
   * The class resolver.
   *
   * @var \Drupal\Core\DependencyInjection\ClassResolverInterface
   */
  protected ClassResolverInterface $classResolver;

  /**
   * The Gin settings.
   *
   * @var mixed|null
   */
  protected mixed $settings = NULL;

  /**
   * The Gin content form helper.
   *
   * @var mixed|null
   */
  protected mixed $contentFormHelper = NULL;

  /**
   * The Gin description toggle.
   *
   * @var mixed|null
   */
  protected mixed $descriptionToggle = NULL;

  /**
   * Gets the Gin settings.
   *
   * @return \Drupal\gin\Settings
   *   The Gin settings.
   */
  protected function getSettings(): Settings {
    if ($this->settings === NULL) {
      $this->settings = $this->classResolver->getInstanceFromDefinition(Settings::class);
    }
    return $this->settings;
  }

  /**
   * Gets the Gin content form helper.
   *
   * @return \Drupal\gin\ContentFormHelper
   *   The Gin content form helper.
   */
  protected function getContentFormHelper(): ContentFormHelper {
    if ($this->contentFormHelper === NULL) {
      $this->contentFormHelper = $this->classResolver->getInstanceFromDefinition(ContentFormHelper::class);
    }
    return $this->contentFormHelper;
  }

  /**
   * Gets the Gin description toggle.
   *
   * @return \Drupal\gin\DescriptionToggle
   *   The Gin description toggle.
   */
  protected function getDescriptionToggle(): DescriptionToggle {
    if ($this->descriptionToggle === NULL) {
      $this->descriptionToggle = $this->classResolver->getInstanceFromDefinition(DescriptionToggle::class);
    }
    return $this->descriptionToggle;
  }

}
