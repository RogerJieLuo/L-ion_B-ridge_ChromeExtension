// chrome.storage.local.get(function(result) {console.log(result);});
var data_key = "data";

$( document ).ready(function() {
    // removeData();
    // chStorage2("Type B", "2", "title A");
    // click();
    chStorage(data_key, 1, "title a", "type a")
});

function click(){
    $("form #ewok-task-form").submit( function () {
        var key = data_key;
        var score_str = $(".ewok-rater-header-section .ewok-task-action-header .ewok-estimated-task-weight").text();
        var type_str = $(".ewok-rater-header-section ul li:nth-child(2)");
        var title_str = "Temp title";
        var score = $.trim(score_str.replace(/minutes|minute/gi,""));
        var title = $("form .ewok-task-query").text();
        alert(title);
        var type = $.trim(type_str);
        // console.log("A"+" "+score+" "+title+" ");
        chStorage(key, score, title, type);
        // chStorage2(type, score, title);
    });
}

function chStorage2(type, score, title) {
    var type_json;

    // check if key exist in the chrome local storage
    var key = data_key;
    chrome.storage.local.get(key, function(result) {
        var obj={};
        var json = result[key];
        if(typeof json === 'undefined'){
            // if key is not found
            lblog("key is not found");
            type_json = createNewType(type, score, 1, title);
        }else {
            var type_exist = false;
            var score_exist = false;
            type_json = JSON.parse(json);

            // loop all the types pair
            $.each(type_json, function(keyType, value) {
                if(keyType === type){
                    type_exist = true;
                    var score_json = type_json[keyType];

                    // loop all the scores pair in each type
                    $.each(score_json, function(key, value){
                        if(key === score){
                            // update exist score
                            lblog("update");
                            score_exist = true;
                            updateScore(score_json, score, title);
                            return false;
                        }
                    });

                    // if score doesn't exist in the current json, add new score
                    if(!score_exist){
                        //add new score
                        lblog("add new score");
                        addNewScore(score_json, score, 1, title);
                        return false;
                    }
                }

            });

            // if type doesn't exist in the json, add new type
            if(!type_exist){
                // add new type
                lblog("add new type");
                addNewType(type, score, 1, title, type_json);
                // lblog(type_json);
            }

        }

        // save the json into a obj
        obj[key] = JSON.stringify(type_json);

        // store the obj into chrome storage local
        chrome.storage.local.set(obj, function(){
            lblog(JSON.parse(obj[key]));
            console.log("set successfully."+" "+score + " "+title);
        });
    });
}

function createNewType(type, score, count, title) {
    var type_json = {};
    var score_json = {};
    var item = {};
    var tasks_list = [];
    tasks_list.push(title);
    // create item json
    item.count = count;
    item.task = tasks_list;
    // push item into score json
    score_json[score] = item;
    // push score into type json
    type_json[type] = score_json;

    return type_json;
}

function addNewType(type, score, count, title, type_json){
    // var type_json = {};
    var score_json = {};
    var item = {};
    var tasks_list = [];
    tasks_list.push(title);
    // create item json
    item.count = count;
    item.task = tasks_list;
    // push item into score json
    score_json[score] = item;
    // push score into type json
    type_json[type] = score_json;

}

function addNewScore(score_json, score, count,  title) {
    var item = {};
    var tasks_list = [];
    tasks_list.push(title);
    item.count = count;
    // item.type = type;
    item.task = tasks_list;
    score_json[score] = item;
}

function updateScore(score_json, score, title) {
    var item = score_json[score];
    item.count++;
    item.task.push(title);
}

function lblog(str) {
    console.log(str);
}

// initial set
function chStorage(key, score, title, type){
    var jsonObj;

    chrome.storage.local.get(key, function(result) {
        var json = result[key];
        var obj = {};
        if(typeof json === 'undefined'){
            jsonObj = {"datalist":[]};
            var item = newType(score, 1, title, type);
            jsonObj.datalist.push(item);
            obj[key] = JSON.stringify(jsonObj);
        }else{
            var exist = false;
            var tasks_list = [];
            // score = 1.5;
            // title = "test B";
            jsonObj = JSON.parse(json);

            $.each(jsonObj.datalist, function(key, value) {
                var item = value;
                if(item.score == score && item.type === type){
                    exist = true;
                    tasks_list = item.task;
                    tasks_list.push(title);
                    item.count ++;
                    item.task = tasks_list;
                    return false;
                }
            });

            if(!exist){
                addFirst(jsonObj, score, 1, title, type);
            }
            obj[key] = JSON.stringify(jsonObj);
        }

        chrome.storage.local.set(obj, function(){
            console.log("set successfully."+" "+score + " "+title);
        });
    });

}

function newType(score, count, title, type){
    var item = {};
    var tasks_list = [];
    tasks_list.push(title);
    item.score = score;
    item.count = count;
    item.type = type;
    item.task = tasks_list;
    return item;
}

function addFirst(obj, score, count, title, type){
    var item = newType(score, count, title, type);
    obj.datalist.push(item);
    // update data
}

// function removeData() {
//     chrome.storage.local.remove(data_key, function(obj) {
//         var error = chrome.runtime.lastError;
//         if (error) {
//             console.error(error);
//         }
//     });
// }