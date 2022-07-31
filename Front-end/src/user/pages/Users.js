/** @format */

import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:5000/api/users");
        const responseData = await response.json();
        console.log(responseData.users);
        setLoadedUsers(responseData.users);
        if (!response.ok) {
          throw new Error(responseData.message);
        }
      } catch (err) {
        setError(err.message);
      }

      setIsLoading(false);
    };
    getUsers();
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner overlay />}
      {!isLoading && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
