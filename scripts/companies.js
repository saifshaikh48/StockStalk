// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

var re = /company/i;
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
    node.parentNode.innerHTML = node.parentNode.innerHTML.replace(re, "@$1")
}

/*
// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;

// Get all elements on the page
var items = document.getElementsByTagName("*");

// Loop through all elements in the document
for (var i = items.length; i--;) {
    if (items[i].childNodes[0].textContent.includes("company")) {
        // Style any element that contains the word
        items[i].classList.add(MOUSE_VISITED_CLASSNAME);
    }
    console.log(items[i].firstElementChild.textContent);
}*/