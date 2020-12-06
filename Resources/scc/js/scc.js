var request = new XMLHttpRequest();
request.open("GET", "https://scc-lab.github.io/scc.html", true);
request.onload = function() {
	if (this.status >= 200 && this.status < 400) {
	// Success!
		document.getElementById("includedContent").innerHTML=request.responseText;
		initSearch()
	} else {
		alert("Received bib file... error retrieving bibliography information");
	}
};
request.onerror = function() {
	alert("Error retrieving the bib file");
};
request.send();
// SimpleQuickSearch script for JabRef HTML export (make sure to export without Abstract/BibTeX)
// Version: 1.0
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
// List of headings corresponding to BibTeX entry types
var entryTypes = ["Book","Article","InCollection","InProceedings","Conference","PhdThesis","MastersThesis","TechReport"];
var entryTypeNames = ["Books","Peer-reviewed journal papers","Book chapters","Peer-reviewed conference papers","Abstract-reviewed papers and posters","Ph.D. dissertations","M.S. thesis","Technical reports"];
var keywordTopics = ["occker","mbrl","mbirl","sysid","delay","fes","nonsmooth","games","sheet-stamping"];
var keywordTopicNames = ["Occupation kernels and Liouville operators","Model-based reinforcement learning","Model-based inverse reinforcement learning","Data-driven modeling","Feedback control of systems with state and input delays","Functional electrical stimulation","Stability of nonsmooth systems","Differential games","Sheetmetal stamping"];

