/** Paint Styles utilities */
function componentToHex(c: number) {
  // c is decimal point number
  var hex = Math.round(c * 255).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/** Text Styles utilities */
function createTextStyleData(textStyle: TextStyle): string {
  // fontFamily, font weight, font size, line Height
  const {
    fontSize,
    fontName: { family, style },
    lineHeight,
    letterSpacing,
  } = textStyle;
  let fontWeightPixels = 0;
  switch (style) {
    case "ExtraLight":
      fontWeightPixels = 200;
      break;
    case "Light":
      fontWeightPixels = 300;
      break;
    case "Regular":
      fontWeightPixels = 400;
      break;
    case "Medium":
      fontWeightPixels = 500;
      break;
    case "SemiBold":
      fontWeightPixels = 600;
      break;
    case "Bold":
      fontWeightPixels = 700;
      break;
    case "ExtraBold":
      fontWeightPixels = 800;
      break;

    default:
      break;
  }
  const fontFamilyClass = `font-${family.replace(" ", "")} `;
  const fontWeightClass = `font-[${fontWeightPixels}] `;
  const fontSizeClass = `text-[${fontSize}px] `;
  /** @todo support non pixels type lineHeight */
  const lineHeightClass =
    lineHeight.unit === "PIXELS" ? `leading-[${lineHeight.value}px] ` : "";
  /** @todo support non pixels type letterSpacing */
  const letterSpacingClass =
    letterSpacing.unit === "PIXELS"
      ? `tracking-[${letterSpacing.value}px] `
      : "";
  return (
    fontFamilyClass +
    fontWeightClass +
    fontSizeClass +
    lineHeightClass +
    letterSpacingClass
  );
}

function createPaintStylesData(): {
  [id in string]: string;
} {
  const paintStylesInTheme = figma.getLocalPaintStyles();
  const paintStylesData: { [id in string]: string } = {};
  paintStylesInTheme.map((paintStyle) => {
    if (paintStyle.paints[0].type === "SOLID") {
      /** @todo Add support to GradientPaint | ImagePaint */
      const { r, g, b } = (paintStyle.paints[0] as SolidPaint).color;
      /** @todo Add support custom name */
      paintStylesData[paintStyle.name] = rgbToHex(r, g, b).toLocaleUpperCase();
    }
  });
  return paintStylesData;
}

function createTextStylesData(): {
  [id in string]: string;
} {
  const textStylesInTheme = figma.getLocalTextStyles();
  const textStylesData: { [id in string]: string } = {};
  textStylesInTheme.map((textStyle) => {
    /** @todo Add support custom name */
    textStylesData[textStyle.name] = createTextStyleData(textStyle);
  });
  return textStylesData;
}

figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "export") {
    figma.ui.postMessage({
      stylesInJson: {
        colorStyles: createPaintStylesData(),
        fontStyles: createTextStylesData(),
      },
      type: "stylesInJson",
    });
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  //figma.closePlugin();
};
