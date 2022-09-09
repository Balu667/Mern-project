import React, { useState, useRef, useEffect } from "react";

import "./ImageUpload.css";

export const ImageUpload = (props) => {
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      setImgUrl(fileReader.result);
      props.getImage(file);
    };
  }, [file]);
  const pickHandler = () => {
    fileRef.current.click();
  };
  const imagePickHandler = (e) => {
    e.preventDefault();
    if (e.target.files || e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="imageupload-container">
      <div className="preview-container">
        {file ? (
          <img src={imgUrl} alt="preview-img" className="preview-image" />
        ) : (
          "Please Pick a Image"
        )}
      </div>
      <input
        ref={fileRef}
        name={props.name}
        type="file"
        accept=".png, .jpg, .jpeg"
        onChange={imagePickHandler}
        className="file-input"
      />
      <button type="button" className="pick-button" onClick={pickHandler}>
        Pick Image
      </button>
    </div>
  );
};
