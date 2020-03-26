import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { withNavigation } from "@react-navigation/compat";
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmationIsOK
} from "../../utils/Validation";
import firebase from "firebase/app";
import Loading from "../Loading";

RegisterForm = (props) => {
  const { toastRef, navigation } = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePasswordConfirmation, setHidePasswordConfirmation] = useState(
    true
  );
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const btnRegisterOnPress = async () => {
    const resultEmailValidation = validateEmail(email);
    const resultPasswordValidation = validatePassword(password);
    const resultPasswordConfirmationIsOKValidation = validatePasswordConfirmationIsOK(
      password,
      passwordConfirmation
    );

    setIsVisibleLoading(true);

    if (!email || !password || !passwordConfirmation) {
      toastRef.current.show("Todos los campos son obligatorios");
    } else {
      if (!validateEmail(email)) {
        toastRef.current.show("Email Incorrecto");
      } else {
        if (!validatePasswordConfirmationIsOK(password, passwordConfirmation)) {
          toastRef.current.show("Las contraseñas no son iguales");
        } else {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              navigation.navigate("Account");
            })
            .catch(() => {
              toastRef.current.show(
                "Error al crear la cuenta. Inténtelo más tarde"
              );
            });
        }
      }
    }

    setIsVisibleLoading(false);
  };

  return (
    <View style={styles.formContainer} behavior="padding" enabled>
      <Input
        style={styles.inputForm}
        placeholder="Correo electrónico"
        onChange={e => setEmail(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Contraseña"
        passwordRules={true}
        secureTextEntry={hidePassword}
        containerStyle={styles.inputForm}
        onChange={e => setPassword(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
      />
      <Input
        placeholder="Repetir Contraseña"
        passwordRules={true}
        secureTextEntry={hidePasswordConfirmation}
        containerStyle={styles.inputForm}
        onChange={e => setPasswordConfirmation(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePasswordConfirmation ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() =>
              setHidePasswordConfirmation(!hidePasswordConfirmation)
            }
          />
        }
      />
      <Button
        title="Unirse"
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={btnRegisterOnPress}
      />
      <Loading isVisible={isVisibleLoading} text="Creando Cuenta" />

    </View>
  );
};

export default withNavigation(RegisterForm);

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  inputForm: {
    width: "100%",
    marginTop: 20
  },
  iconRight: {
    color: "#c1c1c1"
  },
  btnContainerRegister: {
    marginTop: 20,
    width: "95%"
  },
  btnRegister: {
    backgroundColor: "#00a680"
  }
});
