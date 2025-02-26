import React from "react";
import styles from "./InfoPanel.module.css";

// Ishaan
// Dynamic text panel with configurable parameters
// Look at the "hear from our volunteers" and "why donate" sections
// Should have the same parameters as the HomeServicePanel
// However, an image should be optional. This can be achieved a couple of ways.

export default function InfoPanel({ src, titleText, descripText, colorCode }) {
  return (
    <div className={styles.panel} style={{ borderColor: colorCode }}>
      {src && <img src={src} alt={titleText} className={styles.icon} />}
      <h1 className={styles.title}>{titleText}</h1>
      <p className={styles.description}>{descripText}</p>
    </div>
  );
}
