// =============================================================================
// The purpose of assigning all these DOM elements to some global variables,
// is to avoid calling the query selector over and over again. 
// =============================================================================
assignStateElements = () => {

  // grid general   
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

  // is assigned the onchange event.
  state.selectSort = document.getElementById('select-sort');

  // the target of drag operation.
  state.headerImg = document.querySelector('#header-img');
  state.draggedIntoDiv = document.querySelector('header #dragged-into-div');

  // misc.
  state.spinnerDiv = document.getElementById("spinner-div");
  state.selectOptionDiv = document.getElementById("select-option-div");
  state.filterInput = document.getElementById("filter-input");

  // to detect finger swipe on mobile device
  state.xDown = 0;
  state.yDown = 0;
  state.xUp = 0;
  state.yUp = 0;

  // used by the next/previous img btn. 
  state.modalImgIndex = 0;

  state.filteredGridItems = null;
  state.filterString = "";
};

changeModalImg = (direction) => {
  if (direction === "next")
    state.modalImgIndex = (state.modalImgIndex + 1) === state.filteredGridItems.length ? 0 : state.modalImgIndex + 1;
  else if (direction === "prev")
    state.modalImgIndex = state.modalImgIndex === 0 ? state.filteredGridItems.length - 1 : state.modalImgIndex - 1;

  renderModalImg();
}

