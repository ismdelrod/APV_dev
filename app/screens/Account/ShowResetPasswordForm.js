import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import { validateEmail } from "../../utils/Validation";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default ShowResetPasswordForm = (props) => {
  const { setIsVisibleModal, toastRef } = props;
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailExists = (email) => {
    firebase
      .auth()
      .fetchSignInMethodsForEmail(email)
      .then((providers) => {
        debugger;
        return providers.length > 0;
      });
  };

  const senEmailToResetPasswors = () => {
    setError("");

    if (!email) {
      setError("El Email no puede estar vacío");
    } else {
      if (!validateEmail(email)) {
        setError("El Email introducido no tiene un formato válido");
      } else {
        setIsLoading(true);

        firebase
          .auth()
          .fetchSignInMethodsForEmail(email)
          .then((providers) => {
            debugger;
            if (providers.length > 0) {
              firebase
                .auth()
                .sendPasswordResetEmail(email)
                .then((user) => {
                  setIsLoading(false);
                  toastRef.current.show(
                    "Se ha enviado un email para resetear su Contraseña"
                  );
                  setIsVisibleModal(false);
                })
                .catch((e) => {
                  setError("Error al intentar actualizar Email");
                  setIsLoading(false);
                });
            } else {
              setError(
                "El Email introducido no está registrado en nuestra base de datos"
              );
              setIsLoading(false);
            }
          });
      }
    }
  };

  return (
    <View style={styles.viewStyle}>
      <Input
        placeholder="Introduzca su Email"
        containerStyle={styles.inputContainerStyle}
        defaultValue=""
        onChange={(e) => setEmail(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
        errorMessage={error}
      />
      <Button
        title="Enviar"
        containerStyle={styles.btnContainerStyle}
        buttonStyle={styles.btnStyle}
        onPress={senEmailToResetPasswors}
        loading={isLoading}
      />
      <Loading isVisible={isLoading} text="Enviando Email" />
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  inputContainerStyle: {
    marginBottom: 10,
  },
  btnContainerStyle: {
    marginTop: 20,
    width: "95%",
  },
  btnStyle: {
    backgroundColor: "#00a680",
  },
});
