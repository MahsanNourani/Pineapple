(function scopeFunction() {

    var file = 'assets/data/search-options.json';

    function getComponents() {
        var object = d3.select("#Objects-dropdown").html().toLowerCase();
        var action = d3.select("#Actions-dropdown").html().toLowerCase();
        var location = d3.select("#Locations-dropdown").html().toLowerCase();
        return {object: object, action: action, location: location};
    }

    function toggleSubmitSearchButton() {
        var __ret = getComponents();
        if ((__ret.object == "any object" || __ret.object == "objects") &&
            (__ret.action == "any action" || __ret.action == "actions") &&
            (__ret.location == "any location" || __ret.location == "locations")) {
            d3.select("#submit-search").attr("disabled", true);
        }
        else
            d3.select("#submit-search").attr("disabled", null);
    }

    d3.json(file,  function (error, data) {
        if (error)
            console.log(error);

        var dropdownDiv = d3.select("#dropdown-div");

        var dropdown = dropdownDiv.selectAll("div")
            .data(data).enter()
            .append("div")
            .classed("dropdown dropright col-md-3", true)
            .attr("id", function (d) {
                return d.Category + "-dropdown-div";
            });

        dropdown.append("button")
            .classed("btn btn-primary dropdown-toggle btn-block", true)
            .attr("type", "button")
            .attr("data-toggle", "dropdown")
            .attr("id", function (d) {
                return d.Category + "-dropdown";
            })
            .html(function (d) {
                return d.Category /*+ " "+ "<span class=\"caret\"></span>"*/;
            });

        var list = dropdown.append("div")
            .classed("dropdown-menu pt-0", true);
        var searchDiv = list.append("div")
            .classed("card sticky-top component-search-div", true);
        searchDiv.append("div")
            .classed("dropdown-header", true)
            .html(function (d) {
                return d.Category;
            });
        searchDiv.append("input")
            .classed("form-control search-box-dropdown", true)
            .attr("type", "text")
            .attr("placeholder", "Search..")
            .on("input", function () {
                var value = d3.select(this).node().value.toLowerCase();
                d3.select(this.parentNode.parentNode).selectAll("a")
                    .filter (function () {
                        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                    })
            });

        var dropdownItem = list.selectAll("a")
            .data(function(d) {
                return d.Values;
            }).enter()
            // .append("li")
            .append("a")
            .classed("dropdown-item btn a-button", true)
            .html(function (d) {
                return d;
            })
            .on("click", function (d, i) {
                var parent = this.parentNode.parentNode;
                d3.select(parent).select("button").html(function () {
                    return d /*+ " "+ "<span class=\"caret\"></span>"*/;
                })
                    .classed("dropdown-selected", true);

                document.getElementsByClassName("dropdown-menu show")[0].scrollTop = 0;

                // Clears the search input box and undo's the filtering
                $(".search-box-dropdown").val("");
                var event = document.createEvent('Event');
                event.initEvent('input', true, true);
                d3.select(this.parentNode).select("input").node().dispatchEvent(event);

                toggleSubmitSearchButton();
            });

        dropdownDiv.append("div")
            .classed("col-md-2 query-btn", true)
            .append("button")
            .classed ("btn btn-success btn-block", true)
            .attr("disabled", true)
            .attr("id", "submit-search")
            .html("Search")
            .on("click", function () {
                d3.selectAll(".dropright").select("button").classed("dropdown-selected", false);
                var __ret = getComponents();
                var object = __ret.object;
                var action = __ret.action;
                var location = __ret.location;

                searchForQuery(object, action, location);

            });

        d3.select("#dropdown-div")
            .insert("div", "#Objects-dropdown-div")
            .append("i")
            .classed("fas fa-plus text-white", true);

        //  + * at the end of selector inserts element AFTER!
        d3.select("#dropdown-div")
            .insert("div", "#Objects-dropdown-div + *")
            .append("i")
            .classed("fas fa-plus text-white", true);

        d3.select("#dropdown-div")
            .insert("div", "#Locations-dropdown-div + *")
            .append("i")
            .classed("fas fa-arrow-right text-white", true);
        // var objects = d3.select("#Objects-dropdown-div").selectAll("a");
        //     objects.append("img")
        //     .classed("img-fluid dropdown-img", true)
        //     .attr("src", function (d) {
        //         return "assets/images/Objects/" + d.toLowerCase() + ".png";
        //     });
        // objects.insert("div", "a")
        //     .classed("dropdown-divider", true);

    });

    var condition = localStorage.getItem("condition");
    if (condition == "0" || condition == "1")
        d3.select("#tutorial-nX").classed("d-none", false);
    else
        d3.select("#tutorial-X").classed("d-none", false);

})();
