let state = {};

// =============================================================================
// Get all state elements
// =============================================================================
assignStateElements = () => {

  // grid general   
  state.gridItems = gridItems;
  state.dynamicGrid = document.querySelector(".dynamic-grid");
  state.gridSection = document.querySelector("#grid-section");

  // modal related elements
  state.modalCotainerDiv = document.getElementById("modal-container-div");
  state.modalContentDiv = document.getElementById("modal-content-div");
  state.modalImg = state.modalCotainerDiv.querySelector("img");
  state.modalImgText = state.modalCotainerDiv.querySelector("#modal-img-text");
  state.modalImgLikeCount = state.modalCotainerDiv.querySelector("#modal-img-like-count");
  state.modalImgCloseBtn = document.getElementsByClassName("modal-img-close-btn")[0];
  state.nextBtn = document.getElementById("next-btn");
  state.previousBtn = document.getElementById("prev-btn");

  // used by the next/previous img btn. 
  state.modalImgIndex = 0;

  // is assigned the onchange event.
  state.selectSort = document.getElementById('select-sort');

  // the target of drag operation.
  state.headerImg = document.querySelector('#header-img');
  state.draggedIntoDiv = document.querySelector('header #dragged-into-div');
  state.draggedImgSrc = '';
  
  // misc.
  state.spinnerDiv = document.getElementById("spinner-div");
  state.selectOptionDiv = document.getElementById("select-option-div");
  state.counter = 0;
};

// =============================================================================
// Add all events.
// =============================================================================
addEvents = () => {

  // Modal's navEvent (next/previous buttons).
  state.nextBtn.onclick = (event) => {
    let theNextIndex = (state.modalImgIndex + 1) === state.gridItems.length ? 0 : state.modalImgIndex + 1;
    navigationBtnClicked(theNextIndex);
  }

  state.previousBtn.onclick = (event) => {
    let thePreviousIndex = state.modalImgIndex === 0 ? state.gridItems.length - 1 : state.modalImgIndex - 1;
    navigationBtnClicked(thePreviousIndex);
  }

  // Modal's closeEvent.
  state.modalImgCloseBtn.onclick = () => {
    state.modalCotainerDiv.style.display = "none";
    state.gridSection.classList.remove("blurred");
    state.gridSection.classList.add("un-blurred");
  }

  // Onclick events that are related to each grid's image:
  //   - likeEvent: like/unlike an image.
  //   - modalEvent: render popup modal image and blur the background. 
  //   - if the modal is ON, then unblur the grid background upon closing a modal. 
  window.onclick = (event) => {
    let clickedElemClass = event.target.className;
    if (clickedElemClass.startsWith("heart")) {
      toggleHeart(event);
    } else if (clickedElemClass.startsWith("grid-image")) {
      let gridImgSrc = event.target.src;
      renderModalImg(gridImgSrc);
      state.gridSection.classList.remove("un-blurred");
      state.gridSection.classList.add("blurred");
    } else {
      if (state.modalCotainerDiv.style.display === "block") {
        state.modalCotainerDiv.style.display = "none";
        state.gridSection.classList.remove("blurred");
        state.gridSection.classList.add("un-blurred");
      }
    }
  }

  // selectEvents. Upon selecting an option:
  // - sort the array.
  // - set the cookie.
  // - re-render the grid. 
  state.selectSort.onchange = (event) => {
    let selectedIndex = event.target.selectedIndex;
    let selectedOptionId = event.target[selectedIndex].id;
    switch (selectedOptionId) {
      case 'likes+1':
        sortGridItems('likes', 1);
        break;
      case 'likes-1':
        sortGridItems('likes', -1);
        break;
      case 'captions+1':
        sortGridItems('captions', 1);
        break;
      case 'captions-1':
        sortGridItems('captions', -1);
        break;
      default:
        break;
    }
    setCookie('sort', selectedOptionId);
    renderGrid();
  }

  // dragEvents
  state.dynamicGrid.addEventListener("dragstart", (event) => {
    let clickedElemClass = event.target.className;
    if (clickedElemClass === "grid-image") {
      state.draggedImgSrc = event.target.src;
    }
  });

  // By default, data/elements cannot be dropped in other elements. 
  // To allow a drop we must invoke preventDefault.
  state.draggedIntoDiv.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  // When the "dragged" image is "dropped" at its target (headerImg) we need to: 
  // - change the header-img "src" attribute.
  // - set the headerImgId cookie.
  // - remove the cue styling.
  state.draggedIntoDiv.addEventListener("drop", (event) => {
    state.headerImg.setAttribute("src", state.draggedImgSrc);
    let imgId = state.draggedImgSrc.match('mia-(.*).jpg')[1];
    setCookie("headerImgId", imgId);
    state.headerImg.classList.remove("img-hovered");
  });

  // When a grid image is dragged into header-image, re-style the header-image for a cue.
  state.draggedIntoDiv.addEventListener("dragenter", (event) => {
    event.preventDefault();
    state.headerImg.classList.add("img-hovered");
  });

  // If image is dragged outside the div BUT into the image (the image is inside the div)
  // then it's still considered inside the div and therefor don't remove the cue styling.
  state.draggedIntoDiv.addEventListener("dragleave", (event) => {
    let relatedTargetId = event.relatedTarget.id;
    if (relatedTargetId != 'header-img' && relatedTargetId != 'dragged-into-div') {
      state.headerImg.classList.remove("img-hovered");
    }
  });
}

