import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { reauthenticate } from "../../utils/Api";
import { validateEmail, validatePassword } from "../../utils/Validation";

export default ChangeEmailForm = props => {
  const { email, setIsVisibleModal, setReloadData, toastRef } = props;
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // TO DO: Añadir validación para email ya registrado  y validar la seguridad del password
  const updateEmail = () => {
    setError({});

    if (!newEmail || newEmail === email) {
      setError({
        email: "El Email no puede ser el ya registrado ni puede estar vacío"
      });
    } else {
      if (!validateEmail(newEmail)) {
        setError({
          email: "El Email introducido no tiene un formato válido"
        });
      } else {
        setIsLoading(true);

        reauthenticate(password)
          .then(() => {
            firebase
              .auth()
              .currentUser.updateEmail(newEmail)
              .then(() => {
                setIsLoading(false);
                setReloadData(true);
                toastRef.current.show("Email actualizado correctamente");
                setIsVisibleModal(false);
              })
              .catch(() => {
                setError({ email: "Error al intentar actualizar Email" });
                setIsLoading(false);
              });
          })
          .catch(() => {
            setError({ password: "La contraseña introducida no es correcta" });
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <View style={styles.viewStyle}>
      <Input
        placeholder="Email"
        containerStyle={styles.inputContainerStyle}
        defaultValue={email && email}
        onChange={e => setNewEmail(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2"
        }}
        errorMessage={error.email}
      />

      <Input
        placeholder="Password"
        containerStyle={styles.inputContainerStyle}
        passwordRules={true}
        secureTextEntry={hidePassword}
        onChange={e => setPassword(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hidePassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHidePassword(!hidePassword)
        }}
        errorMessage={error.password}
      />

      <Button
        title="Editar Email"
        containerStyle={styles.btnContainerStyle}
        buttonStyle={styles.btnStyle}
        onPress={updateEmail}
        loading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  inputContainerStyle: {
    marginBottom: 10
  },
  btnContainerStyle: {
    marginTop: 20,
    width: "95%"
  },
  btnStyle: {
    backgroundColor: "#00a680"
  }
});
