import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./NavBar.module.css";
import ButtonBlackTransparent from "./reusables/buttons/ButtonBlackTransparent";
import ButtonAnyColorFilled from "./reusables/buttons/ButtonAnyColorFilled";
import ButtonWhiteFilled from "./reusables/buttons/ButtonWhiteFilled";
import ButtonWhiteTransparent from "./reusables/buttons/ButtonWhiteTransparent";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function NavBar({ activeIdx = -1 }) {
  return (
    <nav className={styles.navbar}>
      {/* Logo Section */}
      <div className={styles.navbarContainer + " content_box"}>
        <div className={styles.logo}>
          <Link href="/">
            <Image src="/ai_logo.png" alt="Logo" width={100} height={100} />
          </Link>
        </div>

        {/* Navigation Links Section */}
        <div className={styles.navLinks}>
          <Link
            href="/benchmarks"
            className={`${styles.link} ${activeIdx == 0 ? styles.active : ""}`}
          >
            Benchmarks
          </Link>
          <Link
            href="/delegate"
            className={`${styles.link} ${activeIdx == 1 ? styles.active : ""}`}
          >
            Be a Tester
          </Link>
          <Link
            href="/history"
            className={`${styles.link} ${activeIdx == 2 ? styles.active : ""}`}
          >
            History
          </Link>
        </div>

        {/* Buttons Section */}
        <div className={styles.buttons}>
          <div className={"purple_wrapper"}>
            <ConnectButton></ConnectButton>
          </div>
          {/* <ButtonBlackTransparent path="/donate" className={styles.buttons}>
            Donate
          </ButtonBlackTransparent>
          <ButtonAnyColorFilled
            path="/request-appointment"
            buttonColor="#4e326e"
            className={styles.buttons}
          >
            Request Appointment
          </ButtonAnyColorFilled> */}
        </div>
      </div>
    </nav>
  );
}
