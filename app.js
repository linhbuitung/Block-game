const inputButton = document.getElementById("button");
console.log(inputButton);
const rowInput = document.getElementById("rowInput");
const colInput = document.getElementById("colInput");
const urlInput = document.getElementById("urlInput");
const playground = document.getElementById("img-playground");
const fullImg = document.getElementById("full-img");
let finishCheck = true;
let success = false;
let score = 0;

inputButton.onclick = function () {
	if (
		finishCheck == true &&
		checkValid(urlInput.value, rowInput.value, colInput.value)
	) {
		let url;
		finishCheck = false;
		if (urlInput.value == "") {
			url =
				"https://gonintendo.com/uploads/file_upload/upload/78509/Switch_OriWW_03.jpg";
		} else {
			url = urlInput.value;
		}
		var img = new Image();
		img.src = url;
		countDown();
		setTimeout(function () {
			createFlex(img.height, img.width, url);
			randomPlayGround();
			addDrag();
			displayTimer();
			enableMoveBlock();
		}, 3000);
	}
};

function getMeta(url) {
	var img = new Image();
	img.onload = function () {
		alert(this.width + " " + this.height);
	};
	img.src = url;
}

function countDown() {
	const timerStart = document.getElementById("time-start");
	const clockStart = document.getElementById("starter-clock");
	const overlay = document.getElementById("overlay");
	overlay.style.display = "block";
	clockStart.style.display = "block";
	timerStart.innerHTML = "3";
	setTimeout(function () {
		timerStart.innerHTML = "2";
		setTimeout(function () {
			timerStart.innerHTML = "1";
			setTimeout(function () {
				clockStart.style.display = "none";
				overlay.style.display = "none";
			}, 1000);
		}, 1000);
	}, 1000);
}

function createFlex(srcHeight, srcWidth, url) {
	let row = rowInput.value;
	let col = colInput.value;
	if (row == "") {
		row = 3;
	}
	if (col == "") {
		col = 3;
	}

	let playgroundHeight = (srcHeight / srcWidth) * playground.offsetWidth + "px";
	playground.style.height = playgroundHeight;

	const width = playground.offsetWidth / col;
	const height = ((srcHeight / srcWidth) * playground.offsetWidth) / row;
	let posLeftBG = 0;
	let posTopBG = 0;
	let posLeft = 0;
	let posTop = 0;
	for (let i = 0; i < row * col; i++) {
		let imgPart = document.createElement("div");
		imgPart.className = "img-part";
		imgPart.draggable = "true";
		imgPart.style.backgroundImage = "url(" + url + ")";
		imgPart.style.width = width + "px";
		imgPart.style.height = height + "px";
		imgPart.style.left = posLeft + "px";
		imgPart.style.top = posTop + "px";
		imgPart.style.zIndex = "0";
		imgPart.style.backgroundSize = col * 100 + "%";
		imgPart.style.backgroundPosition = posLeftBG + "% " + posTopBG + "%";
		imgPart.style.order = i;
		playground.appendChild(imgPart);
		if ((i + 2) % col == 0) {
			posLeftBG = 100;
			posLeft = width * (col - 1);
		} else if ((i + 1) % col == 0) {
			if (i >= (row - 1) * col) {
				posTopBG = 100;
			} else {
				posTopBG += 100 / (row - 1);
			}
			posLeft = 0;
			posTop += height;
			posLeftBG = 0;
		} else {
			if (i >= (row - 1) * col) {
				posTopBG = 100;
			}
			posLeftBG += 100 / (col - 1);
			posLeft += width;
		}
	}
}

function randomPlayGround() {
	const partList = document.getElementsByClassName("img-part");
	for (let i = 0; i < partList.length; i++) {
		let randomOne = Math.floor(Math.random() * (partList.length - 1) + 0.1);
		let randomTwo = Math.floor(Math.random() * (partList.length - 1) + 0.1);

		if (randomOne == randomTwo) {
			continue;
		} else {
			swapElement(partList[randomOne], partList[randomTwo]);
			let temp = partList[randomOne];
			partList[randomOne] = partList[randomTwo];
			partList[randomTwo] = temp;
		}
	}
}

function addDrag() {
	const partList = document.getElementsByClassName("img-part");
	for (let i = 0; i < partList.length; i++) {
		dragElement(partList[i]);
		dragElementTouch(partList[i]);
	}
}

