import React from "react";
import { Text as RNText } from "react-native";

const fontFamilyMap = {
  100: "Inter-Thin",
  200: "Inter-ExtraLight",
  300: "Inter-Light",
  400: "Inter-Regular",
  500: "Inter-Medium",
  600: "Inter-SemiBold",
  700: "Inter-Bold",
  800: "Inter-ExtraBold",
  900: "Inter-Black",
};

const fontFamilyItalicMap = {
  100: "Inter-ThinItalic",
  200: "Inter-ExtraLightItalic",
  300: "Inter-LightItalic",
  400: "Inter-Italic",
  500: "Inter-MediumItalic",
  600: "Inter-SemiBoldItalic",
  700: "Inter-BoldItalic",
  800: "Inter-ExtraBoldItalic",
  900: "Inter-BlackItalic",
};

const Text = ({ children, style = {}, ...props }) => {
  const fontWeightRaw = style?.fontWeight;
  const italic = style?.fontStyle === "italic";

  // Convert fontWeight to number if it's a string like "600"
  const fontWeight = fontWeightRaw ? Number(fontWeightRaw) : 400; // Default to 400 (Regular)

  const fontFamily = italic
    ? fontFamilyItalicMap[fontWeight] || "Inter-Italic"
    : fontFamilyMap[fontWeight] || "Inter-Regular";

  // console.log(children);
  // console.log(fontWeight);
  // console.log(fontFamily);

  return (
    <RNText {...props} style={[style, { fontFamily }]}>
      {children}
    </RNText>
  );
};

export default Text;
