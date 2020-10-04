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

function generateCards(data){

}

var currUrl = window.location.href;
console.log("CURR URL IS:", currUrl);
if ((currUrl.toLowerCase()).includes('dp')){
    var productTitle;
    var productPrice;
    var productImg;
    var productCategory;
    var userQuery;

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
            try {
                productPrice = document.getElementById("priceblock_saleprice").textContent.trim().split('$')[1];
            } catch (error) {
                console.log("We haven't found a price on this page. Sorry!")
            }
        }
    }

    try {
        productCategory = document.getElementById("nav-subnav").getAttribute("data-category");
    } catch (error) {
    }

    // console.log("cat is", productCategory);

    try {
        userQuery = document.getElementById("twotabsearchtextbox").value.trim();
    } catch (error) {
    }

    // console.log("query is", userQuery);

    // console.log("Product title is:", productTitle);
    // console.log("Product price is:", productPrice);

    payload = {name: productTitle, count: "10", price: productPrice, category:productCategory, query:userQuery}

    console.log("payload is", payload);

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
            if (result.length > 0){
                
                chrome.runtime.sendMessage({
                    method: 'setSmile',
                    key: 'key'
                }, function (response) {
                });

                console.log("sending cards....");
                chrome.runtime.sendMessage({
                    method: 'setCards',
                    key: result
                }, function (response) {
                });

                console.log("sent");
                
            } else {
                chrome.runtime.sendMessage({
                    method: 'setFrown',
                    key: 'key'
                }, function (response) {
                });

                console.log('deleting cards...')
                chrome.runtime.sendMessage({
                    method: 'delCards',
                    key: 'key'
                }, function (response) {
                });
            }

            console.log(result);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
            chrome.runtime.sendMessage({
                method: 'setFrown',
                key: 'key'
            }, function (response) {
            });
            chrome.runtime.sendMessage({
                method: 'delCards',
                key: 'key'
            }, function (response) {
            });
        }
    });    
}