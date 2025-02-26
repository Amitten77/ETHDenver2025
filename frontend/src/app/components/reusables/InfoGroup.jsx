import React from "react";
import styles from "./InfoGroup.module.css";
// Ishaan
// This is functionally the same as HomeServices.jsx.
// However, you are only passing in the special children prop.
// This means that in pseudocode <InfoGroup><InfoPanel/> * 3</InfoGroup>,
// <InfoPanel/> * 3 would be stored in the children prop

export default function InfoGroup({ children }) {
  return (
    <div className="wrapper">
      <div className={styles.container}>{children}</div>
    </div>
  );
}
