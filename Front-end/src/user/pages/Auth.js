/** @format */
import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";
import LoadingSpinnner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { MyTextFieldWrapper } from "../../shared/components/MyTextFieldWrapper/MyTextFieldWrapper";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const errorMessageClearHandler = () => {
    setErrorMessage(null);
  };

  const formik = {
    initialValues: { name: "", email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("email is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters is Required")
        .required("password is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      if (isLoginMode) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/users/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            }
          );
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message);
          }
          auth.login();
        } catch (err) {
          setErrorMessage(
            err.message || "Something went wrong, please try again."
          );
        }

        setIsLoading(false);
      } else {
        try {
          console.log(values);
          const response = await fetch(
            "http://localhost:5000/api/users/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            }
          );

          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message);
          }
          console.log(responseData);

          setIsLoading(false);
          auth.login();
        } catch (err) {
          setErrorMessage(
            err.message || "Something went wrong, please try again."
          );
        }
      }
      setIsLoading(false);
    },
  };

  console.log(Formik);

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={errorMessageClearHandler} />
      <Card className='authentication'>
        {isLoading ? (
          <LoadingSpinnner asOverlay />
        ) : (
          <>
            <h2>Login Required</h2>
            <hr />
            <Formik
              initialValues={formik.initialValues}
              validationSchema={formik.validationSchema}
              onSubmit={formik.onSubmit}>
              {(props) => (
                <Form>
                  {!isLoginMode && (
                    <MyTextFieldWrapper
                      label='Name'
                      type='text'
                      name='name'
                      placeholder='Enter the Name'
                    />
                  )}
                  <MyTextFieldWrapper
                    label='Email'
                    type='text'
                    name='email'
                    placeholder='Enter the Email'
                  />
                  <MyTextFieldWrapper
                    label='Password'
                    type='text'
                    name='password'
                    placeholder='Enter the password'
                  />
                  <Button
                    type='submit'
                    disabled={!(props.isValid && props.dirty)}>
                    {isLoginMode ? "LOGIN" : "SIGNUP"}
                  </Button>
                </Form>
              )}
            </Formik>
            <Button inverse onClick={switchModeHandler}>
              SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
            </Button>
          </>
        )}
      </Card>
    </React.Fragment>
  );
};

export default Auth;
