$(document).ready(function () {
    var condition = localStorage.getItem("condition");

    if (condition == 0 || condition == 1) /*baseline*/ {
        d3.selectAll(".with-exp").remove();
    }
    else {
        d3.selectAll(".only-without-exp").remove();
    }

});

var confidence = [
    {"item":"Cucumber", "id":"cucumber"},
    {"item":"Plate", "id":"plate"},
    {"item":"Carrot", "id":"carrot"},
    {"item":"Cut", "id":"cut"},
    {"item":"Onion", "id":"onion"},
    {"item":"Wash", "id":"wash"},
    {"item":"Pineapple", "id":"pineapple"},
    {"item":"Cutting Board", "id":"cuttingBoard"},
    {"item":"Pepper", "id":"pepper"}
];

var mentalModel = [
    {
        "query": "Cut + Carrot + Cutting board",
        "images": [
            {"src": "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_15840.jpg", "value":"1", "id":"1"},
            {"src": "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_17775.jpg", "value":"0", "id":"2"},
            {"src": "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_33255.jpg", "value":"0", "id":"3"},
            {"src": "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_52605.jpg", "value":"1", "id":"4"}
        ]
    },
    {
        "query": "Move + Pineapple + Any location",
        "images": [
            {"src": "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_57616.jpg", "value":"1", "id":"5"},
            {"src": "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_18916.jpg", "value":"1", "id":"6"},
            {"src": "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_5371.jpg", "value":"1", "id":"7"},
            {"src": "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_11176.jpg", "value":"1","id":"8"}
        ]
    },
    {
        "query": "Take out + Any object + Fridge",
        "images": [
            {"src": "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_7698.jpg", "value":"1", "id":"9"},
            {"src": "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_17373.jpg", "value":"1", "id":"10"},
            {"src": "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_5763.jpg", "value":"0", "id":"11"},
            {"src": "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_32853.jpg", "value":"1", "id":"12"}
        ]
    }
];



var satisfaction = [
    {
        "query": "The system was easy to use and understand.",
        "class": "without-exp"
    },
    {
        "query": "The task was easy to understand.",
        "class": "without-exp"
    },
    {
        "query": "The explanations of how the system works seem complete.",
        "class": "with-exp"
    },
    {
        "query": "The explanations of how the system works seem satisfying.",
        "class": "with-exp"
    },
    {
        "query": "The explanations of how the system works are useful to answer each policy.",
        "class": "with-exp"
    }
];

var usage = [
    {"image": "video.png", "class": "without-exp", "element": "video"},
    {"image": "thumbnails-noX.png", "class": "only-without-exp", "element": "video thumbnails"},
    {"image": "thumbnails-X.png", "class": "with-exp", "element": "video thumbnails"},
    {"image": "segments.png", "class": "with-exp", "element": "video segments"},
    {"image": "combination.png", "class": "with-exp", "element": "combination of components"},
    {"image": "component.png", "class": "with-exp", "element": "component scores"}

]

var likertUsage = ["Never", "Rarely", "Sometimes", "Frequently", "Every Time"];
var likertHelpful = ["Very Unhelpful", "Unhelpful", "Neutral", "Helpful", "Very Helpful"];
var likertSatisfaction = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

