
/*
function continueToPredictionTask() {
    var responsesBackground = {};
        responsesBackground.age = getValueOfSelected("#age");
        responsesBackground.occupation = getValueOfSelected(("#occupation"));
        responsesBackground.gender = getValueOfSelected("#gender");
        responsesBackground.degree = getValueOfSelected(("#degree"));
        responsesBackground.blind = getValueOfSelected("#c-blind");
        responsesBackground.mlExp = getValueOfSelected("#ml-exp");

    localStorage.setItem("bgQ", JSON.stringify(responsesBackground));
    location.href ="./Tutorial.html";
}

function radioChange() {
    if (isOptionSelected("#ml-exp") && isOptionSelected("#c-blind") &&
        isOptionSelected("#degree") && isOptionSelected("#gender") &&
        !isInputEmpty("#age") && !isInputEmpty("#occupation"))
        d3.select("#next")
            .classed("disabled", false);
}

function isOptionSelected(id) {
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
    if (d3.select(id).node().value == "") {
        return true;
    }
    return false;
}

function getValueOfSelected(id) {
    var value = -100;
    if (d3.select(id).empty())
        return value;
    if (d3.select(id).attr("type") == "number" || d3.select(id).attr("type") == "text") {
        // window.alert("hello" + d3.select(id).attr("type"));
        return d3.select(id).node().value;
    }
    d3.select(id)
        .selectAll("input")
        .each(function (d) {
            if (d3.select(this).node().checked) {
                value = d3.select(this).attr("value");
            }
        });
    return value;
}*/

questionnaire = ["age", "gender", "degree", "mlFam", "cBl"];


function radioChange(item) {
    d3.select(item).classed("needs-to-be-filled", false);
}

function validateQuestionnaire() {
    var allChecked = true;
    for (var i = 0; i < questionnaire.length; i++) {
        if (!isOptionSelected("#" + questionnaire[i])) {
            allChecked = false;
            break;
        }
    }
    if (isInputEmpty("#major"))
        allChecked = false;
    return allChecked;
}

function isInputEmpty(id) {
    if (d3.select(id).empty())
        return false;
    if (d3.select(id).node().value == "") {
        return true;
    }
    return false;
}

function isOptionSelected(id) {
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

function toTutorial() {
    if(validateQuestionnaire()) {
        var backgroundQuestionnaire = getQuestionnaireValues(questionnaire);
        localStorage.setItem("bg", JSON.stringify(backgroundQuestionnaire));
        location.href = './Tutorial.html';
    }
    else {
        generateValidationFeedback(validateNotSelected(questionnaire));
        // $('[data-toggle="popover"]').popover();
    }
}

function generateValidationFeedback(listOfNotDone) {
    for (var i = 0; i < listOfNotDone.length; i++) {
        d3.select("#" + listOfNotDone[i]).classed("needs-to-be-filled", true);
    }
}

function validateNotSelected(dataset) {
    var listOfNotDone = [];
    for (var i = 0; i < dataset.length; i++) {
        if (!isOptionSelected("#" + dataset[i])) {
            listOfNotDone.push(dataset[i]);
        }

    }
    if (isInputEmpty("#major"))
        listOfNotDone.push("major");
    return listOfNotDone;
}

function getQuestionnaireValues(list) {
    var object = {};
    var item = 0;
    for (item; item < list.length; item++) {
        if (d3.select("#" + list[item]).empty())
            object[list[item]] = -100;
        else
            object[list[item]] = d3.select("#" + list[item]).select(".active").select("input").node().value;
    }
    object['major'] = d3.select("#major").node().value;

    return object;
}