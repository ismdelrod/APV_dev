import React, { useRef }  from "react";
import { StyleSheet, view, ScrollView, Text, Image, View } from "react-native";
import { Divider } from "react-native-elements";
import LoginForm from "../../components/Account/LoginForm";
import LoginFacebook from "../../components/Account/LoginFacebook";
import Toast from "react-native-easy-toast";

export default Login = props => {
  //navegación por props con restructuring
  const { navigation } = props;
  //inicialización de los toast
  const toastRef = useRef();
  return (
    <ScrollView>
      <Image
        source={require("../../../assets/img/APV_logo.jpg")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.viewContainer}>
        <LoginForm toastRef={toastRef} />
        <CreateAccount navigation={navigation} />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.viewContainer}>
        <LoginFacebook/>
      </View>
      <Toast ref={toastRef} position="top" opacity={0.5} />
    </ScrollView>
  );
};

CreateAccount = props => {
  const { navigation } = props;
  return (
    <Text style={styles.textRegister}>
      ¿Aún no tienes una cuenta?{" "}
      <Text
        style={styles.btnRegister}
        onPress={() => navigation.navigate("Register")}
      >
        Registrar
      </Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20
  },
  viewContainer: {
    marginRight: 40,
    marginLeft: 40
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10
  },
  btnRegister: {
    color: "#00a680",
    fontWeight: "bold"
  },
  divider: {
    backgroundColor: "#00a680",
    margin: 40
  }
});
