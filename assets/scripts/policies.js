(function () {

    this.getValues = function() {
        var i = 0;
        var values = {};
        while (!d3.select("#rule-" + i).empty()) {
            var value = d3.select("#rule-" + i).select("label.active input").node().value;
            console.log(value);
            values["#rule-" +  i] = value;
            i++;
        }
        localStorage.setItem("policyResponses", JSON.stringify(values));
        // return values;
    };

    this.submitPolicyResults = function() {
    //    first, get the values.
        localStorage.setItem("mainEnd", getDateTime());
        getValues();

    //    submit to the localStorage

        // show modal to confirm they are finished!
        location.href = './com_acc.html';
    };

    var condition = localStorage.getItem("condition"), file = '';
    if (condition == '0' || condition == '2')
        file = 'assets/data/rules-weak-first.json';
    else
        file = 'assets/data/rules-strong-first.json';

    d3.json(file,  function (error, data) {
        if (error)
            console.log(error);

        var generalRules = d3.select("#general-rules");

        // generalRules.append("div")
        //     .classed("col-md-12 task-description vertical-align-center justify-content-center", true)
        //     // .attr("id", "task-description")
        //     .html("For each policy, determine if they are followed or not.");

        var rule = generalRules.selectAll("div")
            .data(data.generalRules).enter()
            .append("div")
            .classed("block-parent bfc-root", true);

    // <div class="btn-group col-md-8 col-md-offset-2 btn-group-modified" data-toggle="buttons" id="agree-disagree">
    //         <label for="" class="btn btn-primary col-md-5 active" style="margin-right:52px; border-bottom-right-radius: 4px;border-top-right-radius: 4px;">
    //             <input type="radio" value="0" onchange="radioChange()"> No
    //         </label>
    //         <label for="" class="btn btn-primary col-md-5" style=" border-bottom-left-radius: 4px;border-top-left-radius: 4px;">
    //             <input type="radio" value="1" onchange="radioChange()"> Yes
    //         </label>
    // </div>

        var buttonGroup = rule.append("div")
            .classed("btn-group btn-group-toggle float btn-group-padding", true)
            .attr("id", function (d, i) {
                return "rule-" + i;
            })
            .attr("data-toggle", "buttons");
            // .on("click", function () {
            //     checkIfAllPoliciesChecked(this);
            // });
            // .on("click", function (d, i) {
            //     // One step before the click! What is wrong?
            //     console.log('#rule-' + i + ' label.active input');
            //     var filterDay = $('#rule-' + i + ' label.active input').val();
            //
            // });
        buttonGroup.append("label")
            .classed("btn btn-primary", true)
            // .attr("type", "button")
            .text("No")
            .on("click", function (d) {
                createPolicyLog("answeredPolicy", d3.select(this.parentNode).attr("id"));
                var value = d3.select(this).select("input").node().value;
                if (checkIfAllPoliciesChecked(this)) {
                    d3.select("#submit-policies").classed("d-none", false);
                }
            })
            .append("input")
            .attr("type", "radio")
            .attr("value", "0");

        buttonGroup.append("label")
            .classed("btn btn-primary", true)
            // .attr("type", "button")
            .text("Yes")
            .on("click", function (d) {
                createPolicyLog("answeredPolicy", d3.select(this.parentNode).attr("id"));
                var value = d3.select(this).select("input").node().value;
                if (checkIfAllPoliciesChecked(this)) {
                    d3.select("#submit-policies").classed("d-none", false);
                }
            })
            .append("input")
            .attr("type", "radio")
            .attr("value", "1");

        rule.append("span")
            .html(function (d) {
                console.log(d);
            return d
        });

        function checkIfAllPoliciesChecked(thisNode) {
            var i = 1;
            d3.select(thisNode).classed("checked", true);
            while (!d3.select("#rule-" + i).empty()) {
                if (d3.select("#rule-" + i).select(".checked").empty()) {
                    // console.log("this was not selected: rule-" + i);
                    return false;
                }
                i++;
            }
            // console.log("all are selected!");
            return true;
        }


        // var rule = generalRules.selectAll("div")
        //     .data(data.generalRules).enter()
        //     .append("div")
        //     .classed("policy-radio-success", true);
        // rule.append("input")
        //     .attr("type", "checkbox")
        //     .attr("name", "checkbox")
        //     .attr("id", function (d, i) {
        //         return "checkbox" + i;
        //     });
        // rule.append("label")
        //     .attr("for", function (d, i) {
        //         return "checkbox" + i;
        //     })
        //     .html(function (d) {
        //         return d;
        //     });
    });
})();