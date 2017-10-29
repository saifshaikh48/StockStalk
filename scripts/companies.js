var uniqueId = function () {
    return 'id-' + Math.random().toString(36).substr(2, 16);
};

function onEnter() {
    console.log("enter...");
}

function onLeave() {
    console.log("leave...");
}

var re = /\bcompany\b/i;
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

for (var i = 0; node = nodes[i]; i++) {
    var id = uniqueId();
    if (node.parentNode != null) {
        node.parentNode.innerHTML = node.parentNode.innerHTML.replace(re, "<span id=" + id + "><u>Blah Blah Blah</u></span>");
        var elem = document.getElementById(id);
        if (elem != null) {
            elem.onmouseenter = onEnter;
            elem.onmouseleave = onLeave;
        }
    }
}