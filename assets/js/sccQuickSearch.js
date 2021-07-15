// SimpleQuickSearch script for JabRef HTML export
// Version: 2.0
//
// Based on QuickSearch Version 3.0 by Mark Schenk
// Features:
// - intuitive find-as-you-type searching
// - case insensitive
// - ignore diacritics (optional)
// - search with/without Regular Expressions
// - match BibTeX key

// Search settings
var noSquiggles = true;// ignore diacritics when searching
var searchRegExp = false;// enable RegExp searches
function initSearch() {
	// check for quick search table and searchfield
	if (!document.getElementById("quicksearch")) { return; }
	//find the query field
	qsfield = document.getElementById("qs_field"); // global variable
	// previous search term; used for speed optimization
	prevSearch = "";
	initPreferences();
	// shows the searchfield
	document.getElementById("quicksearch").style.display = "block";
	// wait until the onkeyup event in the searchfield
	document.getElementById("qs_field").onkeyup = quickSearch;
	// add event listeners for buttons
	document.addEventListener("click", function (event) {
		if (event.target.parentElement==null) {
			return;
		}
		if (event.target.matches("[id=toggleSettings]")||event.target.parentElement.matches("[id=toggleSettings]")) {
			if (event.target.matches("[id=toggleSettings]")) {
				toggleElement(event.target,document.getElementById("settings"));
			} else {
				toggleElement(event.target.parentElement,document.getElementById("settings"));
			}
		}
	}, false);
	document.addEventListener("change", function (event) {
		if (event.target.matches("[id=groupSelector]")) {
			groupBy(event.target.value);
			event.target.selectedIndex = 0;
		}
		if (event.target.matches("[class*=search_setting]")) {
			updateSetting(event.target);
		}
	}, false);
}

function quickSearch(){
	tInput = qsfield;
	if (tInput.value.length == 0) {
		showAll();
		return;
	} else {
		t = stripDiacritics(tInput.value);
		if(!searchRegExp) { t = escapeRegExp(t); }
		// only search for valid RegExp
		try {
			textRegExp = new RegExp(t,"i");
		}
		catch(err) {
		prevSearch = tInput.value;
		qsfield.className = "invalidsearch";
		return;
		}
	}
	// start looping through all entry rows
	for (var i = 0; cRow = liveRows[i]; i++){
		// only show search the cells if it isn't already hidden OR if the search term is getting shorter, then search all
		if(cRow.className.indexOf("hidden")==-1 || tInput.value.length <= prevSearch.length){
			var found = false; 
			if (stripDiacritics(getTextContent(liveRows[i])).search(textRegExp) != -1 || liveRows[i].id.search(textRegExp) != -1){ 
				found = true;
			}
			if (found){
				cRow.className = "entry notHidden";
			} else {
				cRow.className = "entry hidden";
			}
		}
	}
	// set previous search value
	prevSearch = tInput.value;
	// Remove/replace headers
	hideEmptyGroupHeadings();
}

// Strip Diacritics from text
// http://stackoverflow.com/questions/990904/javascript-remove-accents-in-strings

// String containing replacement characters for stripping accents 
var stripstring = 
"AAAAAAACEEEEIIII"+
"DNOOOOO.OUUUUY.."+
"aaaaaaaceeeeiiii"+
"dnooooo.ouuuuy.y"+
"AaAaAaCcCcCcCcDd"+
"DdEeEeEeEeEeGgGg"+
"GgGgHhHhIiIiIiIi"+
"IiIiJjKkkLlLlLlL"+
"lJlNnNnNnnNnOoOo"+
"OoOoRrRrRrSsSsSs"+
"SsTtTtTtUuUuUuUu"+
"UuUuWwYyYZzZzZz.";

function stripDiacritics(str){
	if(noSquiggles==false){
		return str;
	}
	var answer="";
	for(var i=0;i<str.length;i++){
		var ch=str[i];
		var chindex=ch.charCodeAt(0)-192; // Index of character code in the strip string
		if(chindex>=0 && chindex<stripstring.length){
			// Character is within our table, so we can strip the accent...
			var outch=stripstring.charAt(chindex);
			// ...unless it was shown as a "."
			if(outch!=".")ch=outch;
		}
		answer+=ch;
	}
	return answer;
}

// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
// NOTE: must escape every \ in the export code because of the JabRef Export...
function escapeRegExp(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getTextContent(node) {
// Function written by Arve Bersvendsen
// http://www.virtuelvis.com
	if (node.nodeType == 3) {
		return node.nodeValue;
	} // text node
	if (node.nodeType == 1 && node.className != "infolinks") { // element node
		var text = [];
		for (var chld = node.firstChild;chld;chld=chld.nextSibling) {
			text.push(getTextContent(chld));
		}
		return text.join("");
	} 
	return ""; // some other node, won't contain text nodes.
}

function showAll(){
	for (var i = 0; i < liveRows.length; i++){
	liveRows[i].className = "entry notHidden";
	}
	// Remove/replace headers
	hideEmptyGroupHeadings();
}

function redoQS(){
	showAll();
	quickSearch(qsfield);
}

function updateSetting(obj){
	var option = obj.id;
	var checked = obj.value;

	switch(option)
	{
		case "opt_useRegExp":
			searchRegExp=!searchRegExp;
			redoQS();
			break;
		case "opt_noAccents":
			noSquiggles=!noSquiggles;
			redoQS();
			break;
	}
}

function initPreferences(){
	if(noSquiggles){document.getElementById("opt_noAccents").checked = true;}
	if(searchRegExp){document.getElementById("opt_useRegExp").checked = true;}
}

function hideEmptyGroupHeadings() {
	groups.forEach(function(group,index) { 
		var groupDiv = content.querySelector("div[class*=\"" + group.ID + "\"]");
		var olElement = groupDiv.querySelector("ol[class*=\"" + group.ID + "\"]");
		if (olElement != null){
			var liElements = olElement.querySelectorAll("li:not(.hidden)");
			if (groupDiv != null){
				if(liElements.length === 0) {
					if (groupDiv.classList.contains("notHidden")) {
						groupDiv.classList.replace("notHidden","hidden");
					} else {
						groupDiv.classList.add("hidden");
					}
				} else {
					groupDiv.classList.replace("hidden","notHidden");
				}
			}
		}
	});
};
//Mobile layout - bottom nav bar
function swapSearch(mediaQuery) {
	var searchElement = document.querySelector(".searchContainer");
	var pubElement = document.getElementById("includedContent");
	var containerElement = document.querySelector(".contentWrapper");
	if (searchElement !== null) {
		if (mediaQuery.matches) {
			containerElement.insertBefore(searchElement,pubElement);
		} else {
			containerElement.insertBefore(pubElement,searchElement);
		}
	}
}
var mediaQuery = window.matchMedia("(max-width: 736px)");
swapSearch(mediaQuery); // Call listener function at run time
mediaQuery.addListener(swapSearch);