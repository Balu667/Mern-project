/** @format */
import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);
  const { getRequest, clearErrorHandler, isLoading, errorMessage } =
    useHttpClient();
  useEffect(() => {
    const usersHandler = async () => {
      try {
        const response = await getRequest(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );
        setLoadedUsers(response.users);
      } catch (err) {}
    };
    usersHandler();
  }, [getRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearErrorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
