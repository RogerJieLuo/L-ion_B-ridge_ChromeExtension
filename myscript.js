// chrome.storage.local.get(function(result) {console.log(result);});
var data_key = "lbdata";

$( document ).ready(function() {
    // $("#logo-icon-container").click(function(){

    // chStorage2("Type B", "2", "title B");
    // });
    // chStorage2("Type A", "1", "title A");
    click();
});

function click(){
    $("#ewok-task-form").submit( function (e) {
        var key = data_key;
        var score_str = $(".ewok-rater-header-section .ewok-task-action-header .ewok-estimated-task-weight").text();
        var type_str = $(".ewok-rater-header-section ul li:nth-child(2)");
        // var score_str = " 1.0 minutes";
        var type_str = "experimental";
        var score = $.trim(score_str.replace(/minutes|minute/gi,""));
        var title = $("form .ewok-task-query").text();
        var type = $.trim(type_str);
        console.log(type + " " + score + " "+ title + " ");
        // chStorage(key, score, title, type);
        chStorage2(type, score, title);
    });
}

function chStorage2(type, score, title) {
    var type_json = {};

    // check if key exist in the chrome local storage
    var key = data_key;

    chrome.storage.local.get([key], function(result) {
        var obj={};
        var json = result[key];

        if(typeof json === 'undefined'){
            // if key is not found
            lblog("key is not found");
            addNewType(type_json, type, score, 1, title);
            // lblog(type_json);
        } else {
            var type_exist = false;
            var score_exist = false;
            type_json = JSON.parse(json);

            // loop all the types pair
            $.each(type_json, function(keyType, value) {
                // check if the new type added in exist in the json
                if(keyType === type){
                    type_exist = true;
                    var score_array = value;

                    for(var i = 0; i < score_array.length; i++){
                        var score_item = score_array[i];
                        if(score_item.score == score){
                            lblog("update score");
                            score_exist = true;
                            updateScore(score_item, score, title);
                            return false;
                        }
                    }

                    if(!score_exist){
                        //add new score
                        lblog("new score");
                        addNewScore(score_array, score, 1, title);
                        return false;
                    }
                }
            });

            // if type doesn't exist in the json, add new type
            if(!type_exist){
                // add new type
                lblog("add new type");
                addNewType(type_json, type, score, 1, title);
            }
        }

        // save the json into a obj
        obj[key] = JSON.stringify(type_json);

        // store the obj into chrome storage local
        chrome.storage.local.set(obj, function(){
            // lblog(JSON.parse(obj[key]));
            lblog("set successfully."+" "+score + " "+title);
        });
        lblog("all " + obj[key]);
    });
}

function createNewType(type_json, type, score, count, title) {
    var score_array = [];

    addNewScore(score_array, score, count, title);

    type_json[type] = score_array;

}

function addNewType(type_json, type, score, count, title){
    var score_array = [];

    addNewScore(score_array, score, count, title);

    type_json[type] = score_array;

}

function addNewScore(score_array, score, count, title) {
    var score_item = {};
    var tasks_list = [];

    tasks_list.push(title);
    score_item.score = score;
    score_item.count = count;
    score_item.task = tasks_list;

    score_array.push(score_item);
}

function updateScore(score_item, score, title) {

    score_item.count++;
    score_item.task.push(title);

}

function lblog(str) {
    console.log(str);
}


/**

 { type1: [], type2: [], type3: [], ... }

 {
     type1:[                                         // -----> score_array
             {score: 1.0, count: 3, title: []},      // ----> score_item
             {score: 5.0, count: 2, title: []}
             ],
     type2:[
             {score: 1.0, count: 3, title: []},
             {score: 5.0, count: 2, title: []}
             ],
     ...
 }



 **/