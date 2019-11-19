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
  toggleLikeCount() {
    // Find the heart element based on the item id
    let heartElement = document.querySelector(`#${this.id} .heart`);

    if (this.isLiked) {
      this.isLiked = false;
      this.likeCount--;
      heartElement.setAttribute("src", "images/heart-outline.png");
      heartElement.setAttribute("class", "heart");
    } else {
      this.isLiked = true;
      this.likeCount++;
      heartElement.setAttribute("src", "images/heart-full.png");
      heartElement.setAttribute("class", "heart animatedHeartBeat");
    }

    // re-render the like count number (since it was incremented/decremented through the toggle).
    // we grab the parent (figure tag) from which we query for the like-count-span.
    let countElement = heartElement.parentElement.querySelector("#like-count-span");
    countElement.innerHTML = this.likeCount;

    // to make updateLikesCookie() private it's nested within toggleLikeCount()
    // however, 'this' will is out of scope to the nested method and so, I preserve it
    // by assigning it to 'that'. 
    // Otherwise, this would be 'undefined' (prior to JS-5 it would've been the global 'window' object)
    let that = this;
    updateLikesCookie();

    // =============================================================================
    // 1. get 'likes' cookie (a string-ed array)
    // 2. if not empty, JSON-parse it to convert the string to an array. 
    // 3. push or remove (filter) an element based on gridItem.isLiked value.
    // 4. JSON-stringify it to convert the array to a string. 
    // 5. set the cookie with the new string.
    // =============================================================================
    updateLikesCookie = () => {
      let likeArray = [];
      let likeCookie = getCookie('likes');
      if (likeCookie != null) {
        likeArray = JSON.parse(likeCookie);
      }
      if (that.isLiked) {
        likeArray.push(that.id);
      } else {
        let filteredArray = likeArray.filter((id) => {
          return id != that.id;
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
  renderModalImg() {
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