var ColorMode = {
	RGB: "RGB",
	HSB: "HSB",
	// LAB: 2,
};

function getCharIDToTypeID(str) {
	return app.charIDToTypeID("setd");
}

function openColorPicker() {
	app.showColorPicker();
}

function getColor(colorMode, isFGSelected) {
	var activeColor = isFGSelected ? app.foregroundColor : app.backgroundColor;
	if (colorMode == ColorMode.RGB) {
		//[0.0, 255.0]
		var r = activeColor.rgb.red;
		var g = activeColor.rgb.green;
		var b = activeColor.rgb.blue;
		return ""+r+","+g+","+b+""; 
	} else {
		var h = activeColor.hsb.hue; //[0.0, 360.0]
		var s = activeColor.hsb.saturation; //[0.0, 100.0]
		var b = activeColor.hsb.brightness; //[0.0, 100.0]
		return ""+h+","+s+","+b+"";
	}
}

function setFGColorRGB(r, g, b) {
	app.foregroundColor.rgb.red = r;
	app.foregroundColor.rgb.green = g;
	app.foregroundColor.rgb.blue = b;
}
function setBGColorRGB(r, g, b) {
	app.backgroundColor.rgb.red = r;
	app.backgroundColor.rgb.green = g;
	app.backgroundColor.rgb.blue = b;
}
function setFGColorHSB(h, s, b) {
	app.foregroundColor.hsb.hue = h;
	app.foregroundColor.hsb.saturation = s;
	app.foregroundColor.hsb.brightness = b;
}
function setBGColorHSB(h, s, b) {
	app.backgroundColor.hsb.hue = h;
	app.backgroundColor.hsb.saturation = s;
	app.backgroundColor.hsb.brightness = b;
}
