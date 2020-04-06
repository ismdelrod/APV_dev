import React, { useState } from "react"; // { useState } es un Hook
import { SocialIcon, Alert } from "react-native-elements";
import * as Facebook from "expo-facebook";
import * as firebase from "firebase/app";
import { FacebookApi } from "../../utils/Social";
import Loading from "../Loading";

export default LoginFacebook = props => {
  const { toastRef, navigation } = props;
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    try {
      await Facebook.initializeAsync(FacebookApi.application_id);

      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync(
        FacebookApi.application_id,
        { permissions: FacebookApi.permissions }
      );

      if (type === "success") {
        setIsLoading(true);
        // const credentials = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const credentials = firebase.auth.FacebookAuthProvider.credential( token );
        //TO DO: No funciona LogIn con facebook, falla autentificación con firebase
        await firebase
          .auth()
          .signInWithCredential(credentials)
          .then(() => {
            toastRef.current.show(
              "Logged in!",
              `Hi ${credentials.json().name}!`
            );
            navigation.navigate("Account");
          })
          .catch(() => {
            toastRef.current.show("Login Facebook ERROR");
          });
      } else if (type === "cancel") {
        toastRef.current.show("Login Facebook Cancelado");
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      toastRef.current.show(`Facebook Login Error: ${message}`);
    }
    setIsLoading(false);
  };
  return (
    <>
      <SocialIcon
        title="Iniciar Sesión con Facebook"
        button
        type="facebook"
        onPress={login}
      />
      <Loading isVisible={isLoading} text="Iniciando Sesión" />
    </>
  );
};
