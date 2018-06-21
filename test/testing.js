if(window.localStorage){
    alert('OK!');
}else{
    alert('NO!');
}


// ========================================================================
// not used function

function openFile(){

    var xhr = new XMLHttpRequest();
    var url = chrome.extension.getURL('data/data.txt');
    // url = chrome.runtime.getURL('data/data.txt');
    alert(url);
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function()
    {
        // if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
        if(xhr.readyState == 4 && xhr.status == 200)
        {
            //... The content has been read in xhr.responseText
            console.log(xhr.responseText);
            // alert(arr);
        }
    };

    xhr.send();
}

// not functional
function capture() {
    alert("get here");
    html2canvas($("body"), {
        onrendered: function(canvas) {
            alert("get in");
            var imgString = canvas.toDataURL("image/png");
            window.open(imgString);
        }
    });
}


// Saves options to chrome.storage
function save_options() {
    var color = document.getElementById('color').value;
    var likesColor = document.getElementById('like').checked;
    chrome.storage.sync.set({
        favoriteColor: color,
        likesColor: likesColor
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        favoriteColor: 'red',
        likesColor: true
    }, function(items) {
        document.getElementById('color').value = items.favoriteColor;
        document.getElementById('like').checked = items.likesColor;
    });
}

