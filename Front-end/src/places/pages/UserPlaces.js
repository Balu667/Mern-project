import React from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList from "../components/PlaceList";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UserPlaces = () => {
  const { userId } = useParams();
  const { clearErrorHandler, getRequest, isLoading, errorMessage } =
    useHttpClient();
  const [userPlaces, setUserPlaces] = useState([]);

  const getUserPlaces = async () => {
    try {
      const response = await getRequest(
        `http://localhost:5000/api/places/users/${userId}`
      );
      setUserPlaces(response.places);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserPlaces();
  }, []);

  const deletePlaceHandler = (id) => {
    setUserPlaces(userPlaces.filter((e) => e.id !== id));
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearErrorHandler} />
      {isLoading ? (
        <LoadingSpinner overlay />
      ) : (
        <PlaceList items={userPlaces} deleteHandler={deletePlaceHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
