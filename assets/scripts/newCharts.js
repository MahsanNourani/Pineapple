var maxWidth = 80, height = "10px";
function loadCharts (associations, color) {
    d3.select("#component-score-div").select(".card-body").html("");
    // d3.select("#marginal-score").html("");
    var listOfData = [];
    if (associations.listOfAllDetectedAction !== undefined)
        listOfData = listOfData.concat(associations.listOfAllDetectedAction);
    if (associations.listOfAllDetectedAction !== undefined)
        listOfData = listOfData.concat(associations.listOfAllDetectedObject);
    if (associations.listOfAllDetectedAction !== undefined)
        listOfData = listOfData.concat(associations.listOfAllDetectedLocation);

    listOfData.sort(function(x, y){
        return d3.descending(x.probability, y.probability);
    });

    // console.log(listOfData);
    function isLowProbability (x) {
        if (x.probability < 0.1) //If the probability is above 40%, we say the object is found.
            return true;
        else return false;
    }
    var found = [], notFound = [];

    var lowProbabilityIndex = listOfData.findIndex(isLowProbability);
    if (lowProbabilityIndex == -1) {
        found = listOfData;
    }
    else {
        found = listOfData.slice(0, lowProbabilityIndex);
        notFound = listOfData.slice(lowProbabilityIndex, listOfData.length);
    }

    // console.log(found);
    // console.log(notFound);
    
    var parentNode = d3.select("#component-score-div").select(".card-body").append("div").classed("row pl-2 pr-2", true);

    if (found.length!=0)
        loadComponentScores(parentNode, "Found", found, color);
    if (notFound.length!=0)
        loadComponentScores(parentNode, "Not Found", notFound, color);
    
    // if (found.length!=0) {
    //     var foundDiv = parentNode.append("div")
    //     .classed("col-md-6", true);
    //     foundDiv.append("div")
    //     .classed("comp-score-title justify-content-center text-white row", true)
    //     .html("Found");
    //     var foundScores = foundDiv.append("div").classed("row", true)
    //     .selectAll("div")
    //     .data(found).enter()
    //     .append("div")
    //     .classed("col-md-12", true);

    //     foundScores.append("h")
    //     .html(function (d) {
    //         if (d == undefined)
    //             return "";
    //         return d.name;
    //     })
    //     .classed ("component score-header mr-2", true);

    //     foundScores.append("svg")
    //     .classed("score-svg", true)
    //     .attr("height", function () {
    //         return height;
    //     })
    //     .attr("width", function () {
    //         return maxWidth;
    //     })
    //     .append("rect")
    //     .attr("height", function () {
    //         return height;
    //     })
    //     .attr("width", function (d) {
    //         if (d == undefined)
    //             return 0;
    //         return d.probability * maxWidth;
    //     })
    //     .attr("fill", function () {
    //         return color;
    //     });
    // }

    // if (notFound.length!=0) {
    //     var notFoundDiv = parentNode.append("div")
    //     .classed("col-md-6", true);
    //     notFoundDiv.append("div")
    //     .classed("comp-score-title justify-content-center text-white row", true)
    //     .html("Not Found");
    //     var notFoundScores = notFoundDiv.append("div").classed("row", true)
    //     .selectAll("div")
    //     .data(notFound).enter()
    //     .append("div")
    //     .classed("col-md-12", true);

    //     notFoundScores.append("h")
    //     .html(function (d) {
    //         if (d == undefined)
    //             return "";
    //         return d.name;
    //     })
    //     .classed ("component score-header mr-2", true);

    //     notFoundScores.append("svg")
    //     .classed("score-svg", true)
    //     .attr("height", function () {
    //         return height;
    //     })
    //     .attr("width", function () {
    //         return maxWidth;
    //     })
    //     .append("rect")
    //     .attr("height", function () {
    //         return height;
    //     })
    //     .attr("width", function (d) {
    //         if (d == undefined)
    //             return 0;
    //         return d.probability * maxWidth;
    //     })
    //     .attr("fill", function () {
    //         return color;
    //     });
    // }

}

function loadComponentScores(parentNode, htmlContent, data, color) {
    var compDiv = parentNode.append("div")
        .attr("class",function() {
            if (htmlContent == "Found")
                return "col-md-7";
            else
                return "col-md-5";
        });
        compDiv.append("div")
        .classed("comp-score-title justify-content-center text-white row", true)
        .html(htmlContent);
        var scores = compDiv.append("div").classed("row", true)
        .selectAll("div")
        .data(data).enter()
        .append("div")
        .classed("col-md-12", true);

        scores.append("h")
        .html(function (d) {
            if (d == undefined)
                return "";
            return d.name;
        })
        .classed ("component score-header mr-2", true);

        if (htmlContent == "Found") {
            scores.append("svg")
            .classed("score-svg", true)
            .attr("height", function () {
                return height;
            })
            .attr("width", function () {
                return maxWidth;
            })
            .append("rect")
            .attr("height", function () {
                return height;
            })
            .attr("width", function (d) {
                if (d == undefined)
                    return 0;
                return d.probability * maxWidth;
            })
            .attr("fill", function () {
                return color;
            });
        }
        else {
            scores.classed("text-center", true);
        }
}