// =============================================================================
// Add all events.
// =============================================================================
addEvents = () => {

  // Navigating left & right through the modal images can be done:
  // 1. through the left & right btn-images - listening to onclick events on these images.
  // 2. through the left & right keyboard's keys - listening to keydown event on the document. 
  state.nextBtn.onclick = (event) => {
    changeModalImg("next");
  }

  state.previousBtn.onclick = (event) => {
    changeModalImg("prev");
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight")
      changeModalImg("next");
    else if (event.key === "ArrowLeft")
      changeModalImg("prev");
  });

  // modal's closeEvent.
  state.modalImgCloseBtn.onclick = () => {
    state.modalCotainerDiv.style.display = "none";
    state.gridSection.classList.remove("blurred");
    state.gridSection.classList.add("un-blurred");
  }

  // onclick events that are related to each grid's image:
  // - likeEvent: like/unlike an image. I get the id from the parent element (figure tag)
  // - modalEvent: render popup modal image and blur the background. 
  // - if the modal is ON, then unblur the grid background upon closing a modal. 
  window.onclick = (event) => {
    let clickedElemClass = event.target.className;
    if (clickedElemClass.startsWith("heart")) {
      toggleHeart(event.target.parentElement.id);
    } else if (clickedElemClass.startsWith("grid-image")) {
      let itemId = event.target.parentElement.id
      state.modalImgIndex = state.filteredGridItems.map((gridItem) => gridItem.id).indexOf(itemId);
      renderModalImg();
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

  // touchEvents
  // I'm using the event.changedTouches rather then the event.touches since during
  // the touchEnd event only the changedTouches property is populated.
  window.addEventListener('touchstart', (event) => {
    let clickedElemClass = event.target.className;
    if (clickedElemClass.startsWith("grid-image")) {
      let theTouch = event.changedTouches[0];
      state.xDown = theTouch.clientX;
      state.yDown = theTouch.clientY;
    }
  });

  // the xDiff condition is to make sure a long swipe was excuted.
  // the yDiff condition is to make sure the swipe was mostly horizontal. 
  // swipe to the right - toggle the heart image.
  // swipe to the left - change the header's image. 
  window.addEventListener('touchend', (event) => {
    let clickedElemClass = event.target.className;
    if (clickedElemClass.startsWith("grid-image")) {
      let theTouch = event.changedTouches[0];
      state.xUp = theTouch.clientX;
      state.yUp = theTouch.clientY;

      let xDiff = Math.abs(state.xDown - state.xUp);
      let yDiff = Math.abs(state.yDown - state.yUp);

      if ((xDiff > 25) && (yDiff < 25)) {
        if (state.xUp > state.xDown) {
          toggleHeart(theTouch.target.parentElement.id);
        } else {
          setHeaderImgEvent(theTouch.target);
        }
      }
    }
  });

  // selectEvents. Upon selecting an option:
  // - sort the array.
  // - set the cookie.
  // - re-render the grid. 
  state.selectSort.onchange = (event) => {
    let selectedIndex = event.target.selectedIndex;
    let selectedOptionId = event.target[selectedIndex].id;
    switch (selectedOptionId) {
      case 'likes+1':
        sortGridItemsEvent('likes', 1);
        break;
      case 'likes-1':
        sortGridItemsEvent('likes', -1);
        break;
      case 'captions+1':
        sortGridItemsEvent('captions', 1);
        break;
      case 'captions-1':
        sortGridItemsEvent('captions', -1);
        break;
      default:
        break;
    }
    setCookie('sort', selectedOptionId);
    renderGrid();
  }

  state.filterInput.oninput = (event) => {
    state.filterString = event.target.value;
    renderGrid();
  }

  // dragEvents
  // attaching the event.target to the dynamically-created state.draggedIntoDiv.draggedImg property. 
  // it is used as a "global variable" that is read upon "drop" event. 
  state.dynamicGrid.addEventListener("dragstart", (event) => {
    let clickedElemClass = event.target.className;
    if (clickedElemClass === "grid-image") {
      state.draggedIntoDiv.draggedImg = event.target;
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
    event.preventDefault();
    setHeaderImgEvent(state.draggedIntoDiv.draggedImg);
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
// priot to invoking the function, the state.modalImgIndex is set properly. 
// =============================================================================
renderModalImg = () => {
  let gridItem = state.filteredGridItems[state.modalImgIndex];
  gridItem.renderModalImg();

  // So it won't bubble into window.onclick().
  event.stopPropagation();
}

// =============================================================================
// Like Toggling 
// =============================================================================
toggleHeart = (itemId) => {
  let gridIndex = state.filteredGridItems.map((gridItem) => gridItem.id).indexOf(itemId);
  let gridItem = state.filteredGridItems[gridIndex];
  gridItem.toggleLikeCount();
}

// =============================================================================
// The function is invoked either by drop (desktop) or swipeEnd (mobile) event. 
// The id is derived from the img's src in order to set the cookie. 
// =============================================================================
setHeaderImgEvent = (imgElem) => {
  let newImgSrc = imgElem.getAttribute("src");
  state.headerImg.setAttribute("src", newImgSrc);
  let imgId = newImgSrc.match('mia-small-(.*).jpg')[1];
  setCookie("headerImgId", imgId);
}

// =============================================================================
// This function takes 2 parameters, compare them and return true or false.
// Javascript sort function take a "compare" function as a parameter. 
// =============================================================================
sortGridItemsEvent = (sortByAttr, direction) => {
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
  let sortCookie = getCookie('sort');
  if (sortCookie === null) {
    sortCookie = "likes-1"; // default value.
  }

  let sortArr = sortCookie.match('(.*)([-+]1)');
  let sortAttr = sortArr[1];
  let sortDirection = sortArr[2];

  // Find the select option element pointed to by the cookie and add 'selected' attribute.
  // The options carry the same id as the cookie.
  let selectedOption = document.getElementById(sortCookie);
  selectedOption.setAttribute("selected", "selected");
  state.selectOptionDiv.style.visibility = "visible";

  sortGridItemsEvent(sortAttr, sortDirection);
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

  state.filteredGridItems = state.gridItems.filter((gridItem) => {
    let boolean = gridItem.caption.toLowerCase().includes(state.filterString);
    return boolean;
  });

  // loop through the state.gridItems array and construct the grid.
  state.filteredGridItems.forEach((elem, i) => {
    let id = elem.id;
    let src = elem.src;
    let caption = elem.caption;
    let likeCount = elem.likeCount;
    let date = elem.date;
    let isLiked = elem.isLiked;

    let heartImg = isLiked ? "images/heart-full.png" : "images/heart-outline.png";

    state.dynamicGrid.innerHTML +=
      `<figure id="${id}" class="grid-item">
         <img class="grid-image" src="${src}">
         <figcaption class="figcaption">
           ${caption} &nbsp;|&nbsp;
           <span id="like-count-span">${likeCount}</span>
           <img src="images/heart-likes.png" class="heart-likes-icon"/>\'s&nbsp;|&nbsp;
           ${date}&nbsp;
         </figcaption>
         <img class="heart" src=${heartImg} />
       </figure>`;
  });
}

// =============================================================================
// - During the lengthy grid-images load time I display a spinner.
// - When all the images are loaded, the window's load-event is fired.
// - At that time I would turn the grid from invisible to visible and hide the spinner.
// =============================================================================
window.addEventListener('load', (event) => {
  state.dynamicGrid.style.visibility = "visible";
  state.spinnerDiv.style.display = "none";
});

// =============================================================================
// - Intersection Observer API.
// - The IntersectionObserver object takes a callback-function and 
//   the options parameter which is an object that can contain 
//   other values beside 'threshold' such as 'root', 'rootMargin', etc.
// - The degree of intersection between the target element and the root is the 
//   intersection ratio (threshold).
// =============================================================================
var observer = new IntersectionObserver(function(entries) {
  for (entry of entries) {

    if (entry['isIntersecting'] === true) {
      console.log(entry);
      if (entry['intersectionRatio'] >= 0.9) {
        document.getElementById(entry.target.id).style.filter = "none";
      } else if (entry['intersectionRatio'] < 0.9) {
        document.getElementById(entry.target.id).style.filter = "blur(4px) grayscale(100%)";
      }
    }
  }
}, { threshold: [0, 0.9] });

attachImagesToObserver = () => {
  for (item of state.gridItems) {
    try {
      let theElem = document.getElementById(item.id);
      observer.observe(theElem);
    } catch (err) {
      console.log(err);
    }
  }
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

// The images will blur when go out of focus
attachImagesToObserver();