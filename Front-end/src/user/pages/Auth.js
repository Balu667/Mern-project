/** @format */
import React, { useState, useContext, useRef } from "react";
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
  const [imgUrl, setImgUrl] = useState(null);

  const { getRequest, isLoading, errorMessage, clearErrorHandler } =
    useHttpClient();

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const formik = {
    initialValues: { name: "", email: "", password: "", image: "" },
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
            process.env.REACT_APP_BACKEND_URL + "/users/login",
            "POST",
            JSON.stringify(values),
            {
              "Content-Type": "application/json",
            }
          );

          auth.login(response.id, response.token);
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const formData = new FormData();
          formData.append("email", values.email);
          formData.append("name", values.name);
          formData.append("password", values.password);
          formData.append("image", values.image);
          const response = await getRequest(
            `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
            "POST",
            formData
          );

          auth.login(response.id, response.token);
        } catch (err) {}
      }
    },
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearErrorHandler} />
      <Card className="authentication">
        {isLoading ? (
          <LoadingSpinnner asOverlay />
        ) : (
          <>
            <h2>Login Required</h2>
            <hr />
            <Formik
              initialValues={formik.initialValues}
              validationSchema={formik.validationSchema}
              onSubmit={formik.onSubmit}
            >
              {(props) => (
                <Form>
                  {!isLoginMode && (
                    <MyTextFieldWrapper
                      label="Name"
                      type="text"
                      name="name"
                      placeholder="Enter the Name"
                    />
                  )}

                  <MyTextFieldWrapper
                    label="Email"
                    type="text"
                    name="email"
                    placeholder="Enter the Email"
                  />
                  {!isLoginMode && (
                    <>
                      <div className="preview-container">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt="preview-img"
                            className="preview-image"
                          />
                        ) : (
                          "Please Pick a Image"
                        )}
                      </div>
                      <input
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        name="image"
                        // className="file-input"
                        onChange={(e) => {
                          props.setFieldValue("image", e.target.files[0]);
                          const fileReader = new FileReader();

                          fileReader.onload = () => {
                            if (fileReader.readyState === 2) {
                              setImgUrl(fileReader.result);
                            }
                          };

                          fileReader.readAsDataURL(e.target.files[0]);
                        }}
                      />
                      {/* <button
                        type="button"
                        className="pick-button"
                        onClick={pickHandler}
                      >
                        Pick Image
                      </button> */}
                    </>
                  )}

                  <MyTextFieldWrapper
                    label="Password"
                    type="text"
                    name="password"
                    placeholder="Enter the password"
                  />

                  <Button
                    type="submit"
                    disabled={!(props.isValid && props.dirty)}
                  >
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
