import React, { useState } from "react";

const DelegateInput = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="delegate_options">
      {/* Input Field */}
      <div>
        <p>ETH to Delegate</p>
      </div>

      <input
        type="text"
        placeholder="Enter ETH amount"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="delegate_input"
      />

      {/* Button */}
      <button
        onClick={() => alert(`You entered: ${inputValue}`)}
        className="delegate_button"
      >
        Delegate
      </button>
    </div>
  );
};

export default DelegateInput;
