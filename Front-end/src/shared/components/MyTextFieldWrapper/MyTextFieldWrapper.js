/** @format */

import React from "react";
import { useField } from "formik";
import "./MyTextFieldWrapper.css";

export const MyTextFieldWrapper = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className='input-container'>
      {label && (
        <label className='label' htmlFor={props.name}>
          {label}
        </label>
      )}
      <input className='input' {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </div>
  );
};