function initSearch() {
	// check for quick search table and searchfield
	if (!document.getElementById("my-refs")||!document.getElementById("quicksearch")) { return; }
	// load all the rows and sort into arrays
	content = document.getElementById("includedContent"); // global variable
	allRows = content.querySelectorAll("li"); // global variable
	liveRows = content.getElementsByTagName("li");
	numEntries = allRows.length; // global variable
	//find the query field
	qsfield = document.getElementById("qs_field"); // global variable
	// previous search term; used for speed optimization
	prevSearch = "";
	//find statistics location
	stats = document.getElementById("stat"); // global variable
	setStatistics(-1);
	// group entries by BibTeX entry types
	groupBy("entryType");
	// set up preferences
	initPreferences();
	// shows the searchfield
	document.getElementById("quicksearch").style.display = "block";
	// if searchFlag is set, perform a search as soon as the page is loaded
	// if not, wait until the onkeyup event in the searchfield
	if (document.getElementById("searchFlag") == null) {
		document.getElementById("qs_field").onkeyup = quickSearch;
	} else {
		searchRegExp = true;
		quickSearch(qsfield);
	}
	// add event listeners for buttons
	document.addEventListener("click", function (event) {
		if (event.target.parentElement==null) {
			return;
		}
		if (event.target.matches("[id$=togglebibtex]")||event.target.parentElement.matches("[id$=togglebibtex]")) {
			if (event.target.matches("[id$=togglebibtex]")) {
				toggleElement(event.target,event.target.parentElement.querySelector("div[class*=BiBTeX]"));
			} else {
				toggleElement(event.target.parentElement,event.target.parentElement.parentElement.querySelector("div[class*=BiBTeX]"));
			}
		}
		if (event.target.matches("[id=toggleSettings]")||event.target.parentElement.matches("[id=toggleSettings]")) {
			if (event.target.matches("[id=toggleSettings]")) {
				toggleElement(event.target,document.getElementById("settings"));
			} else {
				toggleElement(event.target.parentElement,document.getElementById("settings"));
			}
		}
		if (event.target.matches("[id=toggleBibliometrics]")||event.target.parentElement.matches("[id=toggleBibliometrics]")) {
			if (event.target.matches("[id=toggleBibliometrics]")) {
				toggleElement(event.target,document.getElementById("bibliometrics"));
			} else {
				toggleElement(event.target.parentElement,document.getElementById("bibliometrics"));
			}
		}
		if (event.target.matches(".toggleType")||event.target.parentElement.matches(".toggleType")) {
			if (event.target.matches(".toggleType")) {
				toggleList(event.target.id);
			} else {
				toggleList(event.target.parentElement.id);
			}
		}
		if (event.target.matches(".collapseAllType")||event.target.parentElement.matches(".collapseAllType")) {
			if (event.target.matches(".collapseAllType")) {
				collapseAllLists();
			} else {
				collapseAllLists();
			}
		}
		if (event.target.matches(".expandAllType")||event.target.parentElement.matches(".expandAllType")) {
			if (event.target.matches(".expandAllType")) {
				expandAllLists();
			} else {
				expandAllLists();
			}
		}
		if (event.target.getElementsByTagName("button")[0]!=null) {
			if (event.target.getElementsByTagName("button")[0].matches(".toggleType") && event.target.matches("span") ) {
				toggleList(event.target.getElementsByTagName("button")[0].id);
			}
		}
		if (event.target.matches("[class*=Reset]")) {
			clearQS();
		}
		/* if (event.target.matches("div[class=searchSettings]")) {
			updateSetting(event.target.getElementsByTagName("input")[0]);
			if (event.target.getElementsByTagName("input")[0].checked) {
				event.target.getElementsByTagName("input")[0].checked=false;
			} else {
				event.target.getElementsByTagName("input")[0].checked=true;
			}
		} */
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

function groupBy(groupChoice) {
	if (groupChoice == "Group By") {return;}
	oldData=document.getElementById("my-refs");
	if (oldData != null) {
		oldData.remove();
	}
	oldData=document.getElementById("includedContent");
	if (oldData != null) {
		while (oldData.firstChild) {
			oldData.removeChild(oldData.firstChild);
		}
	}
	groups = new Array();
	var groupIDs = new Array();
	for (let i = 0; i < allRows.length; i++) {
		var currentRow = allRows[i];
		var currentGroupList = new Array();
		if (groupChoice === "entryType") {
			currentGroupList[0] = currentRow.classList.item(1);
		} else if (groupChoice === "topicKeywords") {
			var currentGroupText = currentRow.querySelector("[class*=\"" + groupChoice + "\"]").textContent;
			currentGroupList = currentGroupText.split(" ");
			for( let k = currentGroupList.length-1; k >=0; k--){ 
				let cleanedID = currentGroupList[k].replace(",","");
				if (cleanedID === "Keywords:" || cleanedID === "scc" || cleanedID === "inprint" || cleanedID === "1page" || cleanedID === "2page" || cleanedID === "peer-reviewed" || cleanedID === "abstract-reviewed" || cleanedID === "afrl-fa8651-19-2-0009" || cleanedID === "nsf-1925147" || cleanedID === "afosr-fa9550-20-1-0127" || cleanedID === "onr-n00014-16-1-2091" || cleanedID === "nsf-2027999" || cleanedID === "knee-brace") {
					currentGroupList.splice(k, 1); 
				}
			}
		} else if (groupChoice === "workAuthor") {
			var currentGroupText = currentRow.querySelector("[class*=\"" + groupChoice + "\"]").textContent;
			currentGroupList = currentGroupText.split(", ");
		} else {
			var currentGroupText = new Array();
			currentGroupText[0] = currentRow.querySelector("[class*=\"" + groupChoice + "\"]").textContent;
			currentGroupList[0] = currentGroupText[0];
		}
		for (let j = 0; j < currentGroupList.length; j++) {
			if (groupChoice === "entryType") {
				var currentGroup = new Object();
				currentGroup.ID = currentGroupList[j];
				if (entryTypes.indexOf(currentGroup.ID) !== -1) {
					currentGroup.Name = entryTypeNames[entryTypes.indexOf(currentGroup.ID)];
				} else {
					currentGroup.Name = currentGroup.ID;
				}
			} else if (groupChoice === "workYear") {
				var currentGroup = new Object();
				if (currentGroupList[0] === "to appear") {
					currentGroup.ID = "toappear";
					currentGroup.Name = "To appear";
				} else {
					currentGroup.ID = currentGroupList[0];
					currentGroup.Name = currentGroupList[0];
				}
			} else if (groupChoice === "workAuthor") {
				var currentGroup = new Object();
				currentGroup.ID = currentGroupList[j].replace(/and\s/,"");
				currentGroup.ID = currentGroup.ID.replace(/[A-Z]\.\-[A-Z]\.\s/,"");
				currentGroup.ID = currentGroup.ID.replace(/([A-Z]\.\s){1,3}/,"");
				currentGroup.Name = currentGroupList[j].replace(/and\s/,"");
			} else if (groupChoice === "topicKeywords") {
				var currentGroup = new Object();
				currentGroup.ID = currentGroupList[j].replace(",","");;
				if (keywordTopics.indexOf(currentGroup.ID) !== -1) {
					currentGroup.Name = keywordTopicNames[keywordTopics.indexOf(currentGroup.ID)];
				} else {
					currentGroup.Name = currentGroup.ID;
				}
			} else {
				var currentGroup = new Object();
				currentGroup.ID = currentGroupList[j];
				currentGroup.Name = currentGroupList[j];
			}
			if (typeof currentGroup !== "undefined") {
				var currentIndex = groupIDs.indexOf(currentGroup.ID);
				if (currentIndex == -1) {
					groupIDs.push(currentGroup.ID);
					currentGroup.Entries = new Array(currentRow);
					groups.push(currentGroup);
				} else {
					groups[currentIndex].Entries.push(currentRow);
				}
			}
		}
	}
	groups.sort(
		function(a, b) {
			if (groupChoice === "entryType") {
				var aPosition = entryTypes.indexOf(a.ID);
				var bPosition = entryTypes.indexOf(b.ID);
				if (aPosition === -1) {aPosition = entryTypes.length + 1};
				if (bPosition === -1) {bPosition = entryTypes.length + 1};
				return aPosition - bPosition;
			}
			if (groupChoice === "workYear") {
				if (a.ID === "toappear") {var aYear = 10000} else {var aYear = parseInt(a.ID,10)};
				if (b.ID === "toappear") {var bYear = 10000} else {var bYear = parseInt(b.ID,10)};
				return bYear - aYear;
			}
			if (groupChoice === "workAuthor") {
				if (a.ID < b.ID) {
					return -1;
				}
				if (a.ID > b.ID) {
					return 1;
				}
				return 0;
			}
		}
	);
	var fragment = document.createDocumentFragment();
	groups.forEach(function(group,index) { 
		if(group.Entries.length !== 0) {
			var groupDiv = document.createElement("div");
			groupDiv.classList.add(group.ID);
			groupDiv.classList.add("notHidden");
			var groupHeading = document.createElement("h4");
			groupHeading.classList.add(group.ID);
			groupHeading.classList.add("notHidden");
			var groupHeadingText = document.createElement("span");
			groupHeadingText.appendChild(document.createTextNode(group.Name));
			groupHeadingText.classList.add("clickableText");
			groupHeading.appendChild(groupHeadingText);
			var groupIcon=document.createElement("i");
			groupIcon.classList.add("fas");
			groupIcon.classList.add("fa-angle-up");
			groupIcon.title="Hide List";
			var groupButton=document.createElement("button");
			groupButton.classList.add("toggleType");
			groupButton.classList.add("alt");
			groupButton.id=(group.ID);
			//groupButton.appendChild(document.createTextNode("\u00A0\u00A0"));
			groupButton.appendChild(groupIcon);
			groupButton.classList.add("toggleType");
			groupButton.classList.add("alt");
			groupHeadingText.appendChild(groupButton);
			if (index==0) {
				groupIcon=document.createElement("i");
				groupIcon.classList.add("fas");
				groupIcon.classList.add("fa-angle-double-up");
				groupIcon.title="Collapse all";
				var myButton=document.createElement("button");
				myButton.classList.add("collapseAllType");
				myButton.classList.add("alt");
				myButton.appendChild(groupIcon);
				groupHeadingText.appendChild(myButton);
				groupIcon=document.createElement("i");
				groupIcon.classList.add("fas");
				groupIcon.classList.add("fa-angle-double-down");
				groupIcon.title="Expand all";
				myButton=document.createElement("button");
				myButton.classList.add("expandAllType");
				myButton.classList.add("alt");
				myButton.appendChild(groupIcon);
				groupHeadingText.appendChild(myButton);
			}
			groupDiv.appendChild(groupHeading);
			var newList = document.createElement("ol");
			if (document.getElementById("searchFlag") == null) {
				newList.setAttribute("reversed", "reversed");
			}
			newList.classList.add(group.ID);
			newList.classList.add("notHidden");
			groupDiv.appendChild(newList);
			for (let i = 0; i < group.Entries.length; i++) {
				var cln = group.Entries[i].cloneNode(true);
				cln.classList.add("notHidden");
				var entryIcon=document.createElement("i");
				entryIcon.classList.add("fas");
				entryIcon.classList.add("fa-angle-down");
				entryIcon.title="Show List";
				var entryBiBTeXButton=document.createElement("button");
				entryBiBTeXButton.id=(cln.id + "togglebibtex");
				entryBiBTeXButton.appendChild(document.createTextNode(".bib "));
				entryBiBTeXButton.appendChild(entryIcon);
				entryBiBTeXButton.classList.add("Button");
				entryBiBTeXButton.classList.add("alt");
				entryBiBTeXButton.type="reset";
				var BiBTeXDiv=cln.querySelector("div[class*=BiBTeX]");
				cln.insertBefore(entryBiBTeXButton,BiBTeXDiv);
				newList.appendChild(cln);
				cln.querySelector("div").id=(cln.id + "bibtex");
			};
			fragment.appendChild(groupDiv);
		}
	});
	content.appendChild(fragment);
	redoQS();
};

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

function toggleList(clicked_id){
	if (typeof clicked_id !== "string") {clicked_id = clicked_id.toString};
	var togglebutton = document.getElementById(clicked_id)
	var toggleicon = togglebutton.querySelector("i");
	var olElement = content.querySelector("ol[class*=\"" + clicked_id + "\"]");
	if (olElement.classList.contains("zeroHeight") || olElement.classList.contains("initiallyHidden")){
		olElement.classList.remove("zeroHeight");
		olElement.classList.remove("initiallyHidden");
		olElement.classList.add("notHidden");
		expandSection(olElement);
		toggleicon.className = "fas fa-angle-up"
		toggleicon.title = "Hide List";
	} else {
		if (olElement.classList.contains("notHidden")) {
			olElement.classList.replace("notHidden","zeroHeight");
		} else {
			olElement.classList.add("zeroHeight");
		}
		collapseSection(olElement);
		toggleicon.className = "fas fa-angle-down";
		toggleicon.title = "Show List";
	}
}
function expandAllLists() {
	var buttonElements=document.querySelectorAll(".toggleType");
	for (let i = 0; i < buttonElements.length; i++) {
		var olElement=document.querySelector("ol[class*=\""  + buttonElements[i].id + "\"]");
		var iconElement=buttonElements[i].querySelector("i");
		if (olElement.classList.contains("zeroHeight")) {
			iconElement.classList.replace("fa-angle-down","fa-angle-up");
			expandSection(olElement);
			olElement.classList.remove("zeroHeight");
			olElement.classList.add("notHidden");
		}
	}
}
function collapseAllLists() {
	var buttonElements=document.querySelectorAll(".toggleType");
	for (let i = 0; i < buttonElements.length; i++) {
		var olElement=document.querySelector("ol[class*=\""  + buttonElements[i].id + "\"]");
		var iconElement=buttonElements[i].querySelector("i");
		if (!olElement.classList.contains("zeroHeight")) {
			if (olElement.classList.contains("notHidden")) {
				olElement.classList.replace("notHidden","zeroHeight");
			} else {
				olElement.classList.add("zeroHeight");
			}
			collapseSection(olElement);
			iconElement.classList.replace("fa-angle-up","fa-angle-down");
		}
	}
}
function quickSearch(){
	tInput = qsfield;
	if (tInput.value.length == 0) {
		showAll();
		setStatistics(-1);
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
	// count number of hits
	var hits = 0;
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
				hits++;
			} else {
				cRow.className = "entry hidden";
			}
		}
	}
	// update statistics
	setStatistics(hits);
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

function setStatistics (hits) {
	if(hits < 0) { hits=numEntries; }
	if(stats) { stats.firstChild.data = hits + "/" + numEntries}
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
	for (var i = 0; i < liveRows.length; i++){ liveRows[i].className = "entry notHidden"; }
	//var olElements = content.getElementsByTagName("ol");
	//for (var i=0; i<olElements.length; i++){ olElements[i].classList.replace("hidden","notHidden"); }
	//var buttons = content.querySelectorAll("button.toggleType > i");
	//for (var i=0; i<buttons.length; i++){ buttons[i].className = "fas fa-angle-up"; buttons[i].title = "Hide List"; }
	//var entryButtons = content.querySelectorAll("button[class*=Arrow]");
	//for (var i=0; i<entryButtons.length; i++){ 
		//var entryArrow = entryButtons[i].querySelector("i");
		//entryArrow.className = "fas fa-angle-down";
		//entryArrow.title = "Show List";
	//}
	// Remove/replace headers
	hideEmptyGroupHeadings();
}

function clearQS() {
	//qsfield.value = "";
	showAll();
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

function toggleElement(toggleButton,element){
	var iconElement=toggleButton.querySelector("i");
	if(element.classList.contains("zeroHeight") || element.classList.contains("initiallyHidden")){
		element.classList.remove("zeroHeight");
		element.classList.add("notHidden");
		if (element.classList.contains("initiallyHidden")) {
			element.classList.remove("initiallyHidden");
			element.style.height= 0 + "px";
		}
		expandSection(element);
		iconElement.classList.replace("fa-angle-down","fa-angle-up");
	} else {
		if (element.classList.contains("notHidden")) {
			element.classList.replace("notHidden","zeroHeight");
			collapseSection(element);
		} else {
			element.classList.add("zeroHeight");
			collapseSection(element);
		}
		iconElement.classList.replace("fa-angle-up","fa-angle-down");
	}
}

// This is the important part!

function collapseSection(element) {
	// get the height of the element's inner content, regardless of its actual size
	var sectionHeight = element.scrollHeight;
	
	// temporarily disable all css transitions
	var elementTransition = element.style.transition;
	element.style.transition = "";
	
	// on the next frame (as soon as the previous style change has taken effect),
	// explicitly set the element's height to its current pixel height, so we 
	// aren't transitioning out of 'auto'
	requestAnimationFrame(function() {
		element.style.height = sectionHeight + "px";
		element.style.paddingTop = 0 + "px";
		element.style.paddingBottom = 0 + "px";
		element.style.transition = elementTransition;
		
		// on the next frame (as soon as the previous style change has taken effect),
		// have the element transition to height: 0
		requestAnimationFrame(function() {
			element.style.height = 0 + "px";
			element.style.paddingTop = null;
			element.style.paddingBottom = null;
		});
	});
}

function expandSection(element) {
	// get the height of the element's inner content, regardless of its actual size
	var sectionHeight = element.scrollHeight;
	var sectionPaddingBottom = element.style.paddingBottom;
	var sectionPaddingTop = element.style.paddingTop;
	element.style.paddingBottom = 0 + "px";
	// have the element transition to the height of its inner content
	element.style.height = sectionHeight + sectionPaddingBottom  + "px";

	// when the next css transition finishes (which should be the one we just triggered)
	element.addEventListener("transitionend", function(e) {
		// remove this event listener so it only gets triggered once
		element.removeEventListener("transitionend", arguments.callee);
		
		// remove "height" from the element's inline styles, so it can return to its initial value
		element.style.height = null;
		element.style.paddingBottom = null;
	});
}