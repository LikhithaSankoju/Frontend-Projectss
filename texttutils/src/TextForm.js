import React, { useState } from 'react';

export default function TextForm(props) {
  const [text, setText] = useState('');

  const handleUppercaseClick = () => {
    let newText = text.toUpperCase();
    setText(newText);
    props.showAlert("Converted to Uppercase","Success");
  };

  const handleLowercaseClick = () => {
    let newText = text.toLowerCase();
    setText(newText);
    props.showAlert("Converted to Lowercase","Success");
  };

  const handleClearClick = () => {
    setText('');
    props.showAlert("Text cleared","Success");
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    props.showAlert("Text copied to clipboard","Success");
  };

  const handleRemoveSpacesClick = () => {
    let newText = text.split(/[ ]+/).join(' ');
    setText(newText);
    props.showAlert("Extra spaces removed","Success");
  };

  const handleOnChange = (event) => {
    setText(event.target.value);
  };

  // Calculate word count properly
  const wordCount = text.trim() === '' ? 0 : text.split(/\s+/).filter(word => word !== '').length;
  
  // Calculate reading time
  const readingTime = wordCount * 0.008;

  // Common text color style based on mode
  const textColor = { color: props.mode === 'dark' ? 'white' : '#042743' };

  return (
    <>
      <div className="container" style={textColor}>
        <h2>{props.heading}</h2>

        <div className="mb-3">
          <textarea
            className="form-control"
            value={text}
            onChange={handleOnChange}
            style={{
              backgroundColor: props.mode === 'dark' ? '#13466e' : 'white',
              color: props.mode === 'dark' ? 'white' : 'black'
            }}
            id="myBox"
            rows="8"
          ></textarea>
        </div>

        {/* Buttons */}
        <button className="btn btn-primary mx-1 my-1" onClick={handleUppercaseClick}>Convert to Uppercase</button>
        <button className="btn btn-primary mx-1 my-1" onClick={handleLowercaseClick}>Convert to Lowercase</button>
        <button className="btn btn-primary mx-1 my-1" onClick={handleClearClick}>Clear Text</button>
        <button className="btn btn-primary mx-1 my-1" onClick={handleCopyClick}>Copy Text</button>
        <button className="btn btn-primary mx-1 my-1" onClick={handleRemoveSpacesClick}>Remove Extra Spaces</button>
      </div>

      {/* Summary - Now with proper styling for dark mode */}
      <div className="container my-3" style={textColor}>
        <h2>Your text Summary</h2>
        <p>{wordCount} words and {text.length} characters</p>
        <p>{readingTime} Minutes read</p>
        <h2>Preview</h2>
        <p>{text.length > 0 ? text : "Enter something in the textbox above to preview it here"}</p>
      </div>
    </>
  );
}