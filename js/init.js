/* To inject this as early as possible and to bypass Drupal's
 * behaviors we use native JS.
*/

function ginCheckDarkmode() {
  if (
    localStorage.getItem('GinDarkMode') == 1 ||
    (localStorage.getItem('GinDarkMode') === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.body.classList.add('gin--dark-mode');
  } else {
    document.body.classList.contains('gin--dark-mode') === true && document.body.classList.remove('gin--dark-mode');
  }
}

// GinDarkMode is not set yet.
window.addEventListener('DOMContentLoaded', (e) => {
  if (!localStorage.getItem('GinDarkMode')) {
    localStorage.setItem('GinDarkMode', drupalSettings.gin.darkmode);
  }

  ginCheckDarkmode();
});

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
