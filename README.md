# Extra improved slider
An Adobe Photoshop CC panel extension. Includes RGB and HSB color sliders, a greyscale slider, and a 6-step greyscale slider.

![HSB screenshot](https://github.com/dustymethod/improved-slider/blob/master/resources/screenshotHSB.jpg "HSB screenshot")
![RGB screenshot](https://github.com/dustymethod/improved-slider/blob/master/resources/screenshotRGB.jpg "RGB screenshot")

## Usage
1. With Adobe Photoshop CC installed
2. Download the .zxp file in /build
3. Download [ZXPInstaller](http://zxpinstaller.com/) (This is just what I used; other .zxp installers may also work)
4. Use zxp installer to install the extension
5. Launch photoshop
6. Open the panel: Window > Extensions > ExtraImproved Slider

## Issues
- Switching fg/bg colors with "x" hotkey does not immediately update the panel (requires mouse over to update)
- If the background color is selected (panel), but the foreground color is active (default color picker), sampling a color will update the panel's foreground color, instead of the background color.


## Resources & Tips
##### Useful development guides
[CEP Cookbook](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/Documentation/CEP%208.0%20HTML%20Extension%20Cookbook.md)

[Adobe-CEP Getting-Started-guides](https://github.com/Adobe-CEP/Getting-Started-guides)

[Debugging](https://github.com/Adobe-CEP/Getting-Started-guides/tree/master/Client-side%20Debugging)

[https://www.adobe.com/devnet/creativesuite/articles/a-short-guide-to-HTML5-extensions.html](https://www.adobe.com/devnet/creativesuite/articles/a-short-guide-to-HTML5-extensions.html)

[Adobe Photoshop CC 2015 Scripting](https://www.adobe.com/devnet/photoshop/scripting.html)

[Photoshop DOM Hierarchy](http://objjob.phrogz.net/pshop/hierarchy)

[Davide Barranca's HTML Panel Tips](http://www.davidebarranca.com/category/code/html-panels/)

###### Tip:
To run your extension during development, copy the project folder (in this case, the ImprovedSlider folder) into this directory:

C:\Program Files (x86)\Common Files\Adobe\CEP\extensions

##### How to Package an Extension
[SigningTechNote\_CC.pdf](https://wwwimages2.adobe.com/content/dam/acom/en/devnet/creativesuite/pdfs/SigningTechNote_CC.pdf)

##### Installing a packaged extension
Use [http://zxpinstaller.com/](http://zxpinstaller.com/) to install the .zxp.

Alternatively, convert the .zxp to .zip by changing the extension, and extract the files. The folder must be placed in "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions" To show up as an extension.

