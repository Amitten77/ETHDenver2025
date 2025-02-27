import React from "react";
import Link from "next/link";
import styles from "./ButtonBlackTransparent.module.css";

export default function ButtonBlackTransparent({ children, path }) {
  // Devin + Faris
  // Finish this as well.
  // Add hover animation to fill in black (As explained in prev buttons)
  return (
    <Link href={path} className={styles.button}>
      <p>{children}</p>
    </Link>
  );
}
