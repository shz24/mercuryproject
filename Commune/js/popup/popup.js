// JS for the HTML popup page
var payloadAvail = false

function genCards(data){
    data.forEach(function (entry) {
        var card = $('<div class="card"></div>');
        var img = $('<img src="' + entry.image_url + '" class="card-img-top" alt="..."></img>');
        var cardBody = $('<div class="card-body"></div>');
        var title = $('<h5 class="card-title">' + entry.name + '</h5>');
        var text = $('<p class="card-text">' + entry.description + '</p>');
        var button = $('<a href="' + entry.url + '" class="btn btn-primary">$' + entry.price + ' Buy Me!</a>');
        card.append(img);
        card.append(cardBody);
        cardBody.append(title);
        cardBody.append(text);
        cardBody.append(button);

        button.click(function () {
            window.open(entry.url, '_blank')
        });

        $("#communeCardContainer").append(card);
    });
}

data = window.localStorage.getItem("cardData");

try {
    if (data.length > 0) {
        console.log("generating first time");
        console.log(JSON.parse(data));
        genCards(JSON.parse(data));

    };
} catch (error) {
    
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.method == "setCards"){
        console.log("message in");
        $(".card").remove();
        var data = request.key;
        console.log(data);
        genCards(data);
        window.localStorage.setItem("cardData", JSON.stringify(data));
        sendResponse({});
    } else if (request.method == "delCards"){
        var data = request.key;
        var cnt;
        data.forEach(function (entry) {
            $(".card").remove();
        });
        sendResponse({});
	} 
    
    else
		sendResponse({}); // snub them.
});
