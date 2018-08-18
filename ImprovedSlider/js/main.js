const cs = new CSInterface();
const menu_RGB = "menu_RGB";
const menu_HSB = "menu_HSB";
const FLYOUT_MENU_XML_RGB = `
<Menu>
	<MenuItem Id="menu_RGB" Label="RGB" Enabled="false" Checked="true"/>
	<MenuItem Id="menu_HSB" Label="HSB" Enabled="true" Checked="false"/>
</Menu>`;
const FLYOUT_MENU_XML_HSB = `
<Menu>
	<MenuItem Id="menu_RGB" Label="RGB" Enabled="true" Checked="false"/>
	<MenuItem Id="menu_HSB" Label="HSB" Enabled="false" Checked="true"/>
</Menu>`;

const ColorMode = {
	RGB: "RGB",
	HSB: "HSB"
};

const CONTAINER = document.getElementById("container");
const BODY = document.getElementById("body");

const SLIDER_LABEL0 = document.getElementById("sliderLabel0");
const SLIDER_LABEL1 = document.getElementById("sliderLabel1");
const SLIDER_LABEL2 = document.getElementById("sliderLabel2");
const SLIDER_LABELS = [SLIDER_LABEL0, SLIDER_LABEL1, SLIDER_LABEL2];

const TEXTBOX_LABEL0 = document.getElementById("textBoxLabel0")
const TEXTBOX_LABEL1 = document.getElementById("textBoxLabel1")
const TEXTBOX_LABEL2 = document.getElementById("textBoxLabel2")
const TEXTBOX_LABELS = [TEXTBOX_LABEL0, TEXTBOX_LABEL1, TEXTBOX_LABEL2];

const SLIDER0 = document.getElementById("slider0");
const SLIDER1 = document.getElementById("slider1");
const SLIDER2 = document.getElementById("slider2");
const SLIDERS = [SLIDER0, SLIDER1, SLIDER2];
const GREYSLIDER = document.getElementById("greyscaleSlider");

const TEXT0 = document.getElementById("textBox0");
const TEXT1 = document.getElementById("textBox1");
const TEXT2 = document.getElementById("textBox2");
const TEXT_BOXES = [TEXT0, TEXT1, TEXT2];

const FG_COLOR_BOX = document.getElementById("fgColorBox");
const BG_COLOR_BOX = document.getElementById("bgColorBox");

let isFGSelected = true;
var globalColorMode = ColorMode.RGB;
var SETD_INT = 0;

init(); //entry point


function init() {
	//setup greysteps TODO use js to generate
	for(let i = 0; i < 6; i++) {
		const value = i == 5 ? 100 : (100/6)*i;
		const v = parseInt(Math.round((value/100)*255));
		const greyStep = document.getElementById("greyStep"+i);
		greyStep.style.backgroundColor = hsl(0, 0, value);

		greyStep.addEventListener("mousedown", function(event) {
			setBoxColor(v, v, v, ColorMode.RGB, isFGSelected);
			setPSColor(v, v, v, ColorMode.RGB, isFGSelected);
			if (globalColorMode == ColorMode.RGB) { //TODO refactor
				updateSliderElements(v, v, v, globalColorMode);
			} else {
				updateSliderValues(0, 0, parseInt(Math.round((v/255)*100)));
			}
		});
	}
	
	//setup flyout menu
	const xml = globalColorMode == ColorMode.RGB ? FLYOUT_MENU_XML_RGB : FLYOUT_MENU_XML_HSB;
	cs.setPanelFlyoutMenu(xml);
	cs.addEventListener("com.adobe.csxs.events.flyoutMenuClicked", onFlyoutMenuClicked);

	// Add Listeners
	
	cs.evalScript("getCharIDToTypeID(\"copy\")", function(result) {
		SETD_INT = result;
		let gExtensionID = cs.getExtensionID();
		// cs.addEventListener("PhotoshopJSONCallback" + gExtensionID, myCallback);

		let event = new CSEvent("com.adobe.PhotoshopRegisterEvent", "APPLICATION");
		// let event = new CSEvent("com.adobe.PhotoshopRegisterEvent", SETD_INT);
		event.extensionId = gExtensionID;
		event.data = ""+SETD_INT;
		cs.dispatchEvent(event);
		cs.addEventListener("PhotoshopCallback", psCallback);
	});
	
	SLIDER0.addEventListener("input", onSliderDrag);
	SLIDER1.addEventListener("input", onSliderDrag);
	SLIDER2.addEventListener("input", onSliderDrag);
	GREYSLIDER.addEventListener("input", onGreyscaleSliderChanged);
	SLIDER0.addEventListener("change", onSliderUp);
	SLIDER1.addEventListener("change", onSliderUp);
	SLIDER2.addEventListener("change", onSliderUp);
	GREYSLIDER.addEventListener("change", onSliderUp);
	
	TEXT0.addEventListener("input", onTextChange);
	TEXT1.addEventListener("input", onTextChange);
	TEXT2.addEventListener("input", onTextChange);
	document.addEventListener("keypress", onKeyPress);
	
	FG_COLOR_BOX.addEventListener("click", onFGSelected);
	BG_COLOR_BOX.addEventListener("click", onBGSelected);
	BODY.addEventListener("mouseenter", onMouseEnter);
	
	//set up color mode details
	if (globalColorMode == ColorMode.RGB) {
		setRGBMode();
	} else if (globalColorMode == ColorMode.HSB) {
		setHSBMode();
	}
	
	// update sliders to match photoshop
	updateToMatchPS();
}

