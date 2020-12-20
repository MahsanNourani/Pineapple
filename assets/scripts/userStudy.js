// $(document).ready(function () {
//    var isLastPage = localStorage.getItem("isFin");
//    if (isLastPage == "1") {
//        createResultsInterface();
//    }
// });

function grantConsentToParticipate() {
    localStorage.clear();
    localStorage.setItem("start", getDateTime());
    localStorage.setItem("id", generateID());
    localStorage.setItem("condition", generateCondition());
    localStorage.setItem("type", getType());
}

function generateID() {
    var text = "";
    //"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    var possible = "abcdefghijklmnopqrstuvwxyz";
    var number = Math.floor(Math.random() * 10000);
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text+number;
}

// Condition link is useless! remove it
function generateCondition() {
    // return Math.floor(Math.random() * 6) + 1;
    var condition = getUrlVars()['cond'];
    if (condition == undefined)
        return Math.floor(Math.random() * 4);
    // if (condition == undefined) {
    //     var rand = Math.floor(Math.random() * 2);
    //     if (rand%2 == 1)
    //         return 2;
    //     else
    //         return 0;
    // }
    console.log(condition + " is the condition!");
    return condition;
}

function getType() {
    var type = getUrlVars()['type'];

    if (type == undefined)
        type = "none";

    type = type.charAt(0).toUpperCase() + type.slice(1);
    return type;
}
function showConsentForm() {
    var instructions = d3.select("#instructions");

    instructions.style("display","block");

    instructions.select("div")
        .style("margin-top","5px");

    d3.select("#main-container")
        .style("height","70%");

    instructions.select("p")
        .html("This is the consent form for the study which would give you details on the general task, risks, compensation, and contact details of" +
            " the people in case you had any questions. Please read it carefully, make sure you download a copy for yourself, and if you agree to" +
            " participate based on the conditions, click I AGREE TO PARTICIPATE and proceed.");

    d3.select("#instructions-btn")
        .html("I AGREE TO PARTICIPATE")
        .on("click", function (e) {
            // window.alert("THANKS!");
            grantConsentToParticipate();
            // showQuestionnaire();
            location.href = "./background.html";
        });

    var mainContainer = d3.select("#main-container");
    mainContainer.html("");

    mainContainer.append("embed")
        .attr("src", function (d) {
            return "assets/data/InformationSheet" + getType() + ".pdf";
        })
        .attr("width", "100%")
        .attr("height", "550px")
        .attr("type", "application/pdf");
}

function createResultsInterface() {
    var mainContainer = d3.select("#main-container");
    mainContainer.html("");

// <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSemXl6FL5G_Ri0Q93r0XyfENCN-ZUg0Vcp_5fmgusvvCLZfnA/viewform?embedded=true"
//     width="640" height="446" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>

    var textArea = mainContainer.append("div")
        .classed("container", true)
        .append("div")
        .classed("form-group", true);

    textArea.append("textarea")
        .classed("form-control selection", true)
        .attr("rows", "5")
        .html(function () {
            return prepareResults();
        });

    textArea.append("button")
        .classed("btn btn-default btn-block copy", true)
        .attr("type", "submit")
        .html("Copy Results to Clipboard <span><i class='fa fa-copy'></i></span>");

    document.ClipboardApi.setCopyButton('.copy','.selection');

    var googleForm = "https://docs.google.com/forms/d/e/1FAIpQLSemXl6FL5G_Ri0Q93r0XyfENCN-ZUg0Vcp_5fmgusvvCLZfnA/viewform?embedded=true";
    mainContainer.append("div").classed("container", true)
        .append("iframe")
        .attr("src", googleForm)
        .attr("width","640")
        .attr("height","446")
        .attr("frameborder", "0")
        .attr("marginheight", "0")
        .attr("marginwidth", "0")
        .html("loading...");

    var instructions = d3.select("#instructions");
    instructions.style("display", "block");
    instructions.style("padding", "20px");
    instructions.style("height", "auto");
    instructions.select("button").remove();
    instructions.select("p")
        .html("Thank you for participating in the study. Make sure you copy your results from below " +
            "and paste them in the required field in Amazon Mechanical Turk to receive your compensation." +
            "You can press the button below to automatically copy your results to the clipboard.");
    d3.select("#check").remove();
    localStorage.clear();
}

function prepareResults() {

    var results = {};

    results.cond = localStorage.getItem("condition");
    results.type = localStorage.getItem("type");
    results.id = localStorage.getItem("id");
    // results.bgDone = localStorage.getItem("backgroundDone");
    results.main = JSON.parse(localStorage.getItem("policyResponses"));
    // results.pred = JSON.parse(localStorage.getItem("responsesPredictionTask"));
    // results.ptDone = localStorage.getItem("postStudyDone");
    results.logs = JSON.parse(localStorage.getItem("logs"));
    // results.midQ = JSON.parse(localStorage.getItem("shortQ"));
    results.bgQ = JSON.parse(localStorage.getItem("bg"));
    results.conf = JSON.parse(localStorage.getItem("conf"));
    results.pred = JSON.parse(localStorage.getItem("pred"));
    results.elems = JSON.parse(localStorage.getItem("elems"));
    results.satis = JSON.parse(localStorage.getItem("satis"));
    // results.psQ = JSON.parse(localStorage.getItem("post"));
    // results.strt = localStorage.getItem("start");
    // results.end = getDateTime();
    results.mstrt = localStorage.getItem("mainStart");
    results.mend = localStorage.getItem("mainEnd");
    // results.predStart = localStorage.getItem("predStart");
    // results.predEnd = localStorage.getItem("predEnd");

    return JSON.stringify(results);

}

function backToTutorial() {
    location.href = "./Tutorial.html";
}

function continueToNextTask() {
    location.href = './complex.html'
    // if (localStorage.getItem("isPredictionTask") == "false") {
    //     localStorage.setItem("revStart", getDateTime());
    //     location.href = './machine.html';
    // }
    // else {
    //     localStorage.setItem("predStart", getDateTime());
    //     location.href = './prediction-task.html';
    // }
}

function getDateTime() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;
}

(function createClipboardAPI(document){
    /**
     * multi browser clipboard copy - ypetya@gmail.com
     * */
    document.ClipboardApi = new ClipboardApi();

    function ClipboardApi() {
        this.setCopyButton= function(selector, copyAreaSelector) {
            var copyBtn = document.querySelector(selector);

            copyBtn.addEventListener('click', function(event) {
                eventDispatcher( copyAreaSelector, 'copy');
            });
        }
    }

    /***
     * This function uses multiple methods for copying data to clipboard
     * 1. document.execCommand('copy') can be supported only for user initiated contexts
     *   - that means we can only determine it on the fly
     *   - d3 eventDispatch is not working this way
     * 2. ClipboardEvent constructor is only defined for Firefox (see MDN)
     *   - for FF, d3 selector uses input's value property instead of selection.text()
     * */
    function eventDispatcher( inputSelector, action) {
        var clipboardEl = document.querySelector(inputSelector);

        // Chrome
        if(document.queryCommandSupported && document.queryCommandSupported(action)) {
            clipboardEl.select();
            document.execCommand(action);
        } else {
            // FF
            var event = new ClipboardEvent(action)
            var text = clipboardEl.value;
            event.clipboardData.setData('text/plain', text);
            event.preventDefault();
            document.dispatchEvent(event);
        }

    };


}(window.document));


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
