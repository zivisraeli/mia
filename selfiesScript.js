let state = {};

// =============================================================================
// Get all state elements
// =============================================================================
assignStateElements = () => {
  state.gridItems = gridItems;
  state.theGrid = document.querySelector(".the-grid");
  state.selectSort = document.getElementById('select-sort');
  state.modalContainer = document.getElementById("modal-container");
  state.closeModalBtn = document.getElementsByClassName("close-modal-btn")[0];
  state.gridSection = document.querySelector("#grid-section");
  state.modalImg = state.modalContainer.querySelector("img");
  state.headerImg = document.querySelector('#header-img');
  state.draggedIntoDiv = document.querySelector('header #dragged-into-div');
  state.draggedImgSrc = '';
};

// =============================================================================
// Add all events
// =============================================================================
addEvents = () => {
  // When the user clicks on the 'X' btn, close the modal.
  state.closeModalBtn.onclick = () => {
    state.modalContainer.style.display = "none";
    state.gridSection.classList.remove("blurred");
    state.gridSection.classList.add("un-blurred");
  }

  // When the user clicks anywhere outside of the modal, close the modal.
  window.onclick = (event) => {
    if (event.target == state.modalContainer) {
      state.modalContainer.style.display = "none";
      state.gridSection.classList.remove("blurred");
      state.gridSection.classList.add("un-blurred");
    }
  }

  // When the user select a sort option set the cookie and re-rendered the grid.
  state.selectSort.onchange = (event) => {
    let inputText = event.target.value;
    let index = event.target.selectedIndex;
    switch (index) {
      case 0:
        sortGridItems('likes', 1);
        setCookie('sort', 'likes+1');
        break;
      case 1:
        sortGridItems('likes', -1);
        setCookie('sort', 'likes-1');
        break;
      case 2:
        sortGridItems('captions', 1);
        setCookie('sort', 'captions+1');
        break;
      case 3:
        sortGridItems('captions', -1);
        setCookie('sort', 'captions-1');
        break;
      default:
        break;
    }

    renderGrid();
  }

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
// readSortCookie would read 'sort' cookie, set the selected option and sort the grid items array.
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
      retVal = item1.likeCount > item2.likeCount ? 1 : -1;
    }
    return retVal * direction;
  });

  state.gridItems = sortedGridItems;
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
  state.theGrid.innerHTML = '';

  // loop through the state.gridItems array and construct the grid.
  state.gridItems.forEach((elem, i) => {
    let id = elem.id;
    let src = elem.src;
    let caption = elem.caption;
    let likeCount = elem.likeCount;
    let date = elem.date;
    let isLiked = elem.isLiked;

    let heartImg = isLiked ? "images/heartMid3.jpg" : "images/heartOutline1.png";

    state.theGrid.innerHTML +=
      `<figure class="grid-item">
         <img class="grid-image" src="${src}">
         <figcaption>${caption} &nbsp;|&nbsp;
                     <span id="like-count-span">${likeCount}</span>&nbsp;
                     <img src="images/heartMid2.jpg" style="width:15px"/>\'s&nbsp;|&nbsp;
                     ${date}&nbsp;
         </figcaption>
         <img class="heart" id="${id}" src=${heartImg} style="width:15px"/>
       </figure>`;
  });

  // Each grid item is attached with the onclick event
  // which can be either the heart clicked or the image itself.
  let allItems = document.getElementsByClassName("grid-item");
  Array.from(allItems).forEach((gridItem) => {
    gridItem.onclick = function(event) {
      if (event.target.className === "heart") {
        toggleHeart(event);
      } else {
        state.modalContainer.style.display = "block";
        let targetSrc = event.target.src;
        state.modalImg.setAttribute("src", targetSrc);
        state.gridSection.classList.remove("un-blurred");
        state.gridSection.classList.add("blurred");
      }
    }

    // A dragstart event is attached to every grid's image to capture the src.
    let gridImage = gridItem.querySelector(".grid-image");
    gridImage.addEventListener("dragstart", (event) => {
      state.draggedImgSrc = event.target.src;
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
  //   - increment or decrement the likeCount.
  //   - toggle the isLiked value.
  //   - render the right icon.
  let gridItem = state.gridItems.find((obj) => {
    return obj.id === event.target.id;
  });

  if (gridItem.isLiked) {
    gridItem.isLiked = false;
    gridItem.likeCount--;
    theTarget.setAttribute("src", "images/heartOutline1.png");
  } else {
    gridItem.isLiked = true;
    gridItem.likeCount++;
    theTarget.setAttribute("src", "images/heartMid3.jpg");
    theTarget.setAttribute("class", "heart animated heartBeat slower");
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