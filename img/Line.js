import React from "react";
import { Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Line() {
const originalWidth = 519;
const originalHeight = 260;
const aspectRatio = originalWidth / originalHeight;
const windowWidth = Dimensions.get("window").width;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width = '100%'
      height="15"
      display="inline"
      position='fixed'
      x="0"
      y="0"
      version="1.1"
      xmlSpace="preserve"
    >
      <Path
        fill="#01a09e"
        stroke="#00000F"
        strokeWidth="3"
        d="M0 0h1120"
        className="path2"
      ></Path>
    </Svg>
  );
}
