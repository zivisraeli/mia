// =============================================================================
// cookie related functions
// with
// =============================================================================
getCookie = (name) => {
  // since document.cookie returns all cookie, match would filter out the one I need.
  // the match regex: cookie name should follow an equal sign AND NOT a space of a semi-colon.
  // with 'capturing groups' we get an array with the array[0] is the entire expression value.
  // the rest of the values are the group's value.
  let value = document.cookie.match('(?:^|;)\\s?' + name + '=([^\\s;]*)');
  return value ? value[1] : null;
}

setCookie = (name, value, days = 365) => {
  let d = new Date;
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

// =============================================================================
// Determine the current slected menu and style it differently. 
// =============================================================================
currentMenuEntry = () => {
  let anchor = '';
  let pageName = window.location.pathname;
  if (pageName.includes("index.html")) {
    anchor = document.querySelector('nav span#index');
  } else if (pageName.includes("selfies.html")) {
    anchor = document.querySelector('nav span#selfies');
  } else if (pageName.includes("fans.html")) {
    anchor = document.querySelector('nav span#fans');
  }
  anchor.style.textShadow = '1px 1px 4px gray';
}

// =============================================================================
// Based on a cookie value find the header img id and set the image accordingly.
// =============================================================================
setHeaderImage = () => {
    let headerImgId = getCookie("headerImgId");
    headerImgId = headerImgId === null ? 'id0' : headerImgId;
    let headerImgSrc = `images/mia-${headerImgId}.jpg`;
    let headerImgElem = document.querySelector("header img");
    headerImgElem.setAttribute("src", headerImgSrc);    
}

// =============================================================================

currentMenuEntry();
setHeaderImage();