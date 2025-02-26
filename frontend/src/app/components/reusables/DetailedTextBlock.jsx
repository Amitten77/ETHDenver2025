import React from "react";
import ButtonBlackTransparent from "./buttons/ButtonBlackTransparent";
import styles from "./DetailedTextBlock.module.css";

export default function DetailedTextBlock({
  subtitleText,
  headerText,
  bodyText,
  buttonText,
  path,
  width,
}) {
  // Armaan Patel

  // Create a dynamic text component for the first main text block on the home page
  // h3 element, h1 element, p element, button (use default unstyled button for right now)
  // All should be justified left

  // Component should accept the text for all the items including the button as parameters
  // It should also accept the width of the text block. Notice how the "Get Involved" text block is more narrow but follow the same format.
  // Style in DetailedTextBlock.module.css
  //button white transparent for button
  return (
    <div style={{ width: `${width}%` }}>
      <h3 className={styles.detailed_subtitle}>{subtitleText}</h3>
      <h1 className={styles.detailed_title}>{headerText}</h1>
      <p>{bodyText}</p>
      <div className={styles.buttonContainer}>
        <ButtonBlackTransparent path={path}>
          {buttonText}
        </ButtonBlackTransparent>
      </div>
    </div>
  );
}
