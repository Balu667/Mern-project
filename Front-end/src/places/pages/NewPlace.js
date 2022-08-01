/** @format */

import React, { useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import "./PlaceForm.css";
import { MyTextFieldWrapper } from "../../shared/components/MyTextFieldWrapper/MyTextFieldWrapper";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const NewPlace = () => {
  // const placeSubmitHandler = (event) => {
  //   event.preventDefault();
  // };
  const auth = useContext(AuthContext);
  console.log(auth);
  const {
    getRequest,
    isLoading,
    errorMessage,
    clearErrorHandler,
    postRequest,
  } = useHttpClient();
  const data = {
    initialValues: {
      title: "",
      description: "",
      address: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("title is required")
        .min(3, "Please enter atleast 3 characters")
        .max(20, "Please the enter below 20 characters"),
      description: Yup.string(),
      address: Yup.string()
        .min(4, "Please enter minimum 4 characters")
        .max(30, "Please enter below 30 characters")
        .required("Address is required"),
    }),
    onSubmit: async (values) => {
      const object = { ...values, creator: auth.userId };
      console.log(JSON.stringify(object));
      try {
        const response = await postRequest(
          "//localhost:5000/api/places",
          JSON.stringify(object)
          // {
          //   "Content-Type": "application/json",
          // }
        );
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    },
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearErrorHandler} />
      {isLoading ? (
        <LoadingSpinner overlay />
      ) : (
        <Formik
          initialValues={data.initialValues}
          validationSchema={data.validationSchema}
          onSubmit={data.onSubmit}>
          {(formik) => (
            <Form className='place-form'>
              <MyTextFieldWrapper
                name='title'
                placeholder='Enter the title of place'
                type='text'
              />
              <MyTextFieldWrapper
                name='description'
                placeholder='Enter the title of place'
                type='text'
              />
              <MyTextFieldWrapper
                name='address'
                placeholder='Enter the title of place'
                type='text'
              />
              <Button
                type='submit'
                disabled={!(formik.dirty && formik.isValid)}>
                ADD PLACE
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </React.Fragment>
  );
};

export default NewPlace;