function dragElement(elmnt) {
	let pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	let originPosLeft = elmnt.style.left;
	let originPosTop = elmnt.style.top;

	elmnt.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		originPosLeft = elmnt.style.left;
		originPosTop = elmnt.style.top;
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		elmnt.style.zIndex = "1";
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = elmnt.offsetTop - pos2 + "px";
		elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
	}

	function closeDragElement() {
		elmnt.style.zIndex = "0";
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
		if (checkOverlap(elmnt) == false) {
			elmnt.style.top = originPosTop;
			elmnt.style.left = originPosLeft;
		} else {
			let swapEl = checkOverlap(elmnt);
			elmnt.style.top = originPosTop;
			elmnt.style.left = originPosLeft;
			swapElement(swapEl, elmnt);
			score++;
			finishCheck = checkFinish();
			endGame();
		}
	}
}
function checkOverlap(element) {
	const partList = document.getElementsByClassName("img-part");
	const leftCenter = element.offsetLeft + element.offsetWidth / 2;
	const topCenter = element.offsetTop + element.offsetHeight / 2;
	for (let i = 0; i < partList.length; i++) {
		if (partList[i] == element) {
			continue;
		} else {
			let leftCenterCheck =
				partList[i].offsetLeft + partList[i].offsetWidth / 2;
			let topCenterCheck = partList[i].offsetTop + partList[i].offsetHeight / 2;

			if (
				leftCenter > leftCenterCheck - partList[i].offsetWidth / 2 &&
				leftCenter < leftCenterCheck + partList[i].offsetWidth / 2 &&
				topCenter > topCenterCheck - partList[i].offsetHeight / 2 &&
				topCenter < topCenterCheck + partList[i].offsetHeight / 2
			) {
				return partList[i];
			}
		}
	}
	return false;
}
function swapElement(elementOne, elementTwo) {
	elementOne.style.zIndex = "1";
	elementTwo.style.zIndex = "1";
	elementOne.style.transitionDuration = "0.5s";
	elementTwo.style.transitionDuration = "0.5s";
	setTimeout(function () {
		elementOne.style.transitionDuration = "0s";
		elementTwo.style.transitionDuration = "0s";
		elementOne.style.zIndex = "0";
		elementTwo.style.zIndex = "0";
	}, 500);
	let temp = elementOne.style.left;
	elementOne.style.left = elementTwo.style.left;
	elementTwo.style.left = temp;
	temp = elementOne.style.top;
	elementOne.style.top = elementTwo.style.top;
	elementTwo.style.top = temp;
	temp = elementOne.style.order;
	elementOne.style.order = elementTwo.style.order;
	elementTwo.style.order = temp;
}

function checkFinish() {
	let childList = playground.children;
	for (let i = 0; i < childList.length; i++) {
		if (childList[i].style.order != i) {
			return false;
		}
	}
	success = true;

	return true;
}

function displayTimer() {
	let i = 60;
	setTimer(i);
}
function setTimer(i) {
	const clock = document.getElementById("clock");

	setTimeout(function () {
		i--; //  increment the counter
		let displayText;
		if (i >= 10 && finishCheck == false) {
			displayText = "00:" + i;
			clock.children[0].innerHTML = displayText;
			setTimer(i);
		} else if (i > 0 && finishCheck == false) {
			displayText = "00:0" + i;
			clock.children[0].innerHTML = displayText;
			setTimer(i);
		} else {
			displayText = "00:0" + i;
			finishCheck = true;
			endGame();
		}
	}, 1000);
}

function endGame() {
	const overlay = document.getElementById("overlay");
	const endDiv = document.getElementById("finish-post");
	if (finishCheck == true) {
		if (success == true) {
			endDiv.children[0].innerHTML = "You win!";
		} else {
			endDiv.children[0].innerHTML = "You lose!";
		}
		disableMoveBlock();
		endDiv.style.display = "block";
		overlay.style.display = "block";

		endDiv.children[1].innerHTML = "Your Steps: " + score;
	}
}

function enableMoveBlock() {
	const moveBlock = document.getElementById("move-block");
	moveBlock.style.display = "block";
	moveBlock.style.animation = "moveBlock 5s linear infinite";
}
function disableMoveBlock() {
	const moveBlock = document.getElementById("move-block");
	moveBlock.style.display = "none";
	moveBlock.style.animation = "none";
}

function dragElementTouch(elmnt) {
	let pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	let originPosLeft = elmnt.style.left;
	let originPosTop = elmnt.style.top;

	elmnt.ontouchstart = dragMouseDown;

	function dragMouseDown(e) {
		console.log(e.touches[0].clientX + " " + e.touches[0].clientX);
		originPosLeft = elmnt.style.left;
		originPosTop = elmnt.style.top;

		// get the mouse cursor position at startup:
		pos3 = e.touches[0].clientX;
		pos4 = e.touches[0].clientY;
		document.ontouchend = closeDragElement;
		// call a function whenever the cursor moves:
		elmnt.ontouchmove = elementDrag;
	}

	function elementDrag(e) {
		elmnt.style.zIndex = "1";
		// calculate the new cursor position:
		pos1 = pos3 - e.touches[0].clientX;
		pos2 = pos4 - e.touches[0].clientY;
		pos3 = e.touches[0].clientX;
		pos4 = e.touches[0].clientY;
		// console.log(e.clientX + " " + e.clientX);
		// set the element's new position:
		elmnt.style.top = elmnt.offsetTop - pos2 + "px";
		elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
	}

	function closeDragElement() {
		elmnt.style.zIndex = "0";
		// stop moving when mouse button is released:
		document.ontouchend = null;
		document.ontouchmove = null;
		if (checkOverlap(elmnt) == false) {
			elmnt.style.top = originPosTop;
			elmnt.style.left = originPosLeft;
		} else {
			let swapEl = checkOverlap(elmnt);
			elmnt.style.top = originPosTop;
			elmnt.style.left = originPosLeft;
			swapElement(swapEl, elmnt);
			score++;
			finishCheck = checkFinish();
			endGame();
		}
	}
}

const isImgLink = (url) => {};

function checkValid(url, row, col) {
	if (url == "" && row == "" && col == "") {
		return true;
	}
	let check = false;

	if (typeof url !== "string") {
		return false;
	} else if (
		url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) !== null
	) {
		check = true;
	} else {
		return false;
	}
	if (isNaN(row) || isNaN(col)) {
		return false;
	}
	if (check == true) {
		return true;
	}
}
