// Javascript for the page context (Things such as scraping the page and sending data to the background to process) 
// This page reloads every time the URL changes. It is injected into every page visited. 

// - - - - - - - - - - - - - - - - - - - - - -
// Page Scraping for tite and price on webpage
// - - - - - - - - - - - - - - - - - - - - - -

console.log("New page!");
function getElement(first, second, third, isLink) {
	if (third != null) {
		var elem = document.getElementsByClassName(first)[0].getElementsByClassName(second)[0].getElementsByClassName(third)[0];
		if (isLink) return elem.getAttribute("href");
		else return elem.textContent.trim();
	} else if (second != null) {
		var elem = document.getElementsByClassName(first)[0].getElementsByClassName(second)[0];
		if (isLink) return elem.getAttribute("href");
		else return elem.textContent.trim();
	} else {
		var elem = document.getElementsByClassName(first)[0];
		if (isLink) return elem.getAttribute("href");
		else return elem.textContent.trim();
	}
}

var currUrl = window.location.href;
console.log("CURR URL IS:", currUrl);
if ((currUrl.toLowerCase()).includes('dp')){
    var productTitle;
    var productPrice;
    var productImg;

    // Finding title of product
    try {
        productTitle = document.getElementById("productTitle").textContent.trim();
    } catch (error) {
        console.log("There was no product found on this page ;(")
    }

    // Finding price
    try {
        productPrice = document.getElementById("priceblock_ourprice").textContent.trim().split('$')[1];
    } catch (error) {
        try {
            productPrice = document.getElementById("priceblock_dealprice").textContent.trim().split('$')[1];
        } catch (error) {
            console.log("We haven't found a price on this page. Sorry!")
        }
    }

    console.log("Product title is:", productTitle);
    console.log("Product price is:", productPrice);

    payload = {name: productTitle, url: currUrl, price: productPrice}

    jQuery.ajax({
        url: 'https://apytagnm.brev.dev/api/products',
        type: "POST",
        data: JSON.stringify(payload),
        dataType: "json",
        beforeSend: function(x) {
          if (x && x.overrideMimeType) {
            x.overrideMimeType("application/j-son;charset=UTF-8");
          }
        },
        success: function(result) {
            console.log(result);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });    
}