// =============================================================================
// invoked by navigation buttons to retrieve and render another image on the modal popup. 
// =============================================================================
navigationBtnClicked = (theElemIndex) => {
  let theElem = state.gridItems[theElemIndex];
  let theSrc = theElem.src;
  renderModalImg(theSrc);

  // So it won't bubble into window.onclick().
  event.stopPropagation();
}

// =============================================================================
// readLikesCookie would read 'likes' cookie and update the state.gridItems array accordingly. 
// =============================================================================
readLikesCookie = () => {
  // read 'likes' cookie
  likeArray = [];
  let likeCookie = getCookie('likes');
  if (likeCookie != null) {
    likeArray = JSON.parse(likeCookie);
  }
  likeArray.forEach((id) => {
    let gridElem = state.gridItems.find((elem) => {
      return elem.id === id;
    });
    if (gridElem != null) {
      gridElem.isLiked = true;
      gridElem.likeCount++;
    }
  });
}

// =============================================================================
// readSortCookie would:
// - read 'sort' cookie 
// - set the selected option.
// - make the select-option-div visible (to avoid jitter).
// - sort the grid items array.
// =============================================================================
readSortCookie = () => {
  // set default values in case there is no cookie yet.
  let sortAttr = 'likes';
  let sortDirection = -1;
  let sortCookie = getCookie('sort');
  if (sortCookie === null) {
    sortCookie = "likes-1";
  } else {
    let sortArr = sortCookie.match('(.*)([-+]1)');
    sortAttr = sortArr[1];
    sortDirection = sortArr[2];
  }

  // Find the select option element pointed to by the cookie and add 'selected' attribute.
  // The options carry the same id as the cookie.
  let selectedOption = document.getElementById(sortCookie);
  selectedOption.setAttribute("selected", "selected");
  state.selectOptionDiv.style.visibility = "visible";

  sortGridItems(sortAttr, sortDirection);
}

// =============================================================================
// This function takes 2 parameters, compare them and return true or false.
// Javascript sort function take a "compare" function as a parameter. 
// =============================================================================
sortGridItems = (sortByAttr, direction) => {
  let sortedGridItems = state.gridItems.sort((item1, item2) => {
    let retVal = 0;
    if (sortByAttr === "captions") {
      retVal = item1.caption.toUpperCase() > item2.caption.toUpperCase() ? 1 : -1;
    } else {
      retVal = item1.likeCount > item2.likeCount ? 1 : -1
    }
    return retVal * direction;
  });

  state.gridItems = sortedGridItems;
}

// =============================================================================
// renderModalImg would render the clicked img inside the modal div.
// =============================================================================
renderModalImg = (imgSrc) => {
  let arrSrc = imgSrc.match('(.*mia-).*-(.*)(\.jpg$)');
  let modalImgSrc = arrSrc[1] + arrSrc[2] + arrSrc[3];
  state.modalImg.setAttribute("src", modalImgSrc);

  // I save the index of the selected img for the next/previous operations
  // so I can simply go to the next/previous element inthe gridItems array. 
  let selectedImgId = arrSrc[2];
  state.modalImgIndex = state.gridItems.findIndex((element) => {
    return element.id === selectedImgId;
  });

  let theCaption = state.gridItems[state.modalImgIndex].caption;
  let theLikeCount = state.gridItems[state.modalImgIndex].likeCount;
  state.modalImgText.innerHTML = theCaption;
  state.modalImgLikeCount.innerHTML = `${theLikeCount}&nbsp<img src="images/heart-likes.png" class="heart-likes-icon"/>'s`;

  // Upon loading the img I need to get its "natural" size.
  // Since I place the modal-content-div 110px from the top it's not included in the vp Height. 
  // Yet, the max width of an image would be 75% of the vp. 
  state.modalImg.onload = function() {
    let imgW = state.modalImg.naturalWidth;
    let imgH = state.modalImg.naturalHeight;
    let vpW = document.documentElement.clientWidth;
    let vpH = document.documentElement.clientHeight - 110;
    let imgPropotion = imgW / imgH;
    let vpPropotion = vpW / vpH;
    let newW = imgPropotion * vpH;
    let maxImgW = vpW * 0.75;
    newW = newW > maxImgW ? maxImgW : newW;
    state.modalContentDiv.style.width = newW + "px";

    // Finally, display it. 
    state.modalCotainerDiv.style.display = "block";
  }
}

