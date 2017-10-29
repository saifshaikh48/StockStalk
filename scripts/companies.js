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
    var pStyle = "style=\"margin-left:15px;\" !important";
    popup.id = id;
    popup.className = "popbox";

    popup.innerHTML = "<h2 " + pStyle + ">Stock Stalk®️</h2>\
        <p " + pStyle + ">Company Name: " + name + "</p>\
        <p " + pStyle + ">Closing Price: " + close + "</p>\
        <p " + pStyle + ">Starting Price: " + start + "</p>\
        <p " + pStyle + ">Trade Volume: " + volume + "</p>";

    document.body.appendChild(popup);
}

function getRegex(list) {
    var keys = "\\b";
    for (var key in list) {
        keys += key + "|";
    }
    keys = keys.substr(0, keys.length - 1);
    keys += "\\b";
    return new RegExp(keys, "i");
}

function loadAll() {
    var kvp = {
        "walmart": { "name": "Walmart", "symbol": "wmt" },
        "berkshire hathaway": { "name": "Berkshire Hathaway", "symbol": "brk.a" },
        "apple": { "name": "Apple", "symbol": "aapl" },
        "exxon mobil": { "name": "Exxon Mobil", "symbol": "xon" },
        "unitedhealth": { "name": "UnitedHealth", "symbol": "unh" },
        "cvs": { "name": "CVS", "symbol": "cvs" },
        "general motors": { "name": "General Motors", "symbol": "gm" },
        "at&t": { "name": "AT&T", "symbol": "t" },
        "ford motor": { "name": "Ford Motor", "symbol": "f" },
        "amazon": { "name": "Amazon", "symbol": "amzn" },
        "general electric": { "name": "General Electric", "symbol": "ge" },
        "verizon": { "name": "Verizon", "symbol": "vz" },
        "costco": { "name": "Costco", "symbol": "cost" },
        "walgreens": { "name": "Walgreens", "symbol": "wba" },
        "jp morgan": { "name": "JP Morgan", "symbol": "jpm" },
        "home depot": { "name": "Home Depot", "symbol": "hd" },
        "priceline": { "name": "Priceline", "symbol": "pcln" },
        "chevron": { "name": "Chevron", "symbol": "cvx" },
        "boeing": { "name": "Boeing", "symbol": "ba" },
        "wells fargo": { "name": "Wells Fargo", "symbol": "wfc" },
        "bank of america": { "name": "Bank of America", "symbol": "bac" },
        "google": { "name": "Google", "symbol": "googl" },
        "microsoft": { "name": "Microsoft", "symbol": "msft" },
        "comcast": { "name": "Comcast", "symbol": "cmcsa" },
        "ibm": { "name": "IBM", "symbol": "ibm" },
        "johnson & johnson": { "name": "Johnson & Johnson", "symbol": "jnj" },
        "proctor & gamble": { "name": "Proctor & Gamble", "symbol": "pg" },
        "valero": { "name": "Valero", "symbol": "vol" },
        "lowe's": { "name": "Lowe's", "symbol": "low" },
        "dell": { "name": "Dell", "symbol": "dvmt" },
        "pepsi": { "name": "Pepsi", "symbol": "pep" },
        "intel": { "name": "Intel", "symbol": "intc" },
        "prudential financial": { "name": "Prudential Financial", "symbol": "pru" },
        "disney": { "name": "Disney", "symbol": "dis" },
        "yahoo": { "name": "Yahoo", "symbol": "yhoo" },
        "nike": { "name": "Nike", "symbol": "nke" }
    };

    // Searches the document for companies and adds them to a list of nodes
    var re = getRegex(kvp);
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
        false
    );

    var nodes = [];

    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    }

    // Gets a time for two days ago to make sure that the data is updated
    var currentTime = new Date();
    var twoPast = new Date();
    twoPast.setTime(currentTime.getTime() - (2 * 24 * 60 * 60 * 1000));
    if (twoPast.getDay == 6) {
        twoPast.setTime(currentTime.getTime() - (1 * 24 * 60 * 60 * 1000));
    } else if (twoPast.getDay == 0) {
        twoPast.setTime(currentTime.getTime() - (2 * 24 * 60 * 60 * 1000));
    }
    var stringTime = twoPast.getFullYear() + "-" + (twoPast.getMonth() + 1) + "-" + twoPast.getDate();

    // Iterates through each company and creates a new span and popup to handle that company
    for (var i = 0; node = nodes[i]; i++) {
        loadData(i, node, stringTime);
    }

    async function loadData(i, node, time) {
        // Get the one that matched
        var name = node.textContent.match(re)[0];
        var stockData = kvp[name.toLowerCase()];
        console.log(stockData);

        // Load data if it doesn't already exist
        if (!stockData.hasOwnProperty("data")) {
            var data = await alpha.data.daily(stockData["symbol"]);
            if (data != null && data != undefined && data.hasOwnProperty("Time Series (Daily)")) {
                stockData["data"] = data["Time Series (Daily)"];
                kvp[name.toLowerCase] = stockData;
            } else {
                console.log("Failed fetch");
            }
        }
        dayData = stockData["data"][stringTime];

        var id = "elem-" + i;
        var divId = "pop-" + i;
        if (node.parentNode != null) {
            node.parentNode.innerHTML = node.parentNode.innerHTML.replace(re, "<span id=" + id + "><u>" + name + "</u></span>");
            var elem = document.getElementById(id);
            if (elem != null) {
                elem.onmouseenter = createOnEnter(divId);
                elem.onmouseleave = createOnLeave(divId);
                getPopup(divId, stockData["name"],
                    dayData["1. open"],
                    dayData["4. close"],
                    dayData["5. volume"]);
            }
        }
    }
}

loadAll();