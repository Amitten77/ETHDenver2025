import React from "react";
import Link from "next/link";
import styles from "./ButtonAnyColorFilled.module.css";

export default function ButtonAnyColorFilled({ children, path, buttonColor }) {
  // Devin + Faris
  // Finish this as well.
  // This one shoud take in a color and update the border and the fill color to it
  // Text will be white
  // Add hover animation to lower brightness (As explained in prev buttons)
  const style = {
    backgroundColor: buttonColor,
    border: buttonColor,
  };

  return (
    <Link href={path} style={style} className={styles.button}>
      <p>{children}</p>
    </Link>
  );
}