/* Event callbacks */

function onMouseEnter() {
	updateToMatchPS();
}

function psCallback(event) {
	// console.log(event);
	updateToMatchPS();
}

// called when done dragging slider
// get slider values & update active color
function onSliderUp() {
	let x = SLIDER0.value;
	let y = SLIDER1.value;
	let z = SLIDER2.value;
	adjustBorderColor();
	setPSColor(x, y, z, globalColorMode, isFGSelected);
	setBoxColor(x, y, z, globalColorMode, isFGSelected);
}

// called while slider dragged
// set other slider values, update gradients, update text box values
function onSliderDrag() {
	//get slider values
	let x = SLIDER0.value;
	let y = SLIDER1.value;
	let z = SLIDER2.value;
	
	adjustBorderColor();
	setBoxColor(x, y, z, globalColorMode, isFGSelected);
	updateSliderElements(x, y, z, globalColorMode);
}
// called while greyscale slider is dragged
function onGreyscaleSliderChanged() {
	let v = GREYSLIDER.value;
	setBoxColor(v, v, v, ColorMode.RGB, isFGSelected);
	if (globalColorMode == ColorMode.RGB) {
		updateSliderElements(v, v, v, ColorMode.RGB);
	} else {
		updateSliderValues(0, 0, parseInt(Math.round((v/255)*100)));
	}
}

function onTextChange(event) {
	let value = event.target.value;
	let elemName = event.target.id;
	let num = parseInt(elemName[elemName.length-1]);
	if (isValidTextboxValue(value, num)) {
		SLIDERS[num].value = value;
		onSliderUp();
	} else if (value === "") {
	} else {
		event.target.blur();
		updateToMatchPS();
	}
}
function isValidTextboxValue(value, index) {
	let hsbGreaterBound = index == 0 ? 360 : 100;
	return ((globalColorMode == ColorMode.RGB && value >= 0 && value <= 255) ||
		(globalColorMode == ColorMode.HSB && value >= 0 && value <= hsbGreaterBound));
}
function onKeyPress(event) {
	const key = event;
	// const updateKeys = ["x", "d"];
	if (key == "Enter") {
		unfocusTextbox();
	}
	// attempt at capturing keypress events. only works if a panel element has focus.
	// else if (updateKeys.includes(key.toLowerCase())) {
	// 	updateToMatchPS();
	// }
}
function unfocusTextbox(event) {
	if (event.key == "Enter") {
		for (let i = 0; i < TEXT_BOXES.length; i++) {
			if (document.activeElement === TEXT_BOXES[i]) {
				onTextChange();
				TEXT_BOXES[i].blur();
			}
		}
	}
}


/* Update */