(function () {

//************************************* Interface for COM_ACC.HTML *************************************

    var percentageDiv = d3.select("#conf-perc-div");
    var percentItem = percentageDiv.selectAll("div")
        .data(confidence).enter()
        .append("div")
        .classed("bg-white mb-2 border rounded", true);
    percentItem.append("label")
        .classed("mr-3 label-for-slider col-md-2", true)
        .attr("for", function (d) {
            return d.id;
        })
        .html(function (d) {
            return d.item;
        });
    percentItem.append("input")
        .classed("custom-range my-slider col-md-6 p-2 rounded", true)
        .attr("id", function (d) {
            return d.id;
        })
        .attr("type", "range")
        .attr("min", "0")
        .attr("max", "100")
        .attr("value", "0")
        .on("input", function () {
            d3.select(this.parentNode).select('output').html(this.value + '%');
            d3.select(this).classed("needs-to-be-filled", false);
        });
        // .on("input", function (d) {
        //     d3.select(this.parentNode).select('output').html(this.value + '%');
        //     validateAccuracyQuestion(undefined);
        // });
    percentItem.append("output")
        .classed("mr-3 label-for-slider col-md-1", true)
        .attr("for", function (d) {
            return d.id;
        })
        .attr("id", function (d) {
            return d.id + "-out";
        })
        .html("????");
    var confidenceLevel = percentItem.append("div")
        .classed("col-md-2 btn-group btn-group-toggle float btn-group-padding m-2 p-2 rounded", true)
        .attr("id", function (d) {
            return d.id + "-conf";
        })
        .attr("data-toggle", "buttons")
        .on("click", function () {
            d3.select(this).classed("needs-to-be-filled", false);
        });
        // .on("click", function () {
        //     var id = d3.select(this).attr("id");
        //     validateAccuracyQuestion(id);
        // });
    confidenceLevel.append("label")
        .classed("btn btn-warning mr-3 rounded", true)
        .html("Low<input type=\"radio\" value=\"0\">");
    confidenceLevel.append("label")
        .classed("btn btn-warning rounded", true)
        .html("High<input type=\"radio\" value=\"1\">");



//************************************* Interface for FRAMES.HTML *************************************

    var mentalModelDiv = d3.select("#mental-model-div");

    var mentalModelQuestions = mentalModelDiv.selectAll("div")
        .data(mentalModel).enter()
        .append("div")
        .classed("col-md-12 p-2 bg-light border rounded mb-4", true);
    mentalModelQuestions.append("div")
        .classed("col-md-8 offset-md-2 border rounded p-1 vertical-align-center bg-primary mm-query mb-2 mt-4", true)
        .html(function (d) {
            return "<b>Query:</b>&nbsp" + d.query;
        });

    var mentalModelCards = mentalModelQuestions.append("div")
        .classed("card-deck mb-2", true)
        .selectAll("div")
        .data(function (d) {
            return d.images;
        }).enter()
        .append("div")
        .classed("card", true);
    mentalModelCards.append("img")
        .classed("card-img-top", true)
        .attr("alt", "Could Not Load the Image.")
        .attr("src", function (d) {
            return d.src;
        });
    var cardBody = mentalModelCards.append("div")
        .classed("card-body", true);

    var ansRow = cardBody.append("div")
        .classed("row p-0 mb-4", true);
    ansRow.append("div")
        .classed("col-md-4 p-0 vertical-align-center", true)
        .html("System would:");
    var cardAns = ansRow.append("div")
        .classed("col-md-8 btn-group btn-group-toggle float btn-group-padding vertical-align-center rounded p-2", true)
        .attr("id", function (d) {
            return "mm" + d.id;
        })
        .attr("data-toggle", "buttons")
        .on("click", function () {
            d3.select(this).classed("needs-to-be-filled", false);
        });
        // .on("click", function () {
        //     validatePredictionScores();
        // });
    cardAns.append("label")
        .classed("btn btn-info mr-2 rounded col-md-6 p-1 pt-2 pb-2", true)
        .html("Not match<input type=\"radio\" value=\"0\">");
    cardAns.append("label")
        .classed("btn btn-info rounded col-md-6 p-1 pt-2 pb-2", true)
        .html("Match<input type=\"radio\" value=\"1\">");

    var confRow = cardBody.append("div")
        .classed("row p-0 mb-4", true);
    confRow.append("div")
        .classed("col-md-4 p-0 vertical-align-center", true)
        .html("Your confidence:");
    var cardConf = confRow.append("div")
        .classed("col-md-8 btn-group btn-group-toggle float btn-group-padding vertical-align-center rounded p-2", true)
        .attr("id", function (d) {
            return "mm" + d.id + "-conf";
        })
        .attr("data-toggle", "buttons")
        .on("click", function () {
            d3.select(this).classed("needs-to-be-filled", false);
        });
        // .on("click", function () {
        //     validatePredictionScores();
        // });
    cardConf.append("label")
        .classed("btn btn-warning mr-2 rounded col-md-6", true)
        .html("Low<input type=\"radio\" value=\"0\">");
    cardConf.append("label")
        .classed("btn btn-warning rounded col-md-6", true)
        .html("High<input type=\"radio\" value=\"1\">");




//************************************* Interface for ELEMENTS.HTML *************************************

    var usageItems = d3.select("#usage-div")
        .selectAll("div")
        .data(usage).enter()
        .append("div")
        .attr("class", function (d) {
            return "row mb-4 bg-white p-3 rounded"  + " " + d.class;
        });
    usageItems.append("div")
        .classed("col-md-4", true)
        .append("img")
        .classed("col-md-12 img-thumbnail", true)
        .attr("src", function (d) {
           return "assets/images/" + d.image;
        });
    var usageQuestions = usageItems.append("div")
        .classed("col-md-8", true);

//-------> Question 1: How much did you use this element?

    var usefulQ = usageQuestions.append("div")
        .classed("row col-md-12 mb-4", true);
    usefulQ.append("div")
        .classed("col-md-12 shortq-questions mb-1", true)
        .append("h")
        .classed("question-post-study", true)
        .html(function (d) {
            return "How much did you use the <u>" + d.element + "</u>?"
        });
    var usefulGroupBtn = usefulQ.append("div")
        .classed("col-md-12 btn-group btn-group-toggle float btn-group-padding p-2 rounded", true)
        .attr("id", function (d, i) {
            return "use" + i;
        })
        .attr("data-toggle", "buttons")
        .on("click", function () {
            d3.select(this).classed("needs-to-be-filled", false);
        });
        // .on("click", function () {
        //     validateUsage(d3.select(this).attr("id"), "use");
        // });
    var button = usefulGroupBtn.selectAll("label")
        .data(likertUsage).enter()
        .append("label")
        .classed("btn btn-warning rounded mr-2 col-md-2", true);

    button.append("text")
        .text(function (d) {
            return d;
        });
    button.append("input")
        .attr("type", "radio")
        .attr("value", function (d,i) {
            return i-2;
        });

//-------> Question 2: How useful did you find this element?

    var helpfulQ = usageQuestions.append("div")
        .classed("row col-md-12", true);
    helpfulQ.append("div")
        .classed("col-md-12 shortq-questions mb-1", true)
        .append("h")
        .classed("question-post-study", true)
        .html(function (d) {
            return "How helpful did you find the <u>" + d.element + "</u>?"
        });
    var helpfulGroupBtn = helpfulQ.append("div")
        .classed("col-md-12 btn-group btn-group-toggle float btn-group-padding p-2 rounded", true)
        .attr("id", function (d, i) {
            return "help" + i;
        })
        .attr("data-toggle", "buttons")
        .on("click", function () {
            d3.select(this).classed("needs-to-be-filled", false);
        });
        // .on("click", function () {
        //     validateUsage(d3.select(this).attr("id"), "help");
        // });
    var button = helpfulGroupBtn.selectAll("label")
        .data(likertHelpful).enter()
        .append("label")
        .classed("btn btn-warning rounded mr-2 col-md-2", true);

    button.append("text")
        .text(function (d) {
            return d;
        });
    button.append("input")
        .attr("type", "radio")
        .attr("value", function (d,i) {
            return i-2;
        });



//************************************* Interface for SATISFACTION.HTML *************************************

    var satisfactionItems = d3.select("#satisfaction-div")
        .selectAll("div")
        .data(satisfaction).enter()
        .append("div")
        .attr("class", function (d) {
            return "row bg-white mb-2 p-3 mr-0 ml-0 border rounded " + d.class;
        });
    satisfactionItems.append("div")
        .classed("col-md-12 shortq-questions mb-3", true)
        .append("h")
        .classed("question-post-study", true)
        .html(function (d) {
            return d.query;
        });
    var likertButtonGroup = satisfactionItems.append("div")
        .classed("col-md-12 btn-group btn-group-toggle float btn-group-padding rounded p-2", true)
        .attr("id", function (d, i) {
            return "sat" + i;
        })
        .attr("data-toggle", "buttons")
        .on("click", function () {
            d3.select(this).classed("needs-to-be-filled", false);
        });
        // .on("click", function () {
        //     validateSatisfaction(d3.select(this).attr("id"));
        // });
    var button = likertButtonGroup.selectAll("label")
        .data(likertSatisfaction).enter()
        .append("label")
        .classed("btn btn-warning rounded mr-2", true);

    button.append("text")
        .text(function (d) {
            return d;
        });
    button.append("input")
        .attr("type", "radio")
        .attr("value", function (d,i) {
            return i-2;
        })
})();

