"use client";

import React from "react";
import styles from "./Contact.module.css";
import ButtonWhiteFilled from "./buttons/ButtonWhiteFilled";
import { useForm, ValidationError } from "@formspree/react";

const Contact = ({
  subtitleText,
  headerText,
  buttonText,
  path,
  titleText,
  src,
}) => {
  const [state, handleSubmit] = useForm("mnnnqkaa");

  if (state.succeeded) {
    return (
      <div className={styles.successMessage}>
        <p>Thanks for reaching out! We will get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className={styles.about}>
      <div className={styles.aboutText}>
        <h3 className={styles.detailed_subtitle}>{subtitleText}</h3>
        <h1 className={styles.detailed_title}>{headerText}</h1>
        <div className={styles.form_container}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label} htmlFor="name">
              Name
            </label>
            <input type="text" id="name" name="name" className={styles.input} />
            <ValidationError prefix="Name" field="name" errors={state.errors} />
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />
            <label className={styles.label} htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className={styles.text_area}
            />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />
            <div className={styles.buttonContainer}>
              <button
                type="submit"
                disabled={state.submitting}
                className={styles.button}
              >
                {buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.aboutImage}>
        <img src={src} alt={titleText} />
      </div>
    </div>
  );
};

export default Contact;
