var user_id = '';
var name = '';
var date = '';
var passedL1 = false;
var passedL2 = false;
var level_name = ''
var subject = 'Design Thinking';

window.addEventListener("load",function() {

    var id = getParam('id');
    console.log(id);

    if(id == null || id == ''){
        showDefaultPage();
    }else{
        getDataFromGAS(id);
    }
});

function getDataFromGAS(id) {

    $.ajax({
        type: 'GET',
        url: 'https://script.google.com/macros/s/AKfycbzMMT4E2xIrRTBRXUamGvnZced-KuE1TY3bSHXeTn_Hhgce6-o/exec?id='+id+'&callback=?',
        dataType: 'jsonp',
        jsonpCallback: 'jsondata',
        headers: {
            'Access-Control-Allow-Credentials' : true,
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'GET',
            'Access-Control-Allow-Headers':'application/json',
        }
        }).done(function(json){
            console.log(json);
            var len = json.length;

            for(var i=0; i < len; i++){
                var l = json[i].level;

                if(l == "L1"){
                    if(json[i].pass == 'pass'){
                        passedL1 = true;
                    }
                }else if(l == "L2"){
                    if(json[i].pass == 'pass'){
                        passedL2 = true;
                    }
                }
                if(name == ''){
                    name = json[i].fname + ' ' + json[i].lname;
                }
                if(date == ''){
                    d = new Date(json[i].date);
                    var options = { year:"numeric", month:"long", day:"numeric"};
                    date = d.toLocaleString("en-US", options);
                    date = date.toUpperCase();
                }
            }

            user_id = id;
            updatePage();
        }).fail(function(err) {
            console.log('ERROR')
            console.log(err)
        }).always(function() {
          console.log('complete');
        });
}

function getParam(name, url) {
    if (!url){
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),results = regex.exec(url);
    if (!results){
        return null;
    }
    if (!results[2]){
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function updatePage(){
    $('#user-name').html(name.toUpperCase());
    $(".published-date").each(function(i, elem) {
        $(elem).html(date);
    });

    $(".user-id").each(function(i, elem) {
        $(elem).html('CERTIFICATE ID: #'+user_id);
    });

    if(passedL1 && passedL2){
        level_name = 'Professional';
        $('#badge-img').html('<img src="assets/images/l2badge.png" alt="design certificate badge">');
        $('#certificate-level').html('(PROFESSIONAL LEVEL)');
        $('.body-container').addClass('background-pro');
        updateSNSlinks(true);

    }else if(passedL1 && !passedL2){
        level_name = 'Associate';
        $('#badge-img').html('<img src="assets/images/l1badge.png" alt="design certificate badge">');
        $('#certificate-level').html('(ASSOCIATE LEVEL)');
        $('.body-container').addClass('background-asso');
        updateSNSlinks(true);

    }else{
        // TODO
        showDefaultPage();
        return;
    }

//        $(".meta-desc").each(function(i, elem) {
//            var metaDesc = 'I have obtained '+level_name+' level certificate in '+subject+'. Global Design Certificate shows the recipient’s capabilities in design.';
//            $(elem).attr('content',metaDesc);
//        });


    $('#mainContents').removeClass('no-display');
    $('.loading').addClass('no-display');
}

function showDefaultPage(){
    $('#defaultContents').removeClass('no-display');
    $('.loading').addClass('no-display');
    updateSNSlinks(false);
}


function updateSNSlinks(isPassed){

    url = 'https://certificate.designskills.org/';
    if(isPassed){
        url = location.href;
    }
    console.log(url);

    fblink = "https://www.facebook.com/sharer.php?u=" + url;
    twlink = "https://twitter.com/intent/tweet?url=" + url + "%2F&text=Design%20Certificate";
    lilink = "https://www.linkedin.com/cws/share?url=" + url;

    $(".fb-link").attr("href", fblink);
    $(".tw-link").attr("href", twlink);
    $(".li-link").attr("href", lilink);
}