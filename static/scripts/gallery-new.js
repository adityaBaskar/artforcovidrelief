var gallery_art = [];
var selected_index = 0;

// gallery_art = {
//   "lorem": {
//     "title": "title lorem",
//     "artist": "artist lorem",
//     "amount": 5000,
//     "type": "Painting",
//     "dimensions": "20 x 28 in",
//     "location": "Mumbai",
//     "image": "https://dl.airtable.com/.attachments/ade0841f94c47827141ccb8bc5129b99/74676bee/d7kOge2B72t9.jpg"
//   },
//   "ipsum": {
//     "title": "title ipsum",
//     "artist": "artist ipsum",
//     "amount": 7000,
//     "type": "Digital Painting",
//     "dimensions": "10 x 18 in",
//     "location": "Hyderabad",
//     "img": "https://dl.airtable.com/.attachments/c1380100bfb821deeaf7a901ce78c0ed/bfddd773/7lYnBWzQlx07.jpg"
//   }
// }

defaultMinDonation = 1000;

titleDiv = $(".popup-title");
artistDiv = $(".popup-artist");
typeDiv = $(".popup-type span");
dimensionsDiv = $(".popup-dimensions span");
locationDiv = $(".popup-location span");
amountDiv = $(".popup-amount span");
imgDiv = $(".popup-img img");
formArtWork = $("#artwork");

function openPopup(index){
  titleDiv.html(gallery_art[index]["title"]);
  artistDiv.html(gallery_art[index]["artist"]);
  typeDiv.html(gallery_art[index]["type"]);
  var amount = "Minimum donation amount: Rs. " + (gallery_art[index]["amount"] | defaultMinDonation)
  if (gallery_art[index]['sold']) {
    amount = "This artwork has already been picked by another donor.";
  }
  amountDiv.html(amount);
  dimensionsDiv.html(gallery_art[index]["dimensions"]);
  locationDiv.html(gallery_art[index]["location"]);
  imgDiv.attr("src", gallery_art[index]["img"]);
  formArtWork.val(gallery_art[index]["title"] + " by " + gallery_art[index]["artist"]);
  selected_index = index;
  $(".popup").css("display", "block");
}

function hidePopup(){
  $(".popup").css("display", "none");
}

function verifyAndBuy(){
  var email = document.getElementById("email").value;
  var artwork = gallery_art[selected_index];
  var name = document.getElementById("fullname").value;
  var phonenumber = document.getElementById("phonenumber").value;
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) {
      alert("Invalid Email Id");
      return;
  }
  if (name == null || name.length == 0) {
      alert("Invalid Name");
      return;
  }
  Email.send({
      Host: "smtp.gmail.com",
      Username: "artorderforcovidrelief@gmail.com",
      Password: "WeRtUDon8",
      To: 'contactartforcovidrelief@gmail.com',
      From: "artorderforcovidrelief@gmail.com",
      Subject: "Art order from " + email,
      Body: name + " would like to make a donation for this artwork \n" + artwork["title"] + " by " + artwork["artist"] + "\nReach out to them on: " + email  + " " + phonenumber,
  })
      .then(function (message) {
          alert("Thank you! Our team will get in touch with you over email to collect reciept and work out shipping details");
          hidePopup();
      });
}

function PopulateGalleryWithData() {

//   <div class="item" onclick=openPopup('ipsum')>
//   <div class="item__content">
//     <img src="https://dl.airtable.com/.attachments/c1380100bfb821deeaf7a901ce78c0ed/bfddd773/7lYnBWzQlx07.jpg">
//   </div>
// </div>

  var masonry = document.getElementById("masonry");
  for (i in gallery_art) {
    var gallery_image = document.createElement("img");
    gallery_image.src = gallery_art[i]["img"];

    var gallery_item = document.createElement("div");
    gallery_item.classList.add("item__content");
    gallery_item.appendChild(gallery_image);

    var gallery_item_clickable = document.createElement("div");
    gallery_item_clickable.classList.add("item");
    gallery_item_clickable.appendChild(gallery_item);
    gallery_item_clickable.setAttribute("onclick", "openPopup('"+i+"')")

    masonry.appendChild(gallery_item_clickable);
  }
}


function GetGalleryArtwork() {
  if (navigator.userAgent.toLowerCase().match(/mobile/i)) {
    isMobile = true;
  }
  var URL = "https://api.airtable.com/v0/appuP9OTzrZddTXhS/Gallery?maxRecords=3000&view=Grid%20view";
  $.ajax({
    url: URL,
    method: "GET",
    headers: {
      "Authorization": "Bearer keyoUrm3zh2wSp0gO"
    },
    success: function (result) {
      var updated_gallery_art = {};
      // "title": "title lorem",
      // "artist": "artist lorem",
      // "amount": 5000,
      // "type": "Painting",
      // "dimensions": "20 x 28 in",
      // "location": "Mumbai",
      // "image": "https://dl.airtable.com/.attachments/ade0841f94c47827141ccb8bc5129b99/74676bee/d7kOge2B72t9.jpg"
      for (var i = 0; i < result["records"].length; i++) {
        var artwork = {};
        artwork["title"] = result["records"][i]["fields"]["Name"];
        artwork["artist"] = result["records"][i]["fields"]["Artist"];
        artwork["amount"] = result["records"][i]["fields"]["Donation Bracket"];
        artwork["dimensions"] = result["records"][i]["fields"]["Dimensions"];
        artwork["location"] = result["records"][i]["fields"]["Location"];
        artwork["img"] = result["records"][i]["fields"]["Art"][0]["url"];
        artwork["type"] = result["records"][i]["fields"]["Medium"];
        artwork["sold"] = result["records"][i]["fields"]["Sold"];
        artwork["description"] = result["records"][i]["fields"]["Description"];
        updated_gallery_art[i] = artwork;
      }
      
      gallery_art = updated_gallery_art;
      PopulateGalleryWithData();
    }
  }).catch(function (err) {
    console.log(err);
  });
}