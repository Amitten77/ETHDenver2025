import React from "react";
import Link from "next/link";
import styles from "./ButtonWhiteTransparent.module.css";

export default function ButtonWhiteTransparent({ children, path }) {
  // Devin + Faris
  // Add hover animations. This one should fill in the button white.
  // Give it a transition over time (Like 0.15s)
  return (
    <Link href={path} className={styles.button}>
      <p>{children}</p>
    </Link>
  );
}