function continueToLastPage() {
    var responsesPost = {};
    responsesPost.affect = getValueOfSelected("#affect");
    responsesPost.cmnt = getValueOfSelected("#cmnt");
    responsesPost.conf = getConfidenceScores();
    responsesPost.sat = getSatisfactionMeasures();
    responsesPost.elem = getElementsObject();
    responsesPost.mm = getMentalModelObject();
    // responsesPost.pol = d3.select("#policyEval").select(".active").select("input").node().value;
    responsesPost.polExp = getValueOfSelected("#policy-exp");
    // responsesPost.agdis = [];
    // for (var i = 1; i <= 17; i++ ) {
    //     var resp = {};
    //     resp.id = "q"+i;
    //     resp.resp = getValueOfSelected("#" + resp.id);
    //     responsesPost.agdis.push(resp);
    // }
    localStorage.setItem("isFin", "1");
    localStorage.setItem("post", JSON.stringify(responsesPost));
    // location.href = "./index.html";
    location.href = './results.html';
    // location.href ="./Tutorial.html";
}

function radioChange() {
    var radioAllChecked = true;
    for (var i = 1; i <= 17; i++) {
        if (!isOptionSelected("#q" + i))
            radioAllChecked = false;
    }
    for (var i = 1; i < 5; i++) {
        if (!isOptionSelected("mm-" + 1))
            radioAllChecked = false;
    }

    if (radioAllChecked &&
        !isInputEmpty("#affect"))
        d3.select("#next")
            .attr("disabled", null);

    // if (!isInputEmpty("#affect"))
    //     d3.select("#next")
    //         .attr("disabled", null);
}

