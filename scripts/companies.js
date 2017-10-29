var alpha = require("alphavantage")({ key: "II2KSRA2K8NWVJHU" });

// Creates a function to handle the displaying of a popup
function createOnEnter(id) {
    return function onEnter(e) {
        var popup = document.getElementById(id);
        popup.style.left = e.clientX + 20 + "px";
        popup.style.top = e.clientY + 20 + "px";
        popup.style.display = "block";
    }
}

// Creates a function to handle the hiding of a popup
function createOnLeave(id) {
    return function onLeave() {
        document.getElementById(id).style.display = "none";
    }
}

// Creates a popup to display when a company is hovered over
function getPopup(id, name, start, close, volume) {
    var popup = document.createElement("div");
    var pStyle = "style=\"margin-left:15px;\"";
    popup.id = id;
    popup.style.display = "none";
    popup.style.zIndex = "9999";
    popup.style.width = "180px";
    popup.style.height = "180px";
    popup.style.position = "fixed";

    popup.style.background = "#DDDDDD";
    popup.style.color = "#579EED";
    popup.style.border = "1px solid #4D4F53";
    popup.style.boxShadow = "0px 0px 5px 0px rgba(164, 164, 164, 1)";

    popup.innerHTML = "<h2 " + pStyle + ">Stock Stalk®️</h2>\
        <p " + pStyle + ">Company Name: " + name + "</p>\
        <p " + pStyle + ">Closing Price: " + close + "</p>\
        <p " + pStyle + ">Starting Price: " + start + "</p>\
        <p " + pStyle + ">Trade Volume: " + volume + "</p>";

    document.body.appendChild(popup);
}

// Searches the document for companies and adds them to a list of nodes
var re = /\bgoogle\b/i;
var walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    function (node) {
        var matches = node.textContent.match(re);

        if (matches) {
            return NodeFilter.FILTER_ACCEPT;
        } else {
            return NodeFilter.FILTER_SKIP;
        }
    },
    false);

var nodes = [];

while (walker.nextNode()) {
    nodes.push(walker.currentNode);
}

// Gets a time for two days ago to make sure that the data is updated
var currentTime = new Date();
var twoPast = new Date();
twoPast.setTime(currentTime.getTime() - (2 * 24 * 60 * 60 * 1000));
if (twoPast.getDay == 6)
    twoPast.setTime(currentTime.getTime() - (1 * 24 * 60 * 60 * 1000));
else if (twoPast.getDay == 0)
    twoPast.setTime(currentTime.getTime() - (2 * 24 * 60 * 60 * 1000));
var dataRef = "Time Series (Daily)";
var year = twoPast.getFullYear();
var month = twoPast.getMonth() + 1;
var date = twoPast.getDate();
var stringTime = year + "-" + month + "-" + date;

// Iterates through each company and creates a new span and popup to handle that company
for (var i = 0; node = nodes[i]; i++) {
    loadData(i, node, stringTime);
}

function loadData(i, node, time) {
    var dayData;
    alpha.data.daily(`googl`).then(data => {
        dayData = data[dataRef];

        if (dayData != null) {
            var id = "elem-" + i;
            var divId = "pop-" + i;
            if (node.parentNode != null) {
                node.parentNode.innerHTML = node.parentNode.innerHTML.replace(re, "<span id=" + id + "><u>" + node.textContent.match(re) + "</u></span>");
                var elem = document.getElementById(id);
                if (elem != null) {
                    elem.onmouseenter = createOnEnter(divId);
                    elem.onmouseleave = createOnLeave(divId);
                    getPopup(divId, "Google",
                        dayData[stringTime]["1. open"],
                        dayData[stringTime]["4. close"],
                        dayData[stringTime]["5. volume"]);
                }
            }
        }
    });
}