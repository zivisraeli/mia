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
  new GridItem("id0", "images/mia-small-id00.jpg", "zMia in the park", "09/18/2019", 15, false),
  new GridItem("id1", "images/mia-small-id01.jpg", "dMia in the park", "09/18/2019", 25, false),
  new GridItem("id2", "images/mia-small-id02.jpg", "cMia in the park", "09/18/2019", 5, false),
  new GridItem("id3", "images/mia-small-id03.jpg", "wMia in the park", "09/18/2019", 17, false),
  new GridItem("id4", "images/mia-small-id04.jpg", "aMia in the park", "09/18/2019", 2, false),
  new GridItem("id5", "images/mia-small-id05.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id6", "images/mia-small-id06.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id7", "images/mia-small-id07.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id0", "images/mia-small-id08.jpg", "mMia in the park", "09/18/2019", 15, false),
  new GridItem("id1", "images/mia-small-id09.jpg", "qMia in the park", "09/18/2019", 21, false),
  new GridItem("id2", "images/mia-small-id10.jpg", "cMia in the park", "09/18/2019", 15, false),
  new GridItem("id3", "images/mia-small-id11.jpg", "wMia in the park", "09/18/2019", 17, false),
  new GridItem("id0", "images/mia-small-id12.jpg", "mMia in the park", "09/18/2019", 15, false),
  new GridItem("id1", "images/mia-small-id13.jpg", "qMia in the park", "09/18/2019", 21, false),
  new GridItem("id2", "images/mia-small-id14.jpg", "cMia in the park", "09/18/2019", 15, false),
  new GridItem("id3", "images/mia-small-id15.jpg", "wMia in the park", "09/18/2019", 17, false),
  
];