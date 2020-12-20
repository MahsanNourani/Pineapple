DATA = {};
CONDITION = localStorage.getItem("condition");
d3.queue()
    .defer(d3.json, "assets/data/complex_dataset.json")
    .defer(d3.json, "assets/data/days.json")
    .defer(d3.json, "assets/data/explanations.json") //https://indie.cise.ufl.edu/Pineapple/
    .awaitAll(function(error, data) {
        if (error)
            console.log(error);
        DATA.complex = data[0];
        DATA.days = data[1];
        DATA.explanations = data[2];
        startTask();


    });

(function(){
    var currentAnswerExpId = 0;

    this.onVideoLoaded = function () {
        var temp = findExplanation(currentAnswerExpId);
        showExplanations(temp);
        console.log("Video is loaded");
    };

    this.searchForQuery = function (object, action, location) {

        // console.log(action + " " + object + " " + location);

        d3.select("#search-results-div")
            .classed("d-none", false);

        var el = d3.select("#results-div");
        if (!el.empty()) {
            el.remove();
        }
        var newObj = object, newAct = action, newLoc = location;
        if (object == "any object" || object == "objects") {
            d3.select("#Objects-dropdown").html("Any object");
            newObj = "n/a";
        }
        if (action == "any action" || action == "actions") {
            d3.select("#Actions-dropdown").html("Any action");
            newAct = "n/a";
        }
        if (location == "any location" || location == "locations") {
            d3.select("#Locations-dropdown").html("Any location");
            newLoc = "n/a";
        }

        var queryObject = {};
            queryObject.obj = object;
            queryObject.act = action;
            queryObject.loc = location;
        createQueryLog(queryObject);

        var listOfResults = [];
        var daysColorBadge =
            {"Monday":"#f2ff33", "Tuesday":"#b9f657", "Wednesday":"#96fd87", "Thursday":"#31f6ff", "Friday":"#04ffc5"};


        for (var vidIndex = 0; vidIndex < DATA.complex.length; vidIndex++) {
            console.log(DATA.complex[vidIndex]);
            for (var i = 0; i < DATA.complex[vidIndex].listOfQuestions.length; i++) {
                var query = DATA.complex[vidIndex].listOfQuestions[i].questionText;
                if(query.object.toLowerCase() ==  newObj && query.action.toLowerCase() == newAct && query.location.toLowerCase() == newLoc) {
                    // console.log("found a match!");
                    var resultObject = {};
                    resultObject["video"] = DATA.complex[vidIndex].videoName;
                    resultObject = Object.assign({}, resultObject, DATA.complex[vidIndex].listOfQuestions[i]);

                    //This stores an object per result
                    listOfResults.push(resultObject);

                }
            }
        }


        for (var i = 0; i < listOfResults.length; i++) {
            var dayAndID = findDayForVideo(listOfResults[i].video);
            listOfResults[i].day = dayAndID[0];
            listOfResults[i].vidId = dayAndID[1];
        }

        //Sort based on the day
        listOfResults.sort(compareResults);

        var resultsSeparatedByAns = splitResultsByAnswer(listOfResults);

        // listOfResults = undefined;
        console.log(resultsSeparatedByAns);
        // console.log(listOfResults);

        var searchResultsDiv = d3.select("#search-results")
            .append("div")
            .classed("col-md-12", true)
            .attr("id", "results-div");

        var answerDiv = searchResultsDiv.selectAll("div")
            .data(resultsSeparatedByAns).enter()
            .append("div")
            .classed("row result-rows vertical-align-center", true);
        answerDiv.append("div")
            .classed("col-md-2 text-center rounded font-weight-bold vertical-align-center answer-box", true)
            .append("p")
            .classed("mb-0", true)
            .html(function (d) {
                return  "<span class=\"badge badge-warning\" style='font-size: 17px;'>" +  d.res.length +"</span>" + " videos " + d.ans;
            });
        // .append("i")
        // .classed("fas fa-question-circle", true);
        // <a href="#" title="Header" data-toggle="popover" data-placement="top" data-content="Content">Top</a>
        var thumbnailsDiv = answerDiv.append("div")
            .classed("col-md-10", true)
            .append("div")
            .classed("row mb-0 flex-nowrap thumbnail-row", true);

        // var thumbnails = thumbnailsDiv.append("div").classed("row mb-0 p-2 flex-nowrap thumbnail-row", true);
        thumbnailsDiv.append("div")
            .classed("btn-scroll", true)
            .append("button")
            .classed("btn btn-warning btn-scroll-left", true)
            .attr("disabled", true)
            .on("click", function (d, i) {
                d3.select(this.parentNode.parentNode).select(".btn-scroll-right").attr("disabled", null);
                // var content = "#thumbnail-div-" + i;
                event.preventDefault();
                $("#thumbnail-div-" + i).animate({
                    scrollLeft: "-=300px"
                }, "slow");
            })
            .append("i")
            .classed("fas fa-chevron-left", true);
        var thumbnails = thumbnailsDiv.append("div")
            .classed("col-md-11 row flex-nowrap scrollable-div bg-white mb-0 thumbnail-div",true)
            .attr("id", function (d,i) {
                return "thumbnail-div-" + i;
            }).selectAll("div")
            .data(function (d) {
                return d.res;
            }).enter()
            .append("div")
            .classed("col-md-2 exp-thumbnail rounded text-center mr-2 p-0 mt-2", true);
        var thumbnail = thumbnails.append("div")
            .classed("video-num border border-dark rounded col-md-12 p-0", true);
        var topDiv = thumbnail.append("div")
            .classed("row mb-0 border border-right-0 border-left-0 border-top-0 border-dark", true);
        topDiv.append("span")
            .classed("col-md-7 rounded-left p-0", true)
            .html(function (d) {
                return d.day;
            })
            .style("background-color", function (d) {
                return daysColorBadge[d.day];
            });
        topDiv.append("span")
            .classed("col-md-5", true)
            .html(function (d) {
                return "#" + d.vidId;
            });
        thumbnail.append("img")
            .classed("img-responsive col-md-12 p-0 bg-white", true)
            .attr("src", function (d) {
                var imageSource = "assets/thumbnails/frame_";
                if (CONDITION == "0" || CONDITION == "1")
                    imageSource += d.video + "_mid.jpg";
                else //This is changed to the URL to make the local storage free of 50000 thumbnails!
                    imageSource = "https://indie.cise.ufl.edu/Pineapple/assets/thumbnails/frame_" + d.expId + ".jpg";
                return imageSource;
            })
            .attr("id", function (d) {
                return "img" + d.expId;
            })
            .on("click", function (d) {
                createVideoLog("thumbnail", d.expId, "");
                var event = document.createEvent('Event');
                event.initEvent('click', true, true);
                d3.select(this.parentNode.parentNode).select("button").node().dispatchEvent(event);
            });

        var badgeDiv = thumbnails.append("div")
            .classed("col-md-12 p-0 pt-1 vertical-align-center info-div", true);
        // badgeDiv
        badgeDiv.append("button")
            .classed("btn btn-explanation col-md-12", true)
            .attr("data-toggle", "modal")
            .attr("data-target", "#myModal")
            .style("font-size", "14px")
            .html(function () {
                var btnText = "<i class=\"fas fa-search-plus\"></i>";
                if (CONDITION == 2 || CONDITION == 3)
                    btnText += "View Explanations";
                else
                    btnText += "Watch Video";
                return btnText;
            })
            .on("click", function (d) {
                currentAnswerExpId = d.expId;
                createVideoLog("thumbnailBtn", d.expId, "");
                var title = "";
                title += ((d.computerAnswer.toLowerCase() == "yes")?"Found [": "Not found [");
                title += ((newAct=="n/a")?"Any action":newAct) + " + " + ((newObj=="n/a")?"Any object":newObj) + " + " + ((newLoc=="n/a")?"Any location":newLoc) + "]";
                d3.select("#myModal").select(".modal-title").html(title);
                d3.select("#myModal").select(".modal-title").attr("id", d.expId);
                loadVideo(d.video);
            });
        thumbnailsDiv.append("div")
            .classed("btn-scroll", true)
            .append("button")
            .classed("btn btn-warning btn-scroll-right", true)
            .on("click", function (d, i) {
                d3.select(this.parentNode.parentNode).select(".btn-scroll-left").attr("disabled", null);
                event.preventDefault();
                $("#thumbnail-div-" + i).animate({
                    scrollLeft: "+=300px"
                }, "slow");
            })
            .append("i")
            .classed("fas fa-chevron-right", true);


        $('.thumbnail-div').scroll( function() {
            var $width = $(this).outerWidth()
            var $scrollWidth = $(this)[0].scrollWidth;
            var $scrollLeft = $(this).scrollLeft();
            var offset = 0.5; // this is the small decimal
            //The actual solution is if ( $scrollWidth - $width === $scrollLeft + offset (padding)) but there is always a small decimal that messes things up, hence, the threshold.
            if (Math.abs($scrollWidth - $width - $scrollLeft) < offset) {
                console.log(Math.abs($scrollWidth - $width - $scrollLeft));
                // alert('right end');
                d3.select(this.parentNode).select(".btn-scroll-right").attr("disabled", true);
                d3.select(this.parentNode).select(".btn-scroll-left").attr("disabled", null);
            }
            if ($scrollLeft===0){
                // alert('left end');
                d3.select(this.parentNode).select(".btn-scroll-right").attr("disabled", null);
                d3.select(this.parentNode).select(".btn-scroll-left").attr("disabled", true);
            }
        });

        // Uncomment the following lines for the thumbnail popover to reappear
        // .attr("data-toggle", "popover")
        // .attr("data-trigger", "hover")
        // .attr("data-content", function (d) {
        //     return '<img class="img-responsive hover-img" src="assets/thumbnails/frame_' + d.expId + '.jpg">';
        // })
        // .on("mouseover", function (d) {
        //     $('[data-toggle="popover"]').popover({
        //         html: true,
        //         trigger: "hover"
        //     });
        // });

    };

    this.appendLog = function (logObject) {
        var allTheLogs = JSON.parse(localStorage.getItem("logs"));
        if (allTheLogs == undefined) {
            allTheLogs = [];
        }
        allTheLogs.push(logObject);
        localStorage.setItem("logs", JSON.stringify(allTheLogs));
    }

    this.createVideoLog = function (clickedItem, expId, misc) {
        var logObject = {};
        logObject.expId = expId;
        logObject.misc = misc;
        logObject.clickedItem = clickedItem;
        logObject.t = new Date().getTime();

        appendLog(logObject);
    }

    this.createQueryLog = function (query) {
        query.clickedItem = "searchQuery";
        query.t = new Date().getTime();
        appendLog(query);
    }
    this.createPolicyLog = function (clickedItem, policyId) {
        var logObject = {};
        logObject.clickedItem = clickedItem;
        logObject.pid = policyId;
        logObject.t = new Date().getTime();

        appendLog(logObject);
    }
})();