// update values to match photoshop's
function updateToMatchPS() {
	//TODO refactor
	cs.evalScript("getColor(\""+globalColorMode+"\", "+true+")", function(result) {
		let components = result.split(",");
		let x = parseInt(Math.round(components[0]));
		let y = parseInt(Math.round(components[1]));
		let z = parseInt(Math.round(components[2]));
		setBoxColor(x, y, z, globalColorMode, true);
		if (isFGSelected) {
			updateSliderElements(x, y, z, globalColorMode);
		}
	});
	cs.evalScript("getColor(\""+globalColorMode+"\", "+false+")", function(result) {
		let components = result.split(",");
		
		let x = parseInt(Math.round(components[0]));
		let y = parseInt(Math.round(components[1]));
		let z = parseInt(Math.round(components[2]));
		setBoxColor(x, y, z, globalColorMode, false);
		if (!isFGSelected) {
			updateSliderElements(x, y, z, globalColorMode);
		}
	});
	adjustBorderColor();
	
}

function updateSliderElements(x, y, z, mode) {
	updateSliderValues(x, y, z);
	updateGradients(x, y, z, mode);	
	updateTextboxValues(x, y, z);
}

function updateSliderValues(x, y, z) {
	SLIDER0.value = parseInt(Math.round(x));
	SLIDER1.value = parseInt(Math.round(y));
	SLIDER2.value = parseInt(Math.round(z));
}

function updateGradients(x, y, z, mode) {
	if (mode == ColorMode.RGB) {
		updateGradientsRGB(x, y, z);
	} else if (mode == ColorMode.HSB) {
		updateGradientsHSV(x, y, z);
	}
}
function updateGradientsRGB(r, g, b) {
	let left = "";
	let right = "";
	
	left = rgb(0, g, b); //green + blue
	right = rgb(255, g, b); //green + blue
	SLIDER0.style.background = linearGradient(left, right);
	left = rgb(r, 0, b);
	right = rgb(r, 255, b);
	SLIDER1.style.background = linearGradient(left, right);
	left = rgb(r, g, 0);
	right = rgb(r, g, 255);
	SLIDER2.style.background = linearGradient(left, right);
	// setSliderValuesRGB(r, g, b);
}
function updateGradientsHSV(h, s, v) {
	SLIDER0.style.background = "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)";
	
	let left = "";
	let right = "";
	left = hsvToHslStr(0, 0, v);
	right = hsvToHslStr(h, 100, v);
	SLIDER1.style.background = linearGradient(left, right);
	left = hsvToHslStr(0, 0, 0);
	
	let s0 = s;
	s /= 100;
	v /= 100;
	// let l = (2 - s) * v / 2; TODO refactor
	let l = (2 - s) * 1 / 2;
	if (l != 0) {
		if (l == 1) {
			s = 0
		} else if (l < 0.5) {
			s = s * v / (l * 2)
		} else {
			s = s * v / (2 - l * 2)
		}
	}
	if (s0 < 50 || v < 50) {
		s0 *= 10; //TODO ??
	}
	right = hsl(h, s0, l*100);
	
	SLIDER2.style.background = linearGradient(left, right);
}

function updateTextboxValues(x, y, z) {
	TEXT0.value = parseInt(Math.round(x));
	TEXT1.value = parseInt(Math.round(y));
	TEXT2.value = parseInt(Math.round(z));
}


//when foreground color box selected
function onFGSelected() {
	let openColorPicker = isFGSelected;
	isFGSelected = true;
	
	adjustBorderColor();
	updateToMatchPS();
	if (openColorPicker) { //if was already selected, show color picker
		cs.evalScript("openColorPicker()");
	}
}
//when background color box selected
function onBGSelected() {
	let openColorPicker = !isFGSelected;
	isFGSelected = false;
	
	adjustBorderColor();
	updateToMatchPS();
	if (openColorPicker) { //if was already selected, show color picker
		cs.evalScript("openColorPicker()");
	}
}
function adjustBorderColor() {
	if (isFGSelected) {
		cs.evalScript("getColor(\""+ColorMode.HSB+"\", "+true+")", function(result) {
			let comps = result.split(",");
			const BRIGHTNESS = 2;
			let color = comps[BRIGHTNESS] > 65? "DimGrey" : "DarkGray"; //bw
			
			FG_COLOR_BOX.style.borderRight = "1px dashed " + color;
			BG_COLOR_BOX.style.borderRight = "0px dashed " + color;
		});
	} else {
		cs.evalScript("getColor(\""+ColorMode.HSB+"\", "+false+")", function(result) {
			let comps = result.split(",");
			const BRIGHTNESS = 2;
			let color = comps[BRIGHTNESS] > 65? "black" : "white";
			
			FG_COLOR_BOX.style.borderRight = "0px dashed " + color;
			BG_COLOR_BOX.style.borderRight = "1px dashed " + color;
		});
	}
}
	
	