// =============================================================================
// Grid rendition.
// Events for the grid elements must be re-created everytime the grid is rendered after sorting.
// - Get the grid item that opens the modal
// - When the user clicks on an grid item, either:
//    - he clicked on the heart icon - toggle it.
//    - otherwise open the modal popup. 
// =============================================================================
renderGrid = () => {
  // get the grid element and blank it out. 
  state.dynamicGrid.innerHTML = '';

  // loop through the state.gridItems array and construct the grid.
  state.gridItems.forEach((elem, i) => {
    let id = elem.id;
    let src = elem.src;
    let caption = elem.caption;
    let likeCount = elem.likeCount;
    let date = elem.date;
    let isLiked = elem.isLiked;

    let heartImg = isLiked ? "images/heartFull.jpg" : "images/heart-outline.png";

    state.dynamicGrid.innerHTML +=
      `<figure class="grid-item">
         <img class="grid-image" src="${src}">
         <figcaption class="figcaption">${caption} &nbsp;|&nbsp;
                     <span id="like-count-span">${likeCount}</span>
                     <img src="images/heart-likes.png" class="heart-likes-icon"/>\'s&nbsp;|&nbsp;
                     ${date}&nbsp;
         </figcaption>
         <img class="heart" id="${id}" src=${heartImg} />
       </figure>`;
  });
}

// =============================================================================
// Since it takes some time to load the images there is some "jitter".
// To avoid it:
//   - initially, during image loading, the grid section is hidden. 
//   - during this tim, the spinner-div is visibly spinning. 
//   - each image, upon loading, increments state.counter.
//   - once the counter === the array size the grid section becomes visible and the spinner-div is removed. 
//   - display = "none" would remove the element from the DOM altogther rather then hiding it. 
// =============================================================================
gridImgsOnloadAssignment = () => {
  let allImgs = state.dynamicGrid.querySelectorAll(".grid-image");
  allImgs.forEach((elem) => {
    elem.addEventListener("load", (event) => {
      state.counter++;
      if (state.counter === state.gridItems.length) {
        state.dynamicGrid.style.visibility = "visible";
        state.spinnerDiv.style.display = "none";
      }
    });
  });
}

// =============================================================================
// Like Toggling 
// =============================================================================
toggleHeart = (event) => {
  // Get the target element based on the target id
  let theTarget = document.getElementById(event.target.id);

  // Based on the target id, find the element in the state.gridItems and:
  //   - toggle the isLiked value.
  //   - increment/decrement the likeCount.
  //   - render the right icon with/without the animation.
  let gridItem = state.gridItems.find((obj) => {
    return obj.id === event.target.id;
  });

  if (gridItem.isLiked) {
    gridItem.isLiked = false;
    gridItem.likeCount--;
    theTarget.setAttribute("src", "images/heart-outline.png");
    theTarget.setAttribute("class", "heart");
  } else {
    gridItem.isLiked = true;
    gridItem.likeCount++;
    theTarget.setAttribute("src", "images/heart-full.png");
    theTarget.setAttribute("class", "heart animatedHeartBeat");
  }

  // re-render the like count.
  // we grab the parent (figure tag) from which we query for the like-count-span.
  let parentElem = theTarget.parentElement;
  let countElem = parentElem.querySelector("#like-count-span");
  countElem.innerHTML = gridItem.likeCount;

  updateLikesCookie(gridItem);
}

// =============================================================================
// 1. get 'likes' cookie (a string-ed array)
// 2. if not empty, JSON-parse it to convert the string to an array. 
// 3. push or remove (filter) an element based on gridItem.isLiked value.
// 4. JSON-stringify it to convert the array to a string. 
// 5. set the cookie with the new string.
// =============================================================================
updateLikesCookie = (gridItem) => {
  let likeArray = [];
  let likeCookie = getCookie('likes');
  if (likeCookie != null) {
    likeArray = JSON.parse(likeCookie);
  }
  if (gridItem.isLiked) {
    likeArray.push(gridItem.id);
  } else {
    let filteredArray = likeArray.filter((id) => {
      return id != gridItem.id;
    });
    likeArray = filteredArray;
  }

  likeCookie = JSON.stringify(likeArray);
  setCookie('likes', likeCookie);
}

// =============================================================================
// Initial function invocations
// =============================================================================

// Read all frequenly used elements and place them in a state object.
assignStateElements();

// Add events to the like btn, pop-up modal, sort select options and drag-and-drop.
addEvents();

// read 'likes' cookie and update the state.gridItems array accordingly.
readLikesCookie();

// Read 'sort' cookie and sort the state.gridItems array accordingly. 
readSortCookie();

// Now we are ready to render the grid.
renderGrid();

// Assign onload event to all images. 
gridImgsOnloadAssignment();