<?php

namespace Drupal\gin;

use Drupal\Core\DependencyInjection\ClassResolverInterface;

/**
 * Provides class resolver methods for admin services.
 */
trait ClassResolverTrait {

  /**
   * The class resolver.
   *
   * @var \Drupal\Core\DependencyInjection\ClassResolverInterface
   */
  protected ClassResolverInterface $classResolver;

  /**
   * The admin settings.
   *
   * @var mixed|null
   */
  protected mixed $settings = NULL;

  /**
   * The admin content form helper.
   *
   * @var mixed|null
   */
  protected mixed $contentFormHelper = NULL;

  /**
   * The admin description toggle.
   *
   * @var mixed|null
   */
  protected mixed $descriptionToggle = NULL;

  /**
   * Gets the admin settings.
   *
   * @return \Drupal\gin\Settings
   *   The admin settings.
   */
  protected function getSettings(): Settings {
    if ($this->settings === NULL) {
      $this->settings = $this->classResolver->getInstanceFromDefinition(Settings::class);
    }
    return $this->settings;
  }

  /**
   * Gets the admin content form helper.
   *
   * @return \Drupal\gin\ContentFormHelper
   *   The admin content form helper.
   */
  protected function getContentFormHelper(): ContentFormHelper {
    if ($this->contentFormHelper === NULL) {
      $this->contentFormHelper = $this->classResolver->getInstanceFromDefinition(ContentFormHelper::class);
    }
    return $this->contentFormHelper;
  }

  /**
   * Gets the admin description toggle.
   *
   * @return \Drupal\gin\DescriptionToggle
   *   The admin description toggle.
   */
  protected function getDescriptionToggle(): DescriptionToggle {
    if ($this->descriptionToggle === NULL) {
      $this->descriptionToggle = $this->classResolver->getInstanceFromDefinition(DescriptionToggle::class);
    }
    return $this->descriptionToggle;
  }

}
