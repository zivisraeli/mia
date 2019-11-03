class Item {
  constructor(id) {
    this.id = id;
  }
}

class GridItem extends Item {
  constructor(id, src, caption, date, likeCount, isLiked) {
    super(id);
    this.src = src;
    this.caption = caption;
    this.date = date;
    this.likeCount = likeCount;
    this.isLiked = isLiked;
  }
}

let gridItems = [
  new GridItem("id0", "images/mia-id0.jpg", "zMia in the park", "09/18/2019", 15, false),
  new GridItem("id1", "images/mia-id1.jpg", "dMia in the park", "09/18/2019", 25, false),
  new GridItem("id2", "images/mia-id2.jpg", "cMia in the park", "09/18/2019", 5, false),
  new GridItem("id3", "images/miaTry3-400.jpg", "wMia in the park", "09/18/2019", 17, false),
  new GridItem("id4", "images/miaTry1-600.jpg", "aMia in the park", "09/18/2019", 2, false),
  new GridItem("id5", "images/miaTry2-450.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id6", "images/miaTry3-400.jpg", "hMia in the park", "09/18/2019", 9, false),
  new GridItem("id7", "images/miaTry1-600.jpg", "dMia in the park", "09/18/2019", 13, false),
  new GridItem("id8", "images/miaTry2-450.jpg", "Mia in the park", "09/18/2019", 11, false),
  new GridItem("id9", "images/miaTry3-400.jpg", "jMia in the park", "09/18/2019", 12, false),
  new GridItem("id10", "images/miaTry1-600.jpg", "lMia in the park", "09/18/2019", 5, false),
  new GridItem("id11", "images/miaTry2-450.jpg", "zMia in the park", "09/18/2019", 15, false),
];

