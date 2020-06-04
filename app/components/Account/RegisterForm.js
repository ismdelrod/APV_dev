import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { withNavigation } from "@react-navigation/compat";
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmationIsOK,
} from "../../utils/Validation";
// import * as firebase from "firebase";
import Loading from "../Global/Loading";

import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

RegisterForm = (props) => {
  //mensajes de Info/Error y navegación con restructuring
  const { toastRef, navigation } = props;

  //sets de Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  //funcionalidad a los Icons
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePasswordConfirmation, setHidePasswordConfirmation] = useState(
    true
  );
  //visualización de componente
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);

  //Eventos botones
  // TO DO: Añadir validación para email ya registrado
  const btnRegisterOnPress = async () => {
    const resultEmailValidation = validateEmail(email);
    const resultPasswordValidation = validatePassword(password);
    const resultPasswordConfirmationIsOKValidation = validatePasswordConfirmationIsOK(
      password,
      passwordConfirmation
    );

    const addUserRole = (newUser, email) => {
      debugger;

      let uid = newUser.user.uid;
      let emailVerified = newUser.user.emailVerified;

      db.collection("users_roles")
        .add({
          uid: uid,
          email: email,
          admin: false,
          isActive: true,
        })
        .then(() => {})
        .catch(() => {});
    };

    const sendEmailVerification = () => {
      let OK = false;
      firebase
        .auth()
        .currentUser.sendEmailVerification()
        .then(() => {
          firebase.auth().signOut();
          OK = true;
        });
      return OK;
    };

    setIsVisibleLoading(true);
    debugger;
    if (!email || !password || !passwordConfirmation) {
      debugger;
      toastRef.current.show("Todos los campos son obligatorios");
    } else {
      if (!validateEmail(email)) {
        debugger;
        toastRef.current.show("Email Incorrecto");
      } else if (!validatePassword(password)) {
        toastRef.current.show(
          "Mínimo 6 caracteres, máximo 15. Al menos una mayúscula, una minúscula, un dígito, un caracter especial y sin espacios en blanco"
        );
      } else if (
        !validatePasswordConfirmationIsOK(password, passwordConfirmation)
      ) {
        toastRef.current.show("Las contraseñas no son iguales");
      } else {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((newUser) => {
            addUserRole(newUser, email);

            if (sendEmailVerification()) {
              firebase.auth().signOut();

              toastRef.current.show(
                "Se ha enviado un email de confirmación a " +
                  email +
                  "\nPara poder entrar en la Aplicación, antes deberá confirmar el email proporcionado.",
                4000
              );
            } else {
              toastRef.current.show(
                "Ha habido un error en el envío del email de confirmación"
              );
              // TO DO Borrar usuario creado y su user_role
            }

            navigation.navigate("Account");
          })
          .catch(() => {
            debugger;
            toastRef.current.show(
              "Error al crear la cuenta. Inténtelo más tarde"
            );
          });
      }
    }

    setIsVisibleLoading(false);
  };

  return (
    <View style={styles.formContainer} behavior="padding" enabled>
      <Input
        style={styles.inputForm}
        placeholder="Correo electrónico"
        onChange={(e) => setEmail(e.nativeEvent.text)}
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
        onChange={(e) => setPassword(e.nativeEvent.text)}
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
        onChange={(e) => setPasswordConfirmation(e.nativeEvent.text)}
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
    marginTop: 30,
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  iconRight: {
    color: "#c1c1c1",
  },
  btnContainerRegister: {
    marginTop: 20,
    width: "95%",
  },
  btnRegister: {
    backgroundColor: "#00a680",
  },
});
