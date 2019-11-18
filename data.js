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

  // =============================================================================
  // in order to find the specific heart element we query the id+.heart since the 
  // id property is with the figure element (the parent of the heart img).
  // the method would:
  //   - toggle the isLiked value.
  //   - increment/decrement the likeCount.
  //   - render the right icon with/without the animation.
  // =============================================================================
  toggleLikeCount = () => {
    // Get the target element based on the item id
    let theElement = document.querySelector(`#${this.id} .heart`);

    if (this.isLiked) {
      this.isLiked = false;
      this.likeCount--;
      theElement.setAttribute("src", "images/heart-outline.png");
      theElement.setAttribute("class", "heart");
    } else {
      this.isLiked = true;
      this.likeCount++;
      theElement.setAttribute("src", "images/heart-full.png");
      theElement.setAttribute("class", "heart animatedHeartBeat");
    }

    // re-render the like count.
    // we grab the parent (figure tag) from which we query for the like-count-span.
    let parentElem = theElement.parentElement;
    let countElem = parentElem.querySelector("#like-count-span");
    countElem.innerHTML = this.likeCount;

    updateLikesCookie();

    // =============================================================================
    // updateLikesCookie should be a private function. it implements a closure: 
    // - gets 'likes' cookie (a string-ed array)
    // - if not empty, JSON-parse it to convert the string to an array. 
    // - push or remove (filter) an element based on gridItem.isLiked value.
    // - JSON-stringify it to convert the array to a string. 
    // - sets the cookie with the new string.
    // =============================================================================
    function updateLikesCookie() {
      let likeArray = [];
      let likeCookie = getCookie('likes');
      if (likeCookie != null) {
        likeArray = JSON.parse(likeCookie);
      }
      if (this.isLiked) {
        likeArray.push(this.id);
      } else {
        let filteredArray = likeArray.filter((id) => {
          return id != this.id;
        });
        likeArray = filteredArray;
      }

      likeCookie = JSON.stringify(likeArray);
      setCookie('likes', likeCookie);
    }
  }

  // =============================================================================
  // renderModalImgEvent would render the clicked img inside the modal div.
  // =============================================================================
  renderModalImg = () => {
    // remove the 'small' portion of the src field value. 
    // i.e. "mia-small-id07.jpg" => "mia-id07.jpg"
    let arrSrc = this.src.match('(.*mia-).*-(.*)(\.jpg$)');
    let modalImgSrc = arrSrc[1] + arrSrc[2] + arrSrc[3];

    // these 3 modal related elements are set with the data from this object. 
    state.modalImg.setAttribute("src", modalImgSrc);
    state.modalImgText.innerHTML = this.caption;
    state.modalImgLikeCount.innerHTML = `${this.likeCount}&nbsp<img src="images/heart-likes.png" class="heart-likes-icon"/>'s`;

    // Upon loading the img I need to get its "natural" size.
    // Since I place the modal-content-div 110px from the top it's not included in the vp Height. 
    // Yet, the max width of an image would be 75% of the vp. 
    state.modalImg.onload = function() {
      let imgW = state.modalImg.naturalWidth;
      let imgH = state.modalImg.naturalHeight;
      let vpW = document.documentElement.clientWidth;
      let vpH = document.documentElement.clientHeight - 110;
      let imgPropotion = imgW / imgH;
      let newW = imgPropotion * vpH;
      state.modalContentDiv.style.width = newW + "px";

      // Finally, display it. 
      state.modalCotainerDiv.style.display = "block";
    }
  }
}

let gridItems = [
  new GridItem("id00", "images/mia-small-id00.jpg", "First Shower I", "04/18/2019", 35, false),
  new GridItem("id01", "images/mia-small-id01.jpg", "Daddy Ziv I", "05/06/2019", 23, false),
  new GridItem("id02", "images/mia-small-id02.jpg", "Me, Pretty", "10/02/2019", 5, false),
  new GridItem("id03", "images/mia-small-id03.jpg", "Destructive Me I", "04/30/2019", 17, false),
  new GridItem("id04", "images/mia-small-id04.jpg", "Daddy Ami II", "09/18/2019", 19, false),
  new GridItem("id05", "images/mia-small-id05.jpg", "Fryman Canyon Trail I", "07/13/2019", 5, false),
  new GridItem("id06", "images/mia-small-id06.jpg", "Chucky/Serial Killer I", "10/31/2019", 5, false),
  new GridItem("id07", "images/mia-small-id07.jpg", "Chucky/Serial Killer II", "10/31/2019", 5, false),
  new GridItem("id08", "images/mia-small-id08.jpg", "With Blue", "10/03/2019", 15, false),
  new GridItem("id09", "images/mia-small-id09.jpg", "Runyon Canyon I", "09/01/2019", 21, false),
  new GridItem("id10", "images/mia-small-id10.jpg", "Daddy Ziv III", "09/18/2019", 33, false),
  new GridItem("id11", "images/mia-small-id11.jpg", "Fryman Canyon Trail II", "07/13/2019", 17, false),
  new GridItem("id12", "images/mia-small-id12.jpg", "Napping II", "09/18/2019", 15, false),
  new GridItem("id13", "images/mia-small-id13.jpg", "Catnap I", "08/23/2019", 21, false),
  new GridItem("id14", "images/mia-small-id14.jpg", "Fryman Canyon Trail III", "07/13/2019", 25, false),
  new GridItem("id15", "images/mia-small-id15.jpg", "Fryman Canyon Trail IV", "07/13/2019", 17, false),
  new GridItem("id16", "images/mia-small-id16.jpg", "Daddy Ziv IV", "09/02/2019", 15, false),
  new GridItem("id17", "images/mia-small-id17.jpg", "Catnap II", "07/11/2019", 25, false),
  new GridItem("id18", "images/mia-small-id18.jpg", "Catnap III", "07/11/2019", 5, false),
  new GridItem("id19", "images/mia-small-id19.jpg", "Life Is Good", "08/12/2019", 17, false),
  new GridItem("id20", "images/mia-small-id20.jpg", "Destructive Me II", "05/18/2019", 2, false),
  new GridItem("id21", "images/mia-small-id21.jpg", "Daddy Ziv II", "08/14/2019", 5, false),
  new GridItem("id22", "images/mia-small-id22.jpg", "With Marc I", "06/06/2019", 21, false),
  new GridItem("id24", "images/mia-small-id24.jpg", "With Marc II", "06/12/2019", 15, false),
  new GridItem("id25", "images/mia-small-id25.jpg", "Destruction", "07/21/2019", 21, false),
  new GridItem("id26", "images/mia-small-id26.jpg", "Daddy Ami I", "08/01/2019", 31, false),
  new GridItem("id27", "images/mia-small-id27.jpg", "Napping I", "07/19/2019", 5, false),
  new GridItem("id28", "images/mia-small-id28.jpg", "Destructive Me III", "07/19/2019", 5, false),
  new GridItem("id29", "images/mia-small-id29.jpg", "With Daphna", "09/01/2019", 12, false),
  new GridItem("id30", "images/mia-small-id30.jpg", "Head Licking", "06/17/2019", 15, false),
  new GridItem("id31", "images/mia-small-id31.jpg", "First Shower II", "04/18/2019", 21, false),
  new GridItem("id32", "images/mia-small-id32.jpg", "Play Time", "09/09/2019", 15, false),
  new GridItem("id33", "images/mia-small-id33.jpg", "Napping III", "11/02/2019", 45, false)
];