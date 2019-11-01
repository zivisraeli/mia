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

currentMenuEntry();

/* ============================================================== */

// get the content of the movable image
let movableImgElem = document.querySelector("#movable-img");
let movableImgSrc = movableImgElem.getAttribute("src");
movableImgElem.addEventListener("dragend", dragend);

// get the destination container and attach 2 events to it.
let headerImg = document.querySelector('#header-img');
headerImg.addEventListener("dragover", dragover);
headerImg.addEventListener("drop", drop);
headerImg.addEventListener("dragenter", dragenter);
headerImg.addEventListener("dragleave", dragleave);
headerImg.addEventListener("dragend", dragend);

function drop() {
  headerImg.setAttribute("src", movableImgSrc);
}

function dragover(e) {
  e.preventDefault()
}

function dragenter(e) {
  e.preventDefault()
  this.classList.add("hovered");
}

function dragleave() {
  headerImg.classList.remove("hovered");
}

function dragend() {
  console.log('end');
  headerImg.classList.remove("hovered");
}