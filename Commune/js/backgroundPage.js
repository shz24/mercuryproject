// All DB operations should be handled here and then other pages can request as needed
var ba = chrome.browserAction;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.method == "setSmile"){
        ba.setTitle({
            title: "Support a small business!"
        });
        ba.setBadgeText({
            text: ':)'
        });
        ba.setBadgeBackgroundColor({
            color: "green"
        });
		sendResponse({});
	} else if (request.method == "setFrown") {
        ba.setTitle({
            title: "We couldn't find anything for this query"
        });
        ba.setBadgeText({
            text: ':('
        });
        ba.setBadgeBackgroundColor({
            color: "orange"
        });
		sendResponse({});
    }else
		sendResponse({}); // snub them.
});