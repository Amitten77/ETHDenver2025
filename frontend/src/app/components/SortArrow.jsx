import React, { useState } from "react";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const SortArrow = ({
  category,
  handleChange,
  activeCategory,
  currDirection,
}) => {
  const isActive = category === activeCategory;
  const currDir = isActive ? currDirection : 0;

  //   console.log(currDir);

  function handleArrowClick() {
    handleChange((currDir + 1) % 3, category);
  }

  return (
    <div onClick={handleArrowClick}>
      {currDir == 0 && (
        <FaChevronDown className={"hover_down_icon"} size={12} />
      )}
      {currDir == 1 && <FaChevronDown className={"sort_icon"} size={12} />}
      {currDir == 2 && <FaChevronUp className={"sort_icon"} size={12} />}
    </div>
  );
};

export default SortArrow;
