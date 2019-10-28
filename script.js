class Item {
  constructor(date) {
    this.date = date;
  }
}

// ==========================================================================
// Grid Creation
// ==========================================================================
class GridItem extends Item {
  constructor(src, caption, date, likeCount, isLiked) {
    super(date);
    this.src = src;
    this.caption = caption;
    this.likeCount = likeCount;
    this.isLiked = isLiked;
  }
}

let gridItems = [
  new GridItem("images/miaTry1-600.jpg", "dMia in the park", "09/18/2019", 25, false),
  new GridItem("images/miaTry2-450.jpg", "cMia in the park", "09/18/2019", 5, false),
  new GridItem("images/miaTry3-400.jpg", "wMia in the park", "09/18/2019", 17, false),
  new GridItem("images/miaTry1-600.jpg", "aMia in the park", "09/18/2019", 2, false),
  new GridItem("images/miaTry2-450.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("images/miaTry3-400.jpg", "hMia in the park", "09/18/2019", 9, false),
  new GridItem("images/miaTry1-600.jpg", "dMia in the park", "09/18/2019", 13, false),
  new GridItem("images/miaTry2-450.jpg", "Mia in the park", "09/18/2019", 11, false),
  new GridItem("images/miaTry3-400.jpg", "jMia in the park", "09/18/2019", 12, false),
  new GridItem("images/miaTry1-600.jpg", "lMia in the park", "09/18/2019", 5, false),
  new GridItem("images/miaTry2-450.jpg", "zMia in the park", "09/18/2019", 15, false),
];

makeGrid = () => {
  // the grid container
  let theGrid = document.querySelector(".the-grid");
  theGrid.innerHTML = '';

  gridItems.forEach((elem, i) => {
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
         <img class="heart" id="h${i}" src=${heartImg} style="width:15px"/>
       </figure>`;
  });

  // ==========================================================================
  // Events for the grid elements must be re-created everytime the grid is rendered.
  // - Get the grid item that opens the modal
  // - When the user clicks on an grid item, either:
  //    - he clicked on the heart icon - toggle it.
  //    - otherwise open the modal popup. 
  // - since getElementsByClassName return HTMLCollection it needs to be convered to an Array
  // ==========================================================================
  let allItems = document.getElementsByClassName("grid-item");
  Array.from(allItems).forEach((gridItem) => {
    gridItem.onclick = function(event) {
      // Manipulate the  heart
      if (event.target.className === "heart") {
        toggleHeart(event);
      } else {
        modal.style.display = "block";
      }
    }
  });
}

// ==========================================================================
// Like Toggling 
// ==========================================================================
toggleHeart = (event) => {
  // Get the target element (one with the class="heart")
  let theTarget = document.getElementById(event.target.id);

  // Get the target id, and based on the isLiked value:
  //   - increment or decrement the likeCount.
  //   - toggle the isLiked value.
  //   - render the right icon.
  let elemIndex = event.target.id.substring(1);
  if (gridItems[elemIndex].isLiked) {
    gridItems[elemIndex].likeCount--;
    gridItems[elemIndex].isLiked = false;
    theTarget.setAttribute("src", "images/heartOutline1.png");
  } else {
    gridItems[elemIndex].likeCount++;
    gridItems[elemIndex].isLiked = true;
    theTarget.setAttribute("src", "images/heartMid3.jpg");
  }

  // render the like count.
  // we grab the parent (figure tag) from which we query for the like-count-span.
  let parentElem = theTarget.parentElement;
  let countElem = parentElem.querySelector("#like-count-span");
  countElem.innerHTML = gridItems[elemIndex].likeCount;

  document.cookie = "ziv=israeli"
  let mycookie = document.cookie;
  console.log(mycookie);
}

// ==========================================================================
// Grid Sorting 
// ==========================================================================
let mySelect = document.getElementById('select-sort');
mySelect.onchange = (event) => {
  var inputText = event.target.value;
  var ind = event.target.selectedIndex;
  switch (ind) {
    case 1:
      sortGridItems('likes', 1);
      break;
    case 2:
      sortGridItems('likes', -1);
      break;
    case 3:
      sortGridItems('captions', 1);
      break;
    case 4:
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

// ==========================================================================
// Modal Creation
// ==========================================================================
let modal = document.getElementById("imgModal");
let closeModalBtn = document.getElementsByClassName("closeModalBtn")[0];

// When the user clicks on closeModalBtn, close the modal.
closeModalBtn.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close the modal.
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

makeGrid();


function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}
function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

setCookie("ziv", "israeli", 100);
let myCookie = getCookie("ziv");
alert(myCookie);