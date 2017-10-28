// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

var re = /company/i;
var company = "Test"
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
    node.parentNode.innerHTML = node.parentNode.innerHTML.replace(re, "<u>" + company + "</u>")
}

// Node -> Node
// replaces a substring of the Node with another Node