function startTask() {
    d3.select("#loading-button").classed("d-none", false);
    var modalContent = d3.select("#load-data-modal");
    modalContent.select("h4").html("Success!");
    modalContent.select(".modal-body").html("Thank you for your patience. Please click the button bellow to start the task.")
    modalContent.select(".modal-header").classed("bg-warning", false).classed("bg-success", true);
    localStorage.setItem("mainStart", getDateTime());
}

function findDayForVideo (video) {
    var output = [];
    for (var j = 0; j < DATA.days.length; j++) {
        var day = DATA.days[j];
        for (var i = 0; i < day.Videos.length; i++) {
            if (day.Videos[i].name == video) {
                output.push(day.Day);
                output.push(day.Videos[i].id);
                return output;
            }
        }
    }

    output.push("NONE");
    output.push(undefined);
    return output;
}

function compareResults(res1, res2) {
    const sorter = {
        // "sunday": 0, // << if sunday is first day of week
        "monday": 1,
        "tuesday": 2,
        "wednesday": 3,
        "thursday": 4,
        "friday": 5,
        "saturday": 6,
        "sunday": 7
    };
    var day1 = res1.day.toLowerCase();
    var day2 = res2.day.toLowerCase();
    return sorter[day1] - sorter[day2];
    // if (res1.day == "Thursday" && res2.day == "Tuesday")
    //     return 1;
    // if (res1.day == "Tuesday" && res2.day == "Thursday")
    //     return -1;
    // if ( res1.day < res2.day)
    //     return -1;
    // if ( res1.day > res2.day)
    //     return 1;
    // return 0;
}

