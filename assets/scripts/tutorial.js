// $(document).ready(function () {
//     imageIdentity = "A";
//     var condition = localStorage.getItem("condition");
//     if (condition == "1")
//         imageIdentity = "C";
//     else if (condition == "2")
//         imageIdentity = "B";
//     else if (condition == "3")
//         imageIdentity = "D";
//
// });
VID_SRC = "https://indie.cise.ufl.edu/Pineapple/assets/videos/condition";
$(document).ready(function() {
    var condition = localStorage.getItem("condition");
    if (condition == '1') condition = 0;
    if (condition == '3') condition = 2;
    VID_SRC += condition + ".mp4";
    d3.select("#video-player").attr("src", VID_SRC);
});



// function loadNextImage() {
//     var imageNumber = extractFileName();
//
//     if (imageNumber == -2 || imageNumber == -1 || imageNumber == -3) {
//         d3.select("#image")
//             .attr("src", "./assets/images/" + (imageNumber + 1) + ".png");
//         d3.select("#prev")
//             .classed("disabled", false);
//     }
//
//     else if (fileExists(imageNumber + 1)) {
//         d3.select("#image")
//             .attr("src", "./assets/images/" + imageIdentity + (imageNumber + 1) + ".png");
//     }
//     // All the images are seen! hence, you can go to the next page!
//     if (imageNumber > 0 && !fileExists(imageNumber + 2)) {
//         d3.select("#next")
//             .classed("disabled", true);
//         d3.select("#next-task")
//             .style("visibility", "visible");
//     }
//     // if (imageNumber == 1)
//     //     d3.select("#prev")
//     //         .classed("disabled", false);
// }
// function loadPreviousImage() {
//     var imageNumber = extractFileName();
//     // Prev image exists?
//     // if (imageNumber == 1 && imageIdentity == "P") {
//     //     d3.select("#image")
//     //         .attr("src", "./assets/images/-2.png");
//     //     d3.select("#prev")
//     //         .classed("disabled", true);
//     //     return;
//     // }
//     //
//     // else if (imageNumber == 1 && imageIdentity == "E") {
//     //     d3.select("#image")
//     //         .attr("src", "./assets/images/-2.png");
//     //     d3.select("#prev")
//     //         .classed("disabled", true);
//     //     return;
//     // }
//     if (imageNumber == 1 || imageNumber == 0 || imageNumber == -2 || imageNumber == -1) {
//         d3.select("#image")
//             .attr("src", "./assets/images/" + (imageNumber - 1) + ".png");
//     }
//     else if (fileExists(imageNumber - 1)) {
//         d3.select("#image")
//             .attr("src", "./assets/images/" + imageIdentity + (imageNumber - 1) + ".png");
//     }
//     if (!fileExists(imageNumber + 1)) {
//         d3.select("#next")
//             .classed("disabled", false);
//     }
//     // if (imageNumber == 2)
//     if (imageNumber == -2)
//         d3.select("#prev")
//             .classed("disabled", true);
// }
//
// function extractFileName() {
//     var source = d3.select("#image").attr("src");
//     var imageNumber = source.replace(/^.*[\\\/]/, '');
//     // if (imageNumber == "start.png")
//     //     return 0;
//     imageNumber = imageNumber.split('.').slice(0, -1).join('.');
//     if (imageNumber == -1 || imageNumber == 0 || imageNumber == -2 || imageNumber == -3)
//         return parseInt(imageNumber);
//     return parseInt(imageNumber.substr(1));
// }
//
// function fileExists(filename) {
//     var http = new XMLHttpRequest();
//     http.open('HEAD', './assets/images/' + imageIdentity + filename + '.png', false);
//     http.send();
//     return http.status!=404;
// }
