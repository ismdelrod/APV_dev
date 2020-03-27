import React, { useState } from "react"; // { useState } es un Hook
import { SocialIcon } from "react-native-elements";
import * as Facebook from "expo-facebook";
import * as firebase from "firebase/app";
import { FacebookApi } from "../../utils/Social";
import Loading from "../Loading";

export default LoginFacebook = () => {
  const login = async () => {
    const {
      type,
      token
    } = await Facebook.logInWithReadPermissionsAsync(
      FacebookApi.application_id,
      { permissions: FacebookApi.permissions }
    );
debugger;
    if (type === "success") {
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);
      await firebase
        .auth()
        .signInWithCredential(credentials)
        .then(() => {
          console.log("Login Facebook OK");
        })
        .catch(() => {
          console.log("Login Facebook ERROR");
        });
    }
  };
  return (
    <SocialIcon
      title="Iniciar Sesión con Facebook"
      button
      type="facebook"
      onPress={login}
    />
  );
};
