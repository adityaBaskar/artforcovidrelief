data = {
  "lorem": {
    "title": "title lorem",
    "artist": "artist lorem",
    "amount": 5000,
    "type": "Painting",
    "dimensions": "20 x 28 in",
    "location": "Mumbai",
    "image": "https://dl.airtable.com/.attachments/ade0841f94c47827141ccb8bc5129b99/74676bee/d7kOge2B72t9.jpg"
  },
  "ipsum": {
    "title": "title ipsum",
    "artist": "artist ipsum",
    "amount": 7000,
    "type": "Digital Painting",
    "dimensions": "10 x 18 in",
    "location": "Hyderabad",
    "img": "https://dl.airtable.com/.attachments/c1380100bfb821deeaf7a901ce78c0ed/bfddd773/7lYnBWzQlx07.jpg"
  }
}

titleDiv = $(".popup-title")
artistDiv = $(".popup-artist")
typeDiv = $(".popup-type span")
dimensionsDiv = $(".popup-dimensions span")
locationDiv = $(".popup-location span")
amountDiv = $(".popup-amount span")
imgDiv = $(".popup-img img")

function openPopup(name){
  titleDiv.html(data[name]["title"])
  artistDiv.html(data[name]["artist"])
  typeDiv.html(data[name]["type"])
  amountDiv.html(data[name]["amount"])
  dimensionsDiv.html(data[name]["dimensions"])
  locationDiv.html(data[name]["location"])
  imgDiv.attr("src", data[name]["img"])
  $(".popup").css("display", "block")
}

function blah(){
  $(".popup").css("display", "block")
}

function hidePopup(){
  $(".popup").css("display", "none")
}

function verifyAndBuy(){
  alert(1)
}