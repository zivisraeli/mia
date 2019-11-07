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
  new GridItem("id00", "images/mia-small-id00.jpg", "zMia in the park", "09/18/2019", 15, false),
  new GridItem("id01", "images/mia-small-id01.jpg", "dMia in the park", "09/18/2019", 25, false),
  new GridItem("id02", "images/mia-small-id02.jpg", "cMia in the park", "09/18/2019", 5, false),
  new GridItem("id03", "images/mia-small-id03.jpg", "wMia in the park", "09/18/2019", 17, false),
  new GridItem("id04", "images/mia-small-id04.jpg", "aMia in the park", "09/18/2019", 2, false),
  new GridItem("id05", "images/mia-small-id05.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id06", "images/mia-small-id06.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id07", "images/mia-small-id07.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id08", "images/mia-small-id08.jpg", "mMia in the park", "09/18/2019", 15, false),
  new GridItem("id09", "images/mia-small-id09.jpg", "qMia in the park", "09/18/2019", 21, false),
  new GridItem("id10", "images/mia-small-id10.jpg", "cMia in the park", "09/18/2019", 15, false),
  new GridItem("id11", "images/mia-small-id11.jpg", "wMia in the park", "09/18/2019", 17, false),
  new GridItem("id12", "images/mia-small-id12.jpg", "mMia in the park", "09/18/2019", 15, false),
  new GridItem("id13", "images/mia-small-id13.jpg", "qMia in the park", "09/18/2019", 21, false),
  new GridItem("id14", "images/mia-small-id14.jpg", "cMia in the park", "09/18/2019", 15, false),
  new GridItem("id15", "images/mia-small-id15.jpg", "wMia in the park", "09/18/2019", 17, false),
  new GridItem("id16", "images/mia-small-id16.jpg", "zMia in the park", "09/18/2019", 15, false),
  new GridItem("id17", "images/mia-small-id17.jpg", "dMia in the park", "09/18/2019", 25, false),
  new GridItem("id18", "images/mia-small-id18.jpg", "cMia in the park", "09/18/2019", 5, false),
  new GridItem("id19", "images/mia-small-id19.jpg", "wMia in the park", "09/18/2019", 17, false),
  new GridItem("id20", "images/mia-small-id20.jpg", "aMia in the park", "09/18/2019", 2, false),
  new GridItem("id21", "images/mia-small-id21.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id22", "images/mia-small-id22.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id23", "images/mia-small-id23.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id24", "images/mia-small-id24.jpg", "mMia in the park", "09/18/2019", 15, false),
  new GridItem("id25", "images/mia-small-id25.jpg", "qMia in the park", "09/18/2019", 21, false),
  new GridItem("id26", "images/mia-small-id26.jpg", "cMia in the park", "09/18/2019", 15, false),  
  new GridItem("id27", "images/mia-small-id27.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id28", "images/mia-small-id28.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id29", "images/mia-small-id29.jpg", "aMia in the park", "09/18/2019", 5, false),
  new GridItem("id30", "images/mia-small-id30.jpg", "mMia in the park", "09/18/2019", 15, false),
  new GridItem("id31", "images/mia-small-id31.jpg", "qMia in the park", "09/18/2019", 21, false),
  new GridItem("id32", "images/mia-small-id32.jpg", "cMia in the park", "09/18/2019", 15, false)  
];