function splitResultsByAnswer(listOfResults) {
    var resultsSeparatedByAns = [];
    var yesResults = {}, noResults = {};
    yesResults.ans = "found";
    yesResults.res = [];
    noResults.ans = "not found";
    noResults.res = [];

    for (var i = 0; i < listOfResults.length; i++) {
        if (listOfResults[i].computerAnswer.toLowerCase() == "yes")
            yesResults.res.push(listOfResults[i]);
        else
            noResults.res.push(listOfResults[i]);
    }

    resultsSeparatedByAns.push(yesResults);
    resultsSeparatedByAns.push(noResults);

    return resultsSeparatedByAns;
}

function toggleExplanationBasedOnCondition() {
    if (CONDITION == 0 || CONDITION == 1) {
        d3.select("#explanation-box").classed("invisible", true);
        d3.select("#component-score-div").classed("invisible", true);
        d3.select("#segment").classed("invisible", true);
    }
}

function loadVideo(videoName) {
    clear_list();
    clear_segment();
    toggleExplanationBasedOnCondition();
    var vid = document.getElementById("media-video");
    var sourceVideo = 'https://indie.cise.ufl.edu/Pineapple/assets/videos/' + videoName;
    vid.src = sourceVideo;
    vid.load();
}

function showExplanations(listOfKeyFrames) {
    // loadSegments(listOfKeyFrames);
    // var listOfFrames = listOfKeyFrames;
    var length = listOfKeyFrames.length;
    var startTimes = [],
        endTimes = [],
        explanations = [],
        associations = [];
    for (var i = 0; i< length; i++) {
        startTimes.push(listOfKeyFrames[i].startTime);
        endTimes.push(listOfKeyFrames[i].endTime);
        explanations.push(listOfKeyFrames[i].textExplanations);
        associations.push(listOfKeyFrames[i].associatedFeatures);
    }

    // This will make sure the video's metadata is load before plotting the segments
    segment_buttons(startTimes, endTimes, explanations, associations);
}

function getDateTime() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;
}

function findExplanation(expId) {
    for (var i = 0; i< DATA.explanations.length;i++) {
        if (DATA.explanations[i].expId == expId) {
            return DATA.explanations[i].listOfKeyFrames;
        }
    }
    return {};
}


$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#go-back, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    d3.select("#sidebar").classed("active", true);
    d3.select(".overlay").classed("active", true);

    $('#load-data-modal').modal("show");

    // setTimeout(function() {searchForQuery("hand", "throw", "garbage")}, 400);

    //For debug
    // $('#img10').popover('show')
});
