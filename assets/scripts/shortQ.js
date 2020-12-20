$(document).ready(function () {
    var condition = localStorage.getItem("condition");

    if (condition == 4) /*no video segment*/ {
        // d3.select("#video-segment").style("display", "none");
        d3.select("#video-segment").remove();
    }
    else if (condition == 3) {
        d3.select("#video-segment").remove();
        d3.select("#detected-combinations").remove();
        d3.select("#component-scores").remove();
    }
    else if (condition == 5) /*no component scores*/ {
        // d3.select("#detected-combinations").style("display", "none");
        // d3.select("#component-scores").style("display", "none");

        d3.select("#detected-combinations").remove();
        d3.select("#component-scores").remove();
    }
});

function continueToPredictionTask() {
    var responsesShortQ = {};
        responsesShortQ.seg = {};
            responsesShortQ.seg.help = getValueOfSelected("#video-segment-help");
            responsesShortQ.seg.use = getValueOfSelected("#video-segment-use");
        responsesShortQ.comb = {};
            responsesShortQ.comb.help = getValueOfSelected("#detected-combinations-help");
            responsesShortQ.comb.use = getValueOfSelected("#detected-combinations-use");
        responsesShortQ.score = {};
            responsesShortQ.score.help = getValueOfSelected("#component-scores-help");
            responsesShortQ.score.use = getValueOfSelected("#component-scores-use");
        responsesShortQ.ans = {};
            responsesShortQ.ans.help = getValueOfSelected("#computer-answer-help");
            responsesShortQ.ans.use = getValueOfSelected("#computer-answer-use");
        responsesShortQ.vid = {};
            responsesShortQ.vid.help = getValueOfSelected("#video-player-help");
            responsesShortQ.vid.use = getValueOfSelected("#video-player-use");

    localStorage.setItem("shortQ", JSON.stringify(responsesShortQ));
    // location.href = "./prediction-task.html";
    location.href ="./Tutorial.html";
}

function radioChange() {
    if (isOptionSelected("#video-segment-help") && isOptionSelected("#video-segment-use") &&
        isOptionSelected("#detected-combinations-help") && isOptionSelected("#detected-combinations-use") &&
        isOptionSelected("#component-scores-help") && isOptionSelected("#component-scores-use"))
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

function getValueOfSelected(id) {
    var value = -100;
    if (d3.select(id).empty())
        return value;
    d3.select(id)
        .selectAll("input")
        .each(function (d) {
            if (d3.select(this).node().checked) {
                value = d3.select(this).attr("value");
            }
        });
    return value;
}