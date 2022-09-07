import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import "./PlaceForm.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { Formik, Form } from "formik";
import { MyTextFieldWrapper } from "../../shared/components/MyTextFieldWrapper/MyTextFieldWrapper";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const history = useHistory();
  const auth = useContext(AuthContext);

  const { isLoading, clearErrorHandler, getRequest, errorMessage } =
    useHttpClient();

  const [identifiedPlace, setIdentifieldPlace] = useState(null);

  useEffect(() => {
    const getIdentifiedPlace = async () => {
      console.log("renderes");
      try {
        const response = await getRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setIdentifieldPlace(response.place);
      } catch (err) {}
    };
    getIdentifiedPlace();
  }, [getRequest]);

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  const initialValues = {
    title: identifiedPlace.title,
    description: identifiedPlace.description,
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("title is Required")
      .min(3, "please enter atleast 3 characters")
      .max(20, "please enter below 20 characters"),
    description: Yup.string()
      .required("description is required")
      .min(4, "please enter atleast 4 characters")
      .max(50, "Please enter below 50 chars only"),
  });
  return (
    <>
      <ErrorModal error={errorMessage} onClear={clearErrorHandler} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const response = await getRequest(
              `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
              "PATCH",
              JSON.stringify(values),
              {
                "Content-Type": "application/json",
                Authorization: "Bearer " + auth.token,
              }
            );
            history.push(`/${auth.userId}/places`);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        {(formik) => (
          <Form className="place-form">
            <MyTextFieldWrapper
              name="title"
              placeholder="Enter the title"
              type="text"
            />
            <MyTextFieldWrapper
              name="description"
              placeholder="Enter the description"
              type="text"
            />
            <Button type="submit" disabled={!(formik.isValid && formik.dirty)}>
              UPDATE PLACE
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UpdatePlace;
