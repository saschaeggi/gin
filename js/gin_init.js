/* To inject this as early as possible and to bypass Drupal's
 * behaviors we use native JS.
*/

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

const accentColor = localStorage.getItem('GinAccentColorCustom');
const className = 'gin-custom-colors';

// Accent color check.
if (accentColor) {
  let style = document.createElement('style');
  const ratio = 6.5;
  const strippedAccentColor = accentColor.replace('#', '');

  style.className = className;
  style.innerHTML = `
    body:not(.gin-inactive) {\n\
      --colorGinPrimary: ${accentColor};\n\
      --colorGinPrimaryHover: ${shadeColor(accentColor, -10)};\n\
      --colorGinPrimaryActive: ${shadeColor(accentColor, -15)};\n\
      --colorGinPrimaryLight: ${accentColor}${Math.round(ratio * 3.5)};\n\
      --colorGinPrimaryLightHover: ${accentColor}${Math.round(ratio * 4.5)};\n\
      --colorGinPrimaryLightActive: ${accentColor}${Math.round(ratio * 5.5)};\n\
      --colorGinItemHover: ${accentColor}${Math.round(ratio * 1.5)};\n\
    }\n\
    .form-element--type-select:hover,\n\
    .form-element--type-select:active,\n\
    .form-element--type-select:focus {\n\
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 9'%3E%3Cpath fill='none' stroke-width='1.5' d='M1 1L7 7L13 1' stroke='%23${strippedAccentColor}'/%3E%3C/svg%3E%0A");\n\
    }
  `;

  const scriptTag = document.querySelector('script');
  scriptTag.parentNode.insertBefore(style, scriptTag);
} else if (document.getElementsByClassName(className).length > 0) {
  document.getElementsByClassName(className)[0].remove();
}

function shadeColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const B = ((num >> 8) & 0x00ff) + amt;
  const G = (num & 0x0000ff) + amt;

  return `#${(
    0x1000000
    + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000
    + (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100
    + (G < 255 ? (G < 1 ? 0 : G) : 255)
  )
    .toString(16)
    .slice(1)}`;
}