// =============================================================================
// Grid Creation
// =============================================================================
makeGrid = () => {
  // read 'likes' cookie and update the gridItems array accordingly.
  readLikesCookie();

  // loop through the gridItems array and construct the grid.
  let theGrid = document.querySelector(".the-grid");
  theGrid.innerHTML = '';

  gridItems.forEach((elem, i) => {
    let id = elem.id;
    let src = elem.src;
    let caption = elem.caption;
    let likeCount = elem.likeCount;
    let date = elem.date;
    let isLiked = elem.isLiked;

    let heartImg = isLiked ? "images/heartMid3.jpg" : "images/heartOutline1.png";

    theGrid.innerHTML +=
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

  // =============================================================================
  // Events for the grid elements must be re-created everytime the grid is rendered after sorting.
  // - Get the grid item that opens the modal
  // - When the user clicks on an grid item, either:
  //    - he clicked on the heart icon - toggle it.
  //    - otherwise open the modal popup. 
  // - since getElementsByClassName return HTMLCollection it needs to be convered to an Array
  // =============================================================================
  let allItems = document.getElementsByClassName("grid-item");
  Array.from(allItems).forEach((gridItem) => {

    // add onclick event to open the model popup
    gridItem.onclick = function(event) {
      // Manipulate the heart
      if (event.target.className === "heart") {
        toggleHeart(event);
      } else {
        modal.style.display = "block";
        let theImgSrc = event.target.src;
        let targetImg = modal.querySelector("img");
        targetImg.setAttribute("src", theImgSrc);

        let gridSection = document.querySelector("#grid-section");
        gridSection.style.filter = "blur(12px)";
      }
    }

    // add the drag events
    let gridImage = gridItem.querySelector(".grid-image");
    gridImage.addEventListener("dragstart", dragstart);
    gridImage.addEventListener("dragend", dragend);
  });
}

// =============================================================================
// Like Toggling 
// =============================================================================
toggleHeart = (event) => {
  // Get the target element based on the target id
  let theTarget = document.getElementById(event.target.id);

  // Based on the target id, find the element in the gridItems and:
  //   - increment or decrement the likeCount.
  //   - toggle the isLiked value.
  //   - render the right icon.
  let gridItem = gridItems.find((obj) => {
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
// Grid Sorting 
// =============================================================================
let mySelect = document.getElementById('select-sort');
mySelect.onchange = (event) => {
  var inputText = event.target.value;
  var ind = event.target.selectedIndex;
  switch (ind) {
    case 0:
      sortGridItems('likes', 1);
      break;
    case 1:
      sortGridItems('likes', -1);
      break;
    case 2:
      sortGridItems('captions', 1);
      break;
    case 3:
      sortGridItems('captions', -1);
      break;
    default:
      break;
  }
}

function sortGridItems(property, direction) {
  let sortedGridItems = gridItems.sort((item1, item2) => {
    let retVal = 0;
    if (property === "captions") {
      retVal = item1.caption.toUpperCase() > item2.caption.toUpperCase() ? 1 : -1;
    } else {
      retVal = item1.likeCount > item2.likeCount ? 1 : -1;
    }
    return retVal * direction;
  });
  gridItems = sortedGridItems;
  makeGrid();
}

// =============================================================================
// Modal Creation
// =============================================================================
let modal = document.getElementById("modal-container");
let closeModalBtn = document.getElementsByClassName("close-modal-btn")[0];

// When the user clicks on close-modal-btn, close the modal and "unblur" the grid.
closeModalBtn.onclick = function() {
  modal.style.display = "none";
  let gridSection = document.querySelector("#grid-section");
  gridSection.style.filter = "none";
}

// When the user clicks anywhere outside of the modal, close the modal.
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// =============================================================================
// readLikesCookie would read 'likes' cookie and update the gridItems array accordingly. 
// =============================================================================
readLikesCookie = () => {
  // read 'likes' cookie
  likeArray = [];
  let likeCookie = getCookie('likes');
  if (likeCookie != null) {
    likeArray = JSON.parse(likeCookie);
  }
  likeArray.forEach((id) => {
    let gridElem = gridItems.find((elem) => {
      return elem.id === id;
    });
    if (gridElem != null) {
      gridElem.isLiked = true;
      gridElem.likeCount++;
    }
  });
}

// =============================================================================
// 1. get 'likes' cookie (a string)
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
// Drag and Drop
// =============================================================================

// when the "movable" image is "dropped" at its target (headerImg)
// we then change the "src" attribute.
drop = () => {
  console.log(event.type);
  console.log(event.target);
  console.log(event.relatedTarget);
  console.log("============");
  headerImg.setAttribute("src", movableImgSrc);
  let imgId = movableImgSrc.match('mia-(.*).jpg')[1];
  setCookie("headerImgId", imgId);
}

dragover = (event) => {
  event.preventDefault();
}

dragenter = (event) => {
  console.log(event.type);
  console.log(event.target);
  console.log(event.relatedTarget);
  console.log("============");
  event.preventDefault();
  headerImg.classList.add("img-hovered");
}

// if image is dragged outside the div BUT into the image (the image is inside the div)
// then it's still considered inside the div and therefor don't remove the hover styling.
dragleave = (event) => {
  console.log(event.type);
  console.log(event.target);
  console.log(event.relatedTarget);
  console.log("============");
  let relatedTargetId = event.relatedTarget.id;
  if (relatedTargetId != 'header-img') {
    headerImg.classList.remove("img-hovered");
  }
}

// both, dragstart & dragend happens on the originating element.
dragend = (event) => {
  console.log(event.type);
  console.log(event.target);
  console.log(event.relatedTarget);
  console.log("============");
  headerImg.classList.remove("img-hovered");
}

// upon starting, capture the image src of the "movable" image.
dragstart = (event) => {
  console.log(event.type);
  console.log(event.target);
  console.log(event.relatedTarget);
  console.log("============");
  movableImgSrc = event.target.src;
}

// get the destination container and attach 2 events to it.
let movableImgSrc = '';
let headerImg = document.querySelector('#header-img');
let draggedIntoDiv = document.querySelector('header #dragged-into-div');
draggedIntoDiv.addEventListener("dragover", dragover);
draggedIntoDiv.addEventListener("drop", drop);
draggedIntoDiv.addEventListener("dragenter", dragenter);
draggedIntoDiv.addEventListener("dragleave", dragleave);

// =============================================================================

makeGrid();