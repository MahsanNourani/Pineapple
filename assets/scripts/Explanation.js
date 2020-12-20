var listItems;
var listItems1;
var listItems2;
var listItems3;

// To load explanation data from json files
function loadData(explanationsData, associationData) {
    loadExplanation(explanationsData);
    loadCharts(associationData, "#040d4e");
}

function changeIfNA (string, component) {
    if (string == "n/a")
        return "any " + component;     
    else 
        return string;
}

function loadExplanation (data) {
    // This if is added in Pineapple phase. If the explanations are not relevant, we won't show the detected combinations
    if (data.length == 0) {
        d3.select("#explanation-box").classed("d-none", true);
        return;
    }
    else
        d3.select("#explanation-box").classed("d-none", false);
    
    var detectedCombinationsDiv = d3.select("#detected-comb");
    
    detectedCombinationsDiv.selectAll("div")
        .data(data).enter()
        .append("div")
        .classed("row rounded detected-comb-list", true)
        .html(function(d) {
            var rank = "<b class='p-1 m-2'>" + d.approximation + ". </b>";
            var explanation = "<p class='p-1 m-2 border rounded detected-comb-item'>" + changeIfNA(d.action, "action") 
                            + " + " + changeIfNA(d.object, "object") + " + " + changeIfNA(d.location, "location") + ". </p>";
            return rank  + explanation;

        })
}

//to clear the prevous list before loading new list dor each question
function clear_list() {
    // d3.selectAll('.list-group-item').remove();
    d3.select("#detected-comb").html("");
    d3.select("#component-score-div").select(".card-body").html("");
    d3.selectAll('.explanation-options').remove();
}

