/* var request = new XMLHttpRequest();
request.open("GET", "https://scc-lab.github.io/scc.html", true);
request.onload = function() {
	if (this.status >= 200 && this.status < 400) {
	// Success!
		document.getElementById("includedContent").innerHTML=request.responseText;
		if (document.getElementById("quicksearch") != null) {
			initSearch();
		}
		initPage();
	} else {
		alert("Received bib file... error retrieving bibliography information");
	}
};
request.onerror = function() {
	alert("Error retrieving the bib file");
};
request.send(); */

fetch('https://scc-lab.github.io/scc.html')
	.then(function (response) {
		return response.text();
	})
	.then(function (data) {
		document.getElementById("includedContent").innerHTML=data;
		if (document.getElementById("quicksearch") != null) {
			initSearch();
		};
		initPage();
	})
	.catch(function (err) {
		alert("Error retrieving the bib file");
	});

var entryTypes = ["Book","Article","InCollection","InProceedings","Conference","PhdThesis","MastersThesis","TechReport"];
var entryTypeNames = ["Books","Peer-reviewed journal papers","Book chapters","Peer-reviewed conference papers","Abstract-reviewed papers and posters","Ph.D. dissertations","M.S. thesis","Technical reports"];
var keywordTopics = ["occker","mbrl","mbirl","sysid","delay","fes","nonsmooth","games","sheet-stamping"];
var keywordTopicNames = ["Occupation kernels and Liouville operators","Model-based reinforcement learning","Model-based inverse reinforcement learning","Data-driven modeling","Feedback control of systems with state and input delays","Functional electrical stimulation","Stability of nonsmooth systems","Differential games","Sheetmetal stamping"];

function initPage() {
	// check for bib data
	if (!document.getElementById("my-refs")) { return; }
	// load all the rows and sort into arrays
	content = document.getElementById("includedContent"); // global variable
	allRows = content.querySelectorAll("li"); // global variable
	liveRows = content.getElementsByTagName("li"); // global variable
	numEntries = allRows.length; // global variable
	// group entries by BibTeX entry types
	var publicationDivs = document.querySelectorAll("[class*=itemPublications]");
	if (publicationDivs.length == 0) {
		groupBy("entryType");
	} else {
		for (let i = 0; i < publicationDivs.length; i++) {
			currentPublicationDiv = publicationDivs[i];
			filterName = currentPublicationDiv.querySelector("#filterName").textContent;
			groupBy("entryType",currentPublicationDiv,currentPublicationDiv.classList[1],filterName);
		}
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
	}, false);
};

function groupBy(groupChoice,targetDiv,filterChoice,filterName) {
	if (groupChoice == "Group By") {return;}
	if (typeof targetDiv === 'undefined') { targetDiv = content };
	if (typeof filterName === 'undefined') { filterName = "" };
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
		if (typeof filterChoice != 'undefined') { 
			var filterString = currentRow.querySelector("[class*=\"" + filterChoice + "\"]").textContent;
			if (!filterString.includes(filterName)) {
				continue;
			}
		};
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
	targetDiv.appendChild(fragment);
	if (document.getElementById("quicksearch") != null) {
		redoQS();
	}
};

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
};

function toggleList(clicked_id){
	if (typeof clicked_id !== "string") {clicked_id = clicked_id.toString};
	var togglebutton = document.getElementById(clicked_id)
	var toggleicon = togglebutton.querySelector("i");
	var parentDiv = togglebutton.closest("div");
	var olElement = parentDiv.querySelector("ol[class*=\"" + clicked_id + "\"]");
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
};

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
};

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
};

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
};

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
};