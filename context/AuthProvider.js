import React, { createContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axiosConfig from "../helpers/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        isLoading,
        login: (email, password) => {
          setIsLoading(true);
          axiosConfig
            .post("/user/login", {
              email,
              password,
              device_name: "mobile",
            })
            .then((response) => {
              const userResponse = {
                token: response.data.userData.token,
                id: response.data.userData.id,
                name: response.data.userData.name,
                email: response.data.userData.email,
                rol: {
                  name: response.data.userData.role.name,
                  machine_name: response.data.userData.role.machine_name,
                },
                // avatar: response.data.user.avatar,
              };

              setUser(userResponse);
              setError(null);
              SecureStore.setItemAsync("user", JSON.stringify(userResponse));
              setIsLoading(false);
            })
            .catch((error) => {
              console.log(error.response);
              const key = Object.keys(error.response.data.errors)[0];
              setError(error.response.data.errors[key][0]);
              setIsLoading(false);
            });
        },
        logout: () => {
          setIsLoading(true);
          axiosConfig.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${user.token}`;
          axiosConfig
            .post("/logout")
            .then((response) => {
              setUser(null);
              SecureStore.deleteItemAsync("user");
              setError(null);
              setIsLoading(false);
            })
            .catch((error) => {
              console.log(error);
              setUser(null);
              SecureStore.deleteItemAsync("user");
              setError(error.response.data.message);
              setIsLoading(false);
            });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
