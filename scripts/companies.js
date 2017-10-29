function createOnEnter(id) {
    return function onEnter(id) {
        document.getElementById(id).style.display = "block";
        // console.log("showing " + divId);
    }
}

function createOnLeave(id) {
    return function onLeave(id) {
        document.getElementById(id).style.display = "none";
        // console.log("hiding " + divId);
    }
}

function getPopup(id, x, y) {
    var popup = document.createElement("div");
    popup.id = id;
    popup.style.display = "none";
    popup.style.width = "100px";
    popup.style.height = "100px";
    popup.style.position = "fixed";
    popup.style.margin = "auto";
    popup.style.left = 0;
    popup.style.right = 0;
    popup.style.top = 0;
    popup.style.bottom = 0;
    popup.innerHTML = "Hello world";
    document.body.appendChild(popup);
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
    var id = "elem-" + i;
    var divId = "pop-" + i;
    if (node.parentNode != null) {
        node.parentNode.innerHTML = node.parentNode.innerHTML.replace(re, "<span id=" + id + "><u>Blah Blah Blah</u></span>");
        getPopup(divId);
        var elem = document.getElementById(id);
        if (elem != null) {
            elem.onmouseenter = createOnEnter(divId);
            elem.onmouseleave = createOnLeave(divId);
        }
    }
}