$(document).ready(function () {
    load_table();
    storage_manage();
    clearAction();
});

var data_key = "data";
function load_table() {
    var key = data_key;
    var type_json;

    chrome.storage.local.get(key, function (result) {
        var str = '';
        var json = result[key];
        if(typeof json === 'undefined'){
            str = "No stored data.";
        }else {
            str = '<table>' +
                '   <tr>\n' +
                '        <th>Type</th>\n' +
                '        <th>Time</th>\n' +
                '        <th>Count</th>\n' +
                '        <th>Title</th>\n' +
                '        <th>Time Cal </th>\n' +
                '    </tr>';

            type_json = JSON.parse(json);
            $.each(type_json, function (keyType, value) {
                var format_count = 0;
                var total_time = 0.0;
                var score_json = type_json[keyType];
                str += '<tr><td>' + keyType + '</td>';

                $.each(score_json, function (key, value) {
                    var item = value;
                    var seg_time = item.count * key;
                    total_time += seg_time;
                    if(format_count > 0) {
                        str += '<tr>' +
                                '<td> </td>' +
                                '<td>' + key + '</td>' +
                                '<td>' + item.count + '</td>' +
                                '<td>' + item.task + '</td>' +
                                '<td>' + seg_time + '</td>' +
                                '</tr>';
                    } else {
                        str += '<td>' + key + '</td>' +
                            '<td>' + item.count + '</td>' +
                            '<td>' + item.task + '</td>' +
                            '<td>' + seg_time + '</td>' +
                            '</tr>';
                        format_count ++;
                    }

                });
                str += '<tr>' +
                    '<td> </td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td>Total: ' + total_time + '</td>' +
                    '</tr>';
            });

            str += '</table>';
            str += '<br/>';
        }
        $("#data_tabale").html(str);
    });
}



function storage_manage(){
    var key = data_key;
    var total = chrome.storage.local.QUOTA_BYTES;
    var str ="total(byte): "+ total +"<br/>";
    chrome.storage.local.getBytesInUse(key, function (used) {
        str += "used(byte): "+ used +"<br/>remain(byte): "+(total-used);
        $("#storage_manage").html(str);
    });
}

function clearAction() {
    $("#clearAction").click(function (e) {

        e.preventDefault();
        var answer=confirm('Do you want to delete?');
        if(answer){
            clearData();
            refreshPage();
        }
        else{
            $(this).dialog("close");
        }
    });
}

function clearData() {
    chrome.storage.local.remove(data_key, function(obj) {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
}

function refreshPage() {
    location.reload();
}