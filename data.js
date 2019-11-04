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
  new GridItem("id3", "images/mia-id3.jpg", "wMia in the park", "09/18/2019", 17, false),
  new GridItem("id4", "images/mia-id4.jpg", "aMia in the park", "09/18/2019", 2, false),
  new GridItem("id5", "images/mia-id5.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id6", "images/mia-id6.jpg", "hMia in the park", "09/18/2019", 9, false),
  new GridItem("id7", "images/mia-id7.jpg", "dMia in the park", "09/18/2019", 13, false),
  new GridItem("id8", "images/mia-id8.jpg", "zMia in the park", "09/18/2019", 11, false),  
];