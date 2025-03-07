import React, { useState } from "react"; // { useState } es un Hook
import { View, StyleSheet } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { withNavigation } from "@react-navigation/compat";
import { validateEmail, validatePassword } from "../../utils/Validation";
import * as firebase from "firebase/app";
import Loading from "../Global/Loading";

LoginForm = (props) => {
  //mensajes de Info/Error y navegación por props con restructuring
  const { toastRef, navigation } = props;

  //Sets de Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //funcionalidad a los Icons
  const [hidePassword, setHidePassword] = useState(true);
  //visualización de componente
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);

  //Eventos botones
  // TO DO: Añadir validación para email ya registrado
  const btnLoginOnPress = async () => {

    setIsVisibleLoading(true);

    if (!email || !password) {
      toastRef.current.show("Todos los campos son obligatorios");
    } else {
      if (!validateEmail(email)) {
        toastRef.current.show(
          "El Email introducido no tiene un formato válido"
        );
      } else {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            if(firebase.auth().currentUser.emailVerified){
            navigation.navigate("Account");
            }
            else{
              toastRef.current.show(
                "Se ha enviado un email de confirmación a " +
                  email +
                  "\nPara poder entrar en la Aplicación, antes deberá confirmar el email proporcionado.",
                4000
              );
            }
          })
          .catch(() => {
            toastRef.current.show(
              "Error al iniciar Sesión. Inténtelo más tarde"
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
        containerStyle={styles.inputForm}
        passwordRules={true}
        secureTextEntry={hidePassword}
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

      <Button
        title="Iniciar Sesión"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
        onPress={btnLoginOnPress}
      />

      <Loading isVisible={isVisibleLoading} text="Iniciando Sesión" />
    </View>
  );
};

export default withNavigation(LoginForm);

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
  btnContainerLogin: {
    marginTop: 20,
    width: "95%",
  },
  btnLogin: {
    backgroundColor: "#00a680",
  },
});
