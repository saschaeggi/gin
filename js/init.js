/* To inject this as early as possible
 * we use native JS instead of Drupal's behaviors.
*/

// Darkmode Check.
function ginInitDarkmode() {
  const darkModeClass = 'gin--dark-mode';
  if (
    localStorage.getItem('GinDarkMode') == 1 ||
    (localStorage.getItem('GinDarkMode') === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add(darkModeClass);
  } else {
    document.documentElement.classList.contains(darkModeClass) === true && document.documentElement.classList.remove(darkModeClass);
  }
}

ginInitDarkmode();

// GinDarkMode is not set yet.
window.addEventListener('DOMContentLoaded', (e) => {
  if (!localStorage.getItem('GinDarkMode')) {
    localStorage.setItem('GinDarkMode', drupalSettings.gin.darkmode);
    ginInitDarkmode();
  }
});

// Sidebar Check.
if (localStorage.getItem('GinSidebarOpen')) {
  const style = document.createElement('style');
  const className = 'gin-toolbar-inline-styles';
  style.className = className;

  // Sidebar Check.
  if (localStorage.getItem('GinSidebarOpen') === 'true') {
    style.innerHTML = `
    @media (min-width: 976px) {
      body.gin--vertical-toolbar {
        padding-left: 240px;
        transition: none;
      }

      .gin--vertical-toolbar .toolbar-menu-administration {
        width: 240px;
        transition: none;
      }
    }
    `;

    const scriptTag = document.querySelector('script');
    scriptTag.parentNode.insertBefore(style, scriptTag);
  } else if (document.getElementsByClassName(className).length > 0) {
    document.getElementsByClassName(className)[0].remove();
  }
}