function setRGBMode() {
	globalColorMode = ColorMode.RGB;
	
	let labels = ["R", "G", "B"];
	for (let i = 0; i < SLIDER_LABELS.length; i++) {
		SLIDER_LABELS[i].innerHTML = labels[i];
		TEXTBOX_LABELS[i].innerHTML = "";
		SLIDERS[i].max = "255";
	}
	updateToMatchPS();
}
function setHSBMode() {
	globalColorMode = ColorMode.HSB;

	let labels = ["H", "S", "B"];
	for (let i = 0; i < labels.length; i++) {
		SLIDER_LABELS[i].innerHTML = labels[i];
	}
	SLIDER0.max = "360";
	SLIDER1.max = "100";
	SLIDER2.max = "100";
	TEXTBOX_LABEL0.innerHTML = "&deg;";
	TEXTBOX_LABEL1.innerHTML = "%";
	TEXTBOX_LABEL2.innerHTML = "%";
	updateToMatchPS();
}



function setPSColor(x, y, z, mode, _isFGSelected) {
	let fgStr = _isFGSelected ? "FG" : "BG";
	let modeStr = mode == ColorMode.RGB ? "RGB" : "HSB";
	let script = "set"+fgStr+"Color"+modeStr+"("+x+", "+y+", "+z+")";
	cs.evalScript(script);
}


//set foreground color, color box background color
function setBoxColor(x, y, z, mode, _isFGSelected) {
	let box = _isFGSelected ? FG_COLOR_BOX : BG_COLOR_BOX;
	if (mode == ColorMode.RGB) {
		box.style.backgroundColor = rgb(x, y, z);
	} else { // convert to xyz hsl TODO
		let hslComps = hsv_to_hsl(x, y, z);
		let h = hslComps[0];
		let s = hslComps[1];
		let l = hslComps[2];
		box.style.backgroundColor = hsl(h, s, l);
	}
}


function onFlyoutMenuClicked(event) {
	//TODO update xml
	let menuId = event.data.menuId;
	switch (event.data.menuId) {
		case menu_RGB:
			setRGBMode();
			cs.setPanelFlyoutMenu(FLYOUT_MENU_XML_RGB);
			break;
		case menu_HSB:
			setHSBMode();
			cs.setPanelFlyoutMenu(FLYOUT_MENU_XML_HSB);
			break;
		default:
			break;
	}
}


/* Color & Conversion helper methods */

// return css rgb color string
function rgb(r, g, b) {
	return "rgb("+r+", "+g+", "+b+")";
}
// return css hsl color string
function hsl(h, s, l) {
	let str = "hsl("+h+", "+s+"%, "+l+"%)";
	return str;
}
function hsvToHslStr(_h, _s, _v) {
	let comps = hsv_to_hsl(_h, _s, _v);
	let h = comps[0];
	let s = comps[1];
	let l = comps[2];
	return "hsl("+h+", "+s+"%, "+l+"%)";
}
function linearGradient(left, right) {
	return "linear-gradient(to right,"+left+", "+right+")";
}

// source (anwer by Bob): https://stackoverflow.com/users/3385534/bob
// https://stackoverflow.com/questions/3423214/convert-hsb-hsv-color-to-hsl
function hsv_to_hsl(h, s, v) {
	s = s/100;
	v = v/100;
	// both hsv and hsl values are in [0, 1]
	var l = (2 - s) * v / 2;
	
	if (l != 0) {
		if (l == 1) {
			s = 0
		} else if (l < 0.5) {
			s = s * v / (l * 2)
		} else {
			s = s * v / (2 - l * 2)
		}
	}
	
	return [h, s*100, l*100]
}

function logSliderValues() {
	let x = SLIDER0.value;
	let y = SLIDER1.value;
	let z = SLIDER2.value;
	console.log("sliders("+x+", "+y+", "+z+")");
}