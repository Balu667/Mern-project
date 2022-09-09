/** @format */
import React, { useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import "./PlaceForm.css";
import { MyTextFieldWrapper } from "../../shared/components/MyTextFieldWrapper/MyTextFieldWrapper";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";

const NewPlace = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [placeImg, setPlaceImage] = useState(null);
  const [img, setImg] = useState(null);
  const { getRequest, isLoading, errorMessage, clearErrorHandler } =
    useHttpClient();
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
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("address", values.address);
        formData.append("image", img);
        const response = await getRequest(
          process.env.REACT_APP_BACKEND_URL + "/places",
          "POST",
          formData,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        history.push("/");
      } catch (err) {
        console.log(err);
      }
    },
  };

  // if (img) {
  //   data.image = img;
  //   // formik.setFieldValue("image", e.target.files[0]);
  // }

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearErrorHandler} />
      {isLoading ? (
        <LoadingSpinner overlay />
      ) : (
        <Formik
          initialValues={data.initialValues}
          validationSchema={data.validationSchema}
          onSubmit={data.onSubmit}
        >
          {(formik) => (
            <Form className="place-form">
              <MyTextFieldWrapper
                name="title"
                placeholder="Enter the title of place"
                type="text"
                label="Title"
              />
              <MyTextFieldWrapper
                name="description"
                placeholder="Enter the description of place"
                label="Description"
                type="text"
              />
              <MyTextFieldWrapper
                name="address"
                label="Address"
                placeholder="Enter the address of  place"
                type="text"
              />
              <label>Image of the Place</label>
              <div className="previewplace-container">
                {placeImg ? (
                  <img
                    src={placeImg}
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
                  setImg(e.target.files[0]);
                  const fileReader = new FileReader();
                  fileReader.onload = () => {
                    if (fileReader.readyState === 2) {
                      setPlaceImage(fileReader.result);
                    }
                  };

                  fileReader.readAsDataURL(e.target.files[0]);
                }}
              />

              <Button
                type="submit"
                disabled={!(formik.dirty && formik.isValid && !!img)}
              >
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
