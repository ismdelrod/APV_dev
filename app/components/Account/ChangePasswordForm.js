import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { reauthenticate } from "../../utils/Api";
import {
  validatePassword,
  validatePasswordConfirmationIsOK,
} from "../../utils/Validation";

export default ChangePasswordForm = (props) => {
  const { setIsVisibleModal, toastRef } = props;
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideNewPasswordRepeat, setHideNewPasswordRepeat] = useState(true);

  const updatePassword = () => {
    setError({});

    if (!password || !newPassword || !newPasswordRepeat) {
      let objError = {};
      !password && (objError.password = "No puede estar vacío.");
      !newPassword && (objError.newPassword = "No puede estar vacío.");
      !newPasswordRepeat &&
        (objError.newPasswordRepeat = "No puede estar vacío.");

      setError(objError);
    } else {
      if (!validatePassword(newPassword)) {
        setError({
          newPassword:
            "Mínimo 6 caracteres, máximo 15. Al menos una mayúscula, una minúscula, un dígito, un caracter especial y sin espacios en blanco",
        });
      } else {
        if (!validatePasswordConfirmationIsOK(newPassword, newPasswordRepeat)) {
          setError({
            newPassword: "Las nuevas Contraseñas deben ser idénticas.",
            newPasswordRepeat: "Las nuevas Contraseñas deben ser idénticas.",
          });
        } else {
          setIsLoading(true);

          reauthenticate(password)
            .then(() => {
              firebase
                .auth()
                .currentUser.updatePassword(newPassword)
                .then(() => {
                  setIsLoading(false);
                  toastRef.current.show(
                    "Contraseña actualizada correctamente."
                  );
                  setIsVisibleModal(false);
                  firebase.auth().signOut();
                })
                .catch(() => {
                  setError({
                    general: "Error al intentar actualizar Contraseña.",
                  });
                  setIsLoading(false);
                });
            })
            .catch(() => {
              setError({
                password: "La Contraseña introducida no es correcta.",
              });
              setIsLoading(false);
            });
        }
      }
    }
  };

  return (
    <View style={styles.viewStyle}>
      <Input
        placeholder="Contraseña Actual"
        containerStyle={styles.inputContainerStyle}
        passwordRules={true}
        secureTextEntry={hidePassword}
        onChange={(e) => setPassword(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hidePassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHidePassword(!hidePassword),
        }}
        errorMessage={error.password}
      />

      <Input
        placeholder="Nueva Contraseña"
        containerStyle={styles.inputContainerStyle}
        passwordRules={true}
        secureTextEntry={hideNewPassword}
        onChange={(e) => setNewPassword(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewPassword(!hideNewPassword),
        }}
        errorMessage={error.newPassword}
      />

      <Input
        placeholder="Repetir Nueva Contraseña"
        containerStyle={styles.inputContainerStyle}
        passwordRules={true}
        secureTextEntry={hideNewPasswordRepeat}
        onChange={(e) => setNewPasswordRepeat(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPasswordRepeat ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewPasswordRepeat(!hideNewPasswordRepeat),
        }}
        errorMessage={error.newPasswordRepeat}
      />

      <Button
        title="Editar Contraseña"
        containerStyle={styles.btnContainerStyle}
        buttonStyle={styles.btnStyle}
        onPress={updatePassword}
        loading={isLoading}
      />
      <Text>{error.general}</Text>
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
