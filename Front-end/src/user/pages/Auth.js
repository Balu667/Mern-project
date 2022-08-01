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
import { useHttpClient } from "../../shared/hooks/http-hook";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { getRequest, isLoading, errorMessage, clearErrorHandler } =
    useHttpClient();

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
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
      if (isLoginMode) {
        try {
          const response = await getRequest(
            "http://localhost:5000/api/users/login",
            "POST",
            JSON.stringify(values),
            {
              "Content-Type": "application/json",
            }
          );
          auth.login(response.user.id);
        } catch (err) {}
      } else {
        try {
          const response = await getRequest(
            "http://localhost:5000/api/users/signup",

            "POST",
            JSON.stringify(values),
            {
              "Content-Type": "application/json",
            }
          );

          auth.login(response.id);
        } catch (err) {}
      }
    },
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearErrorHandler} />
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