function isOptionSelected(id) {
    // var isChecked = false;
    // if (d3.select(id).empty())
    //     return true;
    // if (!d3.select(id).select(".active").empty())
    //     isChecked = true;
    // // d3.select(id)
    // //     .selectAll("input").each(function (d) {
    // //     if (d3.select(this).node().checked == true)
    // //         isChecked = true;
    // // });
    // return isChecked;

    var isChecked = false;
    if (d3.select(id).empty())
        return true;
    d3.select(id)
        .selectAll("input").each(function (d) {
        if (d3.select(this).node().checked == true)
            isChecked = true;
    });
    return isChecked;
}

function isInputEmpty(id) {
    if (d3.select(id).empty())
        return false;
    if (d3.select(id).node().value == "") {
        return true;
    }
    return false;
}

function getValueOfSelected(id) {
    var value = -100;
    if (d3.select(id).empty()) {
        return value;
    }
    if (d3.select(id).attr("type") == "number" || d3.select(id).attr("type") == "text" || d3.select(id).node().tagName =="TEXTAREA") {
        var value = d3.select(id).node().value;
        value = value.replace(/'/g, '*');
        value = value.replace(/"/g, '*');
        return value;
    }
    d3.select(id)
        .selectAll("input")
        .each(function (d) {
            if (d3.select(this).node().checked) {
                value = d3.select(this).attr("value");
            }
        });
    return value;
}

function getConfidenceScores() {
    var object = {};
    var objectArray = [];
    // var items = ["carrot", "cucumber", "beans", "onion", "parsley", "pepper", "pineapple", "potato"];
    for (var index = 0; index < confidence.length; index++) {
        object[confidence[index].item] = $('#' + confidence[index].id).val();
        object[confidence[index].id + "-conf"] = d3.select("#" + confidence[index].id + "-conf").select("label.active input").node().value;
        objectArray.push(object);
        object={};
    }

    return objectArray;
}

function getMentalModelObject () {
    var object = {};
    var allObjects = [];
    for (var i = 0; i < mentalModel.length; i++) {
        for(var j = 0; j < mentalModel[i].images.length; j++) {
            var imageId = mentalModel[i].images[j].id;
            object["mm" +  imageId] = d3.select("#mm" + imageId).select(".active").select("input").node().value;
            object["mm" + imageId + "-conf"] = d3.select("#mm" + imageId + "-conf").select(".active").select("input").node().value;
            allObjects.push(object);
            object={};
        }
    }
    return allObjects;
}

function getSatisfactionMeasures() {
    var object = {};
    for (var item = 0; item < satisfaction.length; item++) {
        if (d3.select("#sat" + item).empty())
            object["sat" + item] = -100;
        else
            object["sat" + item] = d3.select("#sat" + item).select(".active").select("input").node().value;
    }
    object.acc = getValueOfSelected("#accuracy");
    object.hard = getValueOfSelected("#hard");
    object.affect = getValueOfSelected("#affect");

    return object;
}

function getElementsObject() {
    var object = {};
    for (var item = 0; item < usage.length; item++) {
        if (d3.select("#use" + item).empty()) {
            object["use" + item] = -100;
            object["help" + item] = -100;
        }
        else {
            object["use" + item] = d3.select("#use" + item).select(".active").select("input").node().value;
            object["help" + item] = d3.select("#help" + item).select(".active").select("input").node().value;

        }
    }

    return object;
}


function validateAccuracyQuestion() {
    var allChecked = true;
    for (var i = 0; i < confidence.length; i++) {
        if (!isOptionSelected("#" + confidence[i].id + "-conf")) {
            allChecked = false;
            break;
        }
    }

    for (var i = 0; i < confidence.length; i++) {
        if (d3.selectAll("#" + confidence[i].id + "-out").html() == '????') {
            allChecked = false;
            break;
        }
    }
    return allChecked;
}

function validatePredictionScores() {
    var allChecked = true;
    for (var i = 0; i < mentalModel.length; i++) {
        for (var j = 0; j < mentalModel[i].images.length; j++) {
            if (!isOptionSelected("#mm" + mentalModel[i].images[j].id) && !isOptionSelected("#mm" + mentalModel[i].images[j].id + "-conf")) {
                allChecked = false;
                // return;
                break;
            }
        }
    }
    return allChecked;
    // if(allChecked == true)
    //     d3.select("#to-satisfaction").classed("disabled", false);
}



function validateSatisfaction() {
    var allChecked = true;
    for (var i = 0; i < satisfaction.length; i++) {
        if (!isOptionSelected("#sat" + i)) {
            allChecked = false;
            break;
        }
    }
    if (isInputEmpty("#affect") || isInputEmpty("#accuracy") || isInputEmpty("#hard"))
        allChecked = false;
    return allChecked;
}


function validateUsage() {
    var allChecked = true;
    for (var i = 0; i < usage.length; i++) {
        if (!isOptionSelected("#use" + i)) {
            allChecked = false;
            break;
        }
    }
    for (var i = 0; i < usage.length; i++) {
        if (!isOptionSelected("#help" + i)) {
            allChecked = false;
            break;
        }
    }

    return allChecked;
}

function validateMentalModelSelected() {
    var listOfNotDone = [];
    var size = 0;
    for (var i = 0; i < mentalModel.length; i++) {
        size += mentalModel[i].images.length;
    }
    console.log(size);
    for (var i = 1; i <= size; i++) {
        if (!isOptionSelected("#mm" + i)) {
            listOfNotDone.push("#mm" + i);
        }
        if (!isOptionSelected("#mm" + i + "-conf")) {
            listOfNotDone.push("#mm" + i + "-conf");
        }
    }

    return listOfNotDone;
}


function validateNotSelected(identifier, dataset) {
    // var identifier = ["#use", "#help"];
    var listOfNotDone = [];
    for (var id = 0; id < 2; id++) {
        for (var i = 0; i < dataset.length; i++) {
            if (!isOptionSelected(identifier[id] + i)) {
                listOfNotDone.push(identifier[id] + i);
            }
        }
    }
    return listOfNotDone;
}

function generateValidationFeedback(listOfNotDone) {
    for (var i = 0; i < listOfNotDone.length; i++) {
        d3.select(listOfNotDone[i]).classed("needs-to-be-filled", true);
    }
}


function generateValidationFeedbackConfidence() {
    for (var i = 0; i < confidence.length; i++) {
        if (!isOptionSelected("#" + confidence[i].id + "-conf"))
            d3.select("#" + confidence[i].id + "-conf").classed("needs-to-be-filled", true);
        if (d3.selectAll("#" + confidence[i].id + "-out").html() == '????')
            d3.select("#" + confidence[i].id).classed("needs-to-be-filled", true);
    }
}

function validateAndFeedbackTextArea() {
    var identifiers = ["#hard", "#affect", "#accuracy"];
    for (var i = 0; i < identifiers.length; i++) {
        if (isInputEmpty(identifiers[i]))
            d3.select(identifiers[i]).classed("needs-to-be-filled", true);
    }
}

function disableValidationForTextArea(id) {
    d3.select("#" + id).classed('needs-to-be-filled', false);
}

function saveConfidenceScores() {
    if(validateAccuracyQuestion()) {
        var postStudy = getConfidenceScores();
        localStorage.setItem("conf", JSON.stringify(postStudy));
        location.href = './frames.html';
    }
    else {
        generateValidationFeedbackConfidence();
        $('#confirm-modal').modal("show");
    }
}

function savePredictionScore() {
    if (validatePredictionScores()) {
        var postStudy = getMentalModelObject();
        localStorage.setItem("pred", JSON.stringify(postStudy));
        location.href = "./elements.html";
    }
    else {
        generateValidationFeedback(validateMentalModelSelected());
        $('#confirm-modal').modal("show");
    }
}

function saveSatisfaction() {
    if (validateSatisfaction()) {
        var postStudy = getSatisfactionMeasures();
        localStorage.setItem("satis", JSON.stringify(postStudy));
        localStorage.setItem("isFin", "1");
        // location.href = "./index.html";
        location.href = './results.html';
    }
    else {
        generateValidationFeedback(validateNotSelected(["#sat"], satisfaction));
        validateAndFeedbackTextArea();
        $('#confirm-modal').modal("show");
    }
}

function saveElementScores() {
    if (validateUsage()) {
        var postStudy = getElementsObject();
        localStorage.setItem("elems", JSON.stringify(postStudy));
        location.href = "./satisfaction.html";
    }
    else {
        generateValidationFeedback(validateNotSelected(["#use", "#help"], usage));
        $('#confirm-modal').modal("show");
    }
}




// function validateAccuracyQuestion(id) {
//     var allChecked = true;
//     for (var i = 0; i < confidence.length; i++) {
//         if (!isOptionSelected("#" + confidence[i].id + "-conf")) {
//             if (id != undefined && confidence[i].id + "-conf" == id)
//                 continue;
//             else
//                 allChecked = false;
//         }
//     }
//
//     for (var i = 0; i < confidence.length; i++) {
//         if (d3.selectAll("#" + confidence[i].id + "-out").html() == '????')
//             allChecked = false
//     }
//
//     if(allChecked == true)
//         d3.select("#to-frames").classed("disabled", false);
// }

// function validateSatisfaction(id) {
//     var allChecked = true;
//     for (var i = 0; i < satisfaction.length; i++) {
//         if (!isOptionSelected("#sat" + i)) {
//             if(id == "sat" + i)
//                 continue;
//             allChecked = false;
//             return;
//         }
//     }
//     if (isInputEmpty("#affect") || isInputEmpty("#accuracy") || isInputEmpty("#hard"))
//         allChecked = false;
//     if(allChecked == true)
//         d3.select("#to-end").classed("disabled", false);
// }

// function toggleIdForElements(identifier) {
//     if (identifier == "use")
//         return "help";
//     else
//         return "use";
// }

// function validateUsage(id, identifier) {
//     var allChecked = true;
//     for (var i = 0; i < usage.length; i++) {
//         if (!isOptionSelected("#" + identifier + i)) {
//             if(id == identifier + i)
//                 continue;
//             allChecked = false;
//             return;
//         }
//     }
//     var otherIdentifier = toggleIdForElements(identifier);
//     for (var i = 0; i < usage.length; i++) {
//         if (!isOptionSelected("#" + otherIdentifier + i)) {
//             allChecked = false;
//             return;
//         }
//     }
//
//     if(allChecked == true)
//         d3.select("#to-satisfaction").classed("disabled", false);
// }