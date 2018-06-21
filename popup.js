$( document ).ready(function() {
    $("#clearData").click(function () {
        clearData();
    });
});
var data_key = "data";
function clearData() {
    chrome.storage.local.remove(data_key, function(obj) {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
}