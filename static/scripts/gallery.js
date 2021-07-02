var firstLoad = true;

function getDescDiv(line1, line2, line3, line4, imgIndex = -1) {
    var descDiv = document.createElement("div");
    descDiv.setAttribute("class", "image-desc");

    var h3 = document.createElement("h3");
    h3.innerHTML = "<b>" + line1 + "</b>";
    descDiv.appendChild(h3);

    var p1 = document.createElement("p");
    p1.innerText = line2;
    descDiv.appendChild(p1);

    var p2 = document.createElement("p");
    p2.innerText = line3;
    descDiv.appendChild(p2);

    var p3 = document.createElement("p");
    p3.innerText = line4;
    descDiv.appendChild(p3);

    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "buybutton");

    if (imgIndex == -1) {
        button.setAttribute("onclick", "showForm()");
    }
    else {
        button.setAttribute("onclick", "showMobileForm(" + imgIndex.toString() + ")");
    }

    button.innerHTML = "<img class=\"cart\" src=\"/static/images/cart.svg\" /> Place Order";

    descDiv.appendChild(button);
    return descDiv;
}

function selectImage(element) {
    var src = element.getAttribute("src");

    var currentSelected = document.getElementsByClassName("selected")[0];
    if (currentSelected != undefined)
    {
        currentSelected.classList.remove("selected");
    }

    var descDiv = getDescDiv(element.getAttribute("name") + " - " + element.getAttribute("artist"),
        element.getAttribute("medium") + ", " + element.getAttribute("dimensions"),
        element.getAttribute("location"),
        "Minimum donation amount: Rs. " + element.getAttribute("price")
    );

    var parent = document.getElementById("galleryContent");
    var existingDesc = document.getElementsByClassName("image-desc");

    for (var i = 0; i < existingDesc.length; i++) {
        parent.removeChild(existingDesc[i]);
    }

    parent.appendChild(descDiv);
    var fullImg = document.getElementsByClassName("full-size-img")[0];
    if (fullImg != undefined) {
        parent.removeChild(fullImg);
    }

    fullImg = document.createElement("img");
    fullImg.setAttribute("class", "full-size-img");
    fullImg.setAttribute("src", src)

    parent.appendChild(fullImg);

    $(".image-desc").css("margin-bottom", "10px");
    element.parentElement.classList.add("selected");
    selected_index = parseInt(element.getAttribute("index"));
}

function closeForm() {
    document.getElementById("buyform").style.display = "none";
    if (!firstLoad) {
        document.getElementsByClassName("blur")[0].classList.remove("blur");
    }
}

function verifyAndBuy() {
    var email = document.getElementById("email").value;
    var artwork = gallery_art[selected_index];
    var name = document.getElementById("fullname").value;
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
        Body: name + " would like to make a donation for this artwork \n" + artwork["name"] + " by " + artwork["artist"] + "\nReach out to them on " + email,
    })
        .then(function (message) {
            alert("Thank you! Our team will get in touch with you over email to collect reciept and work out shipping details");
            closeForm();
        });
}

function showForm() {
    document.getElementById("buyform").style.display = "inline-block";
    document.getElementById("top").classList.add("blur");
    var line = gallery_art[selected_index]["name"] + " - " + gallery_art[selected_index]["artist"];
    document.getElementById("artwork").value = line;
}

function showMobileForm(index) {
    document.getElementById("buyform").style.display = "inline-block";
    document.getElementById("top").classList.add("blur");
    var line = gallery_art[index]["name"] + " - " + gallery_art[index]["artist"];
    document.getElementById("artwork").value = line;
}

var gallery_art = [];
var gallery_dom = [];
var current_thumbnail_start = 0;
var selected_index = 0;

function GetGalleryDomElements() {
    var new_gallery_dom = [];
    for (var i = 0; i < gallery_art.length; i++) {
        var art = gallery_art[i];

        if (!art["sold"]) {
            var div = document.createElement("div");
            div.setAttribute("id", art["name"] + "_" + art["artist"]);
            div.setAttribute("class", "gallery");

            var gallery_img = document.createElement("img");
            gallery_img.setAttribute("src", art["img_url"]);
            gallery_img.setAttribute("onclick", "selectImage(this)");
            gallery_img.setAttribute("name", art["name"]);
            gallery_img.setAttribute("artist", art["artist"]);
            gallery_img.setAttribute("dimensions", art["dimensions"]);
            gallery_img.setAttribute("medium", art["medium"]);
            gallery_img.setAttribute("location", art["location"]);
            gallery_img.setAttribute("price", art["price"]);
            gallery_img.setAttribute("index", i.toString());
            gallery_img.setAttribute("description", art["description"])
            gallery_img.setAttribute("class", "gallery-thumbnail");
            div.appendChild(gallery_img);
            new_gallery_dom.push(div);
        }
    }
    gallery_dom = new_gallery_dom;
}

var thumbnail_count = 5;

function ShowGalleryElementsMobile() {
    var parent = document.getElementById("galleryContent");
    for (var i = 0; i < gallery_art.length; i++) {
        var descDiv = getDescDiv(gallery_art[i]["name"] + " - " + gallery_art[i]["artist"],
            gallery_art[i]["medium"] + ", " + gallery_art[i]["dimensions"],
            gallery_art[i]["location"],
            "Minimum donation amount: Rs. " + gallery_art[i]["price"],
            i
        );

        var gallery_img = document.createElement("img");
        gallery_img.setAttribute("src", gallery_art[i]["img_url"]);
        gallery_img.setAttribute("index", i.toString());
        gallery_img.setAttribute("class", "full-size-img");

        if (!gallery_art[i]["sold"]) {
            parent.appendChild(gallery_img);
            parent.appendChild(descDiv);
        }

        $('.image-desc').css("margin-bottom", "50px");
        $("#galleryContent").css("margin-top", "-70px");
    }

}

function ShowGalleryElements() {
    $("#logo").css("padding-bottom", "10px")
    var left_div = document.createElement("div");
    left_div.setAttribute("id", "leftarrow");
    left_div.setAttribute("class", "gallery arrow");
    left_div.setAttribute("onclick", "goLeft()");

    var left_arrow_img = document.createElement("img");
    left_arrow_img.setAttribute("src", "/static/images/left.png");
    left_arrow_img.setAttribute("class", "arrowImages");

    left_div.appendChild(left_arrow_img);

    var right_div = document.createElement("div");
    right_div.setAttribute("id", "rightarrow");
    right_div.setAttribute("class", "gallery arrow");
    right_div.setAttribute("onclick", "goRight()");

    var right_arrow_img = document.createElement("img");
    right_arrow_img.setAttribute("src", "/static/images/right.png");
    right_arrow_img.setAttribute("class", "arrowImages");

    right_div.appendChild(right_arrow_img);

    var p1 = document.createElement("p");
    var p2 = document.createElement("p");
    var dummy1 = document.createElement("div");
    dummy1.setAttribute("class", "dummy");
    dummy1.appendChild(p1);
    var w = ((thumbnail_count - gallery_dom.length) * 10).toString() + "%";
    dummy1.style.width = w;

    var dummy2 = document.createElement("div");
    dummy2.setAttribute("class", "dummy");
    dummy2.appendChild(p2);
    var w = ((thumbnail_count - gallery_dom.length) * 10).toString() + "%";
    dummy2.style.width = w;

    if (current_thumbnail_start + thumbnail_count > gallery_dom.length && gallery_dom.length > thumbnail_count) {
        current_thumbnail_start = gallery_dom.length - thumbnail_count
    }
    var elem = document.getElementById("gallery_thumbnail_list");
    elem.innerHTML = "";

    if (current_thumbnail_start != 0) {
        elem.appendChild(left_div);
    }
    if (thumbnail_count > gallery_dom.length) {
        elem.appendChild(dummy1);
    }

    for (i = current_thumbnail_start; i < (current_thumbnail_start + thumbnail_count) && i < gallery_dom.length; i++) {
        elem.appendChild(gallery_dom[i]);
    }

    if (thumbnail_count > gallery_dom.length) {
        elem.appendChild(dummy2);
    }
    if (current_thumbnail_start + thumbnail_count < gallery_dom.length) {
        elem.appendChild(right_div);
    }

    if (selected_index < current_thumbnail_start || selected_index >= current_thumbnail_start + thumbnail_count) {
        selected_index = current_thumbnail_start;
    }
    selectImage(gallery_dom[selected_index].children[0]);
}

function goRight() {
    current_thumbnail_start += thumbnail_count;
    ShowGalleryElements();
}

function goLeft() {
    if (current_thumbnail_start - thumbnail_count < 0) {
        current_thumbnail_start = 0;
    }
    else {
        current_thumbnail_start -= 5;
    }
    ShowGalleryElements();
}

var isMobile = false;

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
            var updated_gallery_art = [];

            for (var i = 0; i < result["records"].length; i++) {
                var artwork = {};
                artwork["img_url"] = result["records"][i]["fields"]["Art"][0]["url"];
                artwork["name"] = result["records"][i]["fields"]["Name"];
                artwork["artist"] = result["records"][i]["fields"]["Artist"];
                artwork["dimensions"] = result["records"][i]["fields"]["Dimensions"];
                artwork["location"] = result["records"][i]["fields"]["Location"];
                artwork["medium"] = result["records"][i]["fields"]["Medium"];
                artwork["price"] = result["records"][i]["fields"]["Donation Bracket"];
                artwork["sold"] = result["records"][i]["fields"]["Sold"];
                artwork["description"] = result["records"][i]["fields"]["Description"];
                updated_gallery_art.push(artwork);
            }

            gallery_art = updated_gallery_art;
            if (isMobile) {
                ShowGalleryElementsMobile();
            }
            else {
                GetGalleryDomElements();
                ShowGalleryElements();
            }
            if (firstLoad) {
                firstLoad = false;
                document.getElementsByClassName("blur")[0].classList.remove("blur");
                document.getElementById("loader").style.display = "none";
            }
        }
    }).catch(function (err) {
        console.log(err);
    });
}