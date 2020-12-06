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
var entryTypes = ["Book","Article","InCollection","InProceedings","Conference","PhdThesis","MastersThesis","TechReport"];
var entryTypeNames = ["Books","Peer-reviewed journal papers","Book chapters","Peer-reviewed conference papers","Abstract-reviewed papers and posters","Ph.D. dissertations","M.S. thesis","Technical reports"];
function initPage() {
	// check for data table
	if (!document.getElementById("my-refs")) { return; }
	// load all the rows and sort into arrays
	content = document.getElementById("includedContent"); // global variable
	allRows = content.querySelectorAll("li"); // global variable
	numEntries = allRows.length; // global variable
	// group entries by BibTeX entry types
	var publicationDivs = document.querySelectorAll("[class*=itemPublications]");
	for (let i = 0; i < publicationDivs.length; i++) {
		groupBy(publicationDivs[i],"topicKeyword",publicationDivs[i].classList[1]);
	}
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
			var itemPublicationsElement=event.target.closest(".itemPublications");
			var topicKeyword=itemPublicationsElement.classList[1];
			if (event.target.matches(".collapseAllType")) {
				collapseAllLists(topicKeyword);
			} else {
				collapseAllLists(topicKeyword);
			}
		}
		if (event.target.matches(".expandAllType")||event.target.parentElement.matches(".expandAllType")) {
			var itemPublicationsElement=event.target.closest(".itemPublications");
			var topicKeyword=itemPublicationsElement.classList[1];
			if (event.target.matches(".expandAllType")) {
				expandAllLists(topicKeyword);
			} else {
				expandAllLists(topicKeyword);
			}
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
		var keywordString = currentRow.querySelector("[class*=\"" + groupChoice + "\"]").textContent;
		if (!keywordString.includes(keywordName)) {
			continue;
		}
		var currentGroupList = new Array();
		currentGroupList[0] = currentRow.classList.item(1);
		for (let j = 0; j < currentGroupList.length; j++) {
			var currentGroup = new Object();
			currentGroup.ID = currentGroupList[j];
			if (entryTypes.indexOf(currentGroup.ID) !== -1) {
				currentGroup.Name = entryTypeNames[entryTypes.indexOf(currentGroup.ID)];
			} else {
				currentGroup.Name = currentGroup.ID;
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
			var aPosition = entryTypes.indexOf(a.ID);
			var bPosition = entryTypes.indexOf(b.ID);
			if (aPosition === -1) {aPosition = entryTypes.length + 1};
			if (bPosition === -1) {bPosition = entryTypes.length + 1};
			return aPosition - bPosition;
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
			groupButton.classList.add("alt");
			groupButton.id=(keywordName + group.ID);
			groupButton.appendChild(groupIcon);
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
				entryBiBTeXButton.classList.add("alt");
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
	var containerElement=document.querySelector(".itemPublications." + topicKeyword + "");
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
	var containerElement=document.querySelector(".itemPublications." + topicKeyword + "");
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
	var itemPublicationsElement=element.closest(".itemPublications");
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