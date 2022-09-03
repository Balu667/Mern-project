/** @format */
import { useCallback, useState } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const getRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error("Something went wrong, Please try again");
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setErrorMessage(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearErrorHandler = () => {
    setErrorMessage(null);
  };

  return {
    getRequest,
    clearErrorHandler,
    isLoading,
    errorMessage,
  };
};
