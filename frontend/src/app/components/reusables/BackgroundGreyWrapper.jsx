import React from "react";
import classes from "./BackgroundWrapper.module.css";

const BackgroundGreyWrapper = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: "#e2e2e2",
      }}
      className={classes.background_wrapper}
    >
      {children}
    </div>
  );
};

export default BackgroundGreyWrapper;
