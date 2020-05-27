var request = new XMLHttpRequest();
request.open("GET", "https://scc-lab.github.io/scc.html", true);
request.onload = function() {
	if (this.status >= 200 && this.status < 400) {
	// Success!
		document.getElementById("includedContent").innerHTML=request.responseText;
		initPage();
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

// List of headings corresponding to BibTeX entry types
var entryTypes = ["Book","Article","InCollection","InProceedings","PhdThesis","MastersThesis","TechReport"];
var entryTypeNames = ["Books","Peer-reviewed journal papers","Book chapters","Peer-reviewed conference papers","Ph.D. dissertations","M.S. thesis","Technical reports"];

function initPage() {
	// check for data table
	if (!document.getElementById("my-refs")) { return; }
	// load all the rows and sort into arrays
	content = document.getElementById("includedContent"); // global variable
	allRows = content.querySelectorAll("li"); // global variable
	numEntries = allRows.length; // global variable
	// group entries by BibTeX entry types
	var piblicationDivs = document.querySelectorAll("[class*=topicPublications]");
	for (let i = 0; i < piblicationDivs.length; i++) {
		groupBy(piblicationDivs[i],"entryType",piblicationDivs[i].classList[1]);
	}
	// Listen for the back button/click to go back event
	window.addEventListener("popstate", function(event) {
		if (event.state) {
			if (event.state.closePublications) { // Event is to close publications page
				var nodeTitleElement=document.querySelector(".node-title");//Specific to okstate.edu
				var pageTitleElement=document.querySelector(".page-title");//Specific to okstate.edu
				if (pageTitleElement) { //Specific to okstate.edu
					pageTitleElement.textContent=pageTitlePrevious;
				}
				if (nodeTitleElement) { //Specific to okstate.edu
					nodeTitleElement.textContent=nodeTitlePrevious;
				}
				var topicElements=document.querySelectorAll(".fullScreen");
				for (let i = 0; i < topicElements.length; i++) {
					if (i == 0) {
						var topicKeyword=topicElements[i].classList[1];
						expandAllLists(topicKeyword);
					}
					topicElements[i].classList.remove("fullScreen");
				}
				history.back();
				var hiddenPage = document.querySelector(".researchContainer");
				hiddenPage.style.height = "";
				hiddenPage.style.overflow = "";
				return;
			}
		}
	});
	document.addEventListener("click", function (event) {
		if (event.target.parentElement==null) {
			return;
		}
		if (event.target.matches("[id$=togglebibtex]")||event.target.parentElement.matches("[id$=togglebibtex]")) {
			if (event.target.matches("[id$=togglebibtex]")) {
				toggleElement(event.target,event.target.parentElement.querySelector("div[class*=BiBTeX]"),40);
			} else {
				toggleElement(event.target.parentElement,event.target.parentElement.parentElement.querySelector("div[class*=BiBTeX]"),40);
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
			var topicDetailsElement=event.target.closest(".topicDetails");
			var topicKeyword=topicDetailsElement.classList[1];
			if (event.target.matches(".collapseAllType")) {
				collapseAllLists(topicKeyword);
			} else {
				collapseAllLists(topicKeyword);
			}
		}
		if (event.target.matches(".expandAllType")||event.target.parentElement.matches(".expandAllType")) {
			var topicDetailsElement=event.target.closest(".topicDetails");
			var topicKeyword=topicDetailsElement.classList[1];
			if (event.target.matches(".expandAllType")) {
				expandAllLists(topicKeyword);
			} else {
				expandAllLists(topicKeyword);
			}
		}
//		if (event.target.getElementsByTagName("button")[0]!=null) {
//			if (event.target.getElementsByTagName("button")[0].matches(".toggleType") && event.target.matches("span") ) {
//				toggleList(event.target.getElementsByTagName("button")[0].id);
//			}
//		}
//		if (event.target.matches(":not(.showText)")) {
//			var titleElement=document.querySelector(".topicCardFlex.showText");
//			if (titleElement) {
//				titleElement.classList.remove("showText");
//			}
//		}
//		if (event.target.matches(".topicCardFlex")) {
//			event.target.classList.add("showText");
//			return;
//		}
		if (event.target.matches(".hiddenText")) {
			history.back();
			return;
		}
		if (event.target.matches(".hiddenFullScreenText") || event.target.matches(".topicCardFlex")){
			var topicElements=document.querySelectorAll("." + event.target.classList[1] + "");
			var titleElement=document.querySelector(".topicTitle." + event.target.classList[1] + "");
			var titleText=titleElement.textContent;
			//------------------Specific to okstate.edu-------------------
			var nodeTitleElement=document.querySelector(".node-title");
			var pageTitleElement=document.querySelector(".page-title");
			if (pageTitleElement) {
				pageTitlePrevious = pageTitleElement.textContent; // Global Variable
				pageTitleElement.textContent=titleText; 
			}
			if (nodeTitleElement) {
				nodeTitlePrevious = nodeTitleElement.textContent; // Global Variable
				nodeTitleElement.textContent=titleText;
			}
			//------------------------------------------------------------
			var closePublications = new Object();
			closePublications.ID = "closePublications"
			history.pushState({closePublications}, '', '');
			history.pushState({closePublications}, '', '');
			window.scrollTo(0,0); 
			for (let i = 0; i < topicElements.length; i++) {
				topicElements[i].classList.add("fullScreen");
			}
			var hiddenPage = document.querySelector(".researchContainer");
			var topicTextElement=document.querySelector(".topicText." + event.target.classList[1] + "");
			var topicPublicationsElement=document.querySelector(".topicPublications." + event.target.classList[1] + "");
			hiddenPage.style.height = +topicTextElement.offsetHeight + +topicPublicationsElement.offsetHeight + 60 + "px";
			hiddenPage.style.overflow = "hidden";
			return;
		}
	}, false);
}

function groupBy(targetDiv,groupChoice,keywordName) {
	if (typeof keywordName === 'undefined') { keywordName = "" };
	oldData=document.getElementById("my-refs");
	if (oldData != null) {
		oldData.remove();
	}
	oldData=document.getElementById("includedContent");
	if (oldData != null) {
		oldData.remove();
	}
	var groups = new Array();
	var groupIDs = new Array();
	for (let i = 0; i < allRows.length; i++) {
		var currentRow = allRows[i];
		var keywordString = currentRow.querySelector("[class*=topicKeywords]").textContent;
		if (!keywordString.includes(keywordName)) {
			continue;
		}
		var currentGroupList = new Array();
		if (groupChoice === "entryType") {
			currentGroupList[0] = currentRow.classList.item(1);
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
		}
	);
	groups.forEach(function(group,index) { 
		if(group.Entries.length !== 0) {
			var groupDiv = document.createElement("div");
			groupDiv.classList.add(keywordName + group.ID);
			groupDiv.classList.add("notHidden");
			var groupHeading = document.createElement("h4");
			groupHeading.classList.add(keywordName + group.ID);
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
			groupButton.id=(keywordName + group.ID);
			groupButton.appendChild(document.createTextNode("\u00A0\u00A0"));
			groupButton.appendChild(groupIcon);
			groupHeadingText.appendChild(groupButton);
			if (index==0) {
				groupIcon=document.createElement("i");
				groupIcon.classList.add("fas");
				groupIcon.classList.add("fa-angle-double-up");
				groupIcon.title="Collapse all";
				var myButton=document.createElement("button");
				myButton.classList.add("collapseAllType");
				myButton.appendChild(groupIcon);
				groupHeadingText.appendChild(myButton);
				groupIcon=document.createElement("i");
				groupIcon.classList.add("fas");
				groupIcon.classList.add("fa-angle-double-down");
				groupIcon.title="Expand all";
				myButton=document.createElement("button");
				myButton.classList.add("expandAllType");
				myButton.appendChild(groupIcon);
				groupHeadingText.appendChild(myButton);
			}
			groupDiv.appendChild(groupHeading);
			var newList = document.createElement("ol");
			newList.classList.add(keywordName + group.ID);
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
				entryBiBTeXButton.id=(keywordName + cln.id + "togglebibtex");
				entryBiBTeXButton.appendChild(document.createTextNode(".bib "));
				entryBiBTeXButton.appendChild(entryIcon);
				entryBiBTeXButton.classList.add("Button");
				entryBiBTeXButton.classList.add("Arrow");
				entryBiBTeXButton.type="reset";
				var BiBTeXDiv=cln.querySelector("div[class*=BiBTeX]");
				cln.insertBefore(entryBiBTeXButton,BiBTeXDiv);
				newList.appendChild(cln);
				cln.querySelector("div").id=(keywordName + cln.id + "bibtex");
			};
			targetDiv.appendChild(groupDiv);
		}
	});
};

function hideEmptyGroupHeadings() {
	groups.forEach(function(group,index) { 
		var groupDiv = document.querySelector("div[class*=\"" + group.ID + "\"]");
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
	var togglebutton = document.getElementById(clicked_id);
	var toggleicon = togglebutton.querySelector("i");
	var olElement = document.querySelector("ol[class*=\"" + clicked_id + "\"]");
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

function expandAllLists(topicKeyword) {
	var containerElement=document.querySelector(".topicCardFlex." + topicKeyword + "");
	var buttonElements=containerElement.querySelectorAll(".toggleType");
	for (let i = 0; i < buttonElements.length; i++) {
		var olElement=containerElement.querySelector("ol[class*=\"" + buttonElements[i].id + "\"]");
		var iconElement=buttonElements[i].querySelector("i");
		if (olElement.classList.contains("zeroHeight")) {
			iconElement.classList.replace("fa-angle-down","fa-angle-up");
			expandSection(olElement);
			olElement.classList.remove("zeroHeight");
			olElement.classList.add("notHidden");
		}
	}
}

function collapseAllLists(topicKeyword) {
	var containerElement=document.querySelector(".topicCardFlex." + topicKeyword + "");
	var buttonElements=containerElement.querySelectorAll(".toggleType");
	for (let i = 0; i < buttonElements.length; i++) {
		var olElement=containerElement.querySelector("ol[class*=\"" + buttonElements[i].id + "\"]");
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

function toggleElement(toggleButton,element,slack){
	if (!slack) {slack=0}
	var iconElement=toggleButton.querySelector("i");
	if(element.classList.contains("zeroHeight") || element.classList.contains("initiallyHidden")){
		element.classList.remove("zeroHeight");
		element.classList.add("notHidden");
		if (element.classList.contains("initiallyHidden")) {
			element.classList.remove("initiallyHidden");
			element.style.height= 0 + "px";
		}
		expandSection(element,slack);
		iconElement.classList.replace("fa-angle-down","fa-angle-up");
	} else {
		if (element.classList.contains("notHidden")) {
			element.classList.replace("notHidden","zeroHeight");
			collapseSection(element,slack);
		} else {
			element.classList.add("zeroHeight");
			collapseSection(element,slack);
		}
		iconElement.classList.replace("fa-angle-up","fa-angle-down");
	}
}

function collapseSection(element,slack) {
	if (!slack) {slack=0}
	// get the height of the element's inner content, regardless of its actual size
	var sectionHeight = element.scrollHeight;
	
	// temporarily disable all css transitions
	var elementTransition = element.style.transition;
	element.style.transition = '';
	
	// on the next frame (as soon as the previous style change has taken effect),
	// explicitly set the element's height to its current pixel height, so we 
	// aren't transitioning out of 'auto'
	var topicDetailsElement=element.closest(".topicDetails");
	if (topicDetailsElement) {
		if (topicDetailsElement.classList.contains("fullScreen")) {
			var hiddenPage = document.querySelector(".researchContainer");
			var topicTextElement=topicDetailsElement.querySelector(".topicText");
			var topicPublicationsElement=topicDetailsElement.querySelector(".topicPublications");
			var hiddenPageHeight=parseInt(hiddenPage.style.height, 10);
			//hiddenPage.style.transition="height 0.4s";
		}
	}
	if (topicDetailsElement) {
				hiddenPage.style.height = hiddenPageHeight - sectionHeight - slack + "px";
	}
	requestAnimationFrame(function() {
		element.style.height = sectionHeight + 'px';
		element.style.paddingTop = 0 + 'px';
		element.style.paddingBottom = 0 + 'px';
		element.style.transition = elementTransition;
		
		// on the next frame (as soon as the previous style change has taken effect),
		// have the element transition to height: 0
		requestAnimationFrame(function() {
			element.style.height = 0 + 'px';
			element.style.paddingTop = null;
			element.style.paddingBottom = null;
		});
	});		
}

function expandSection(element,slack) {
	if (!slack) {slack=0}
	// get the height of the element's inner content, regardless of its actual size
	var sectionHeight = element.scrollHeight;
	//element.style.paddingBottom = 0 + "px";
	// have the element transition to the height of its inner content
	element.style.height = sectionHeight + 'px';
	var topicDetailsElement=element.closest(".topicDetails");
	if (topicDetailsElement) {
		if (topicDetailsElement.classList.contains("fullScreen")) {
			var hiddenPage = document.querySelector(".researchContainer");
			//hiddenPage.style.transition="height 0.1s";
			var topicTextElement=topicDetailsElement.querySelector(".topicText");
			var topicPublicationsElement=topicDetailsElement.querySelector(".topicPublications");
			var hiddenPageHeight=parseInt(hiddenPage.style.height, 10);
			hiddenPage.style.height = hiddenPageHeight + element.scrollHeight + slack + "px";
		}
	}
	// when the next css transition finishes (which should be the one we just triggered)
	element.addEventListener('transitionend', function(e) {
		// remove this event listener so it only gets triggered once
		element.removeEventListener('transitionend', arguments.callee);
		
		// remove "height" from the element's inline styles, so it can return to its initial value
		element.style.height = null;
		element.style.paddingBottom = null;
		element.style.paddingBottom = null;
	});
}