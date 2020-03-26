import React from "react";
import { View, StyleSheet } from "react-native";
import { Input, Icon, Button } from "react-native-elements";

export default RegisterForm = () => {
    
    const register = () =>{
        return console.log("Usuario Registrado");
    }
  return (
    <View style={styles.formContainer} behavior="padding" enabled>
      <Input
        style={styles.inputForm}
        placeholder="Correo electrónico"
        onChange={() => console.log("Actualizado el Correo electrónico")}
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
        secureTextEntry={true}
        containerStyle={styles.inputForm}
        onChange={() => console.log("Actualizada la Contraseña")}
        rightIcon={
          <Icon
            type="material-community"
            name="eye-outline"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Repetir Contraseña"
        passwordRules={true}
        secureTextEntry={true}
        containerStyle={styles.inputForm}
        onChange={() => console.log("Repetir la Contraseña Actualizada")}
        rightIcon={
          <Icon
            type="material-community"
            name="eye-outline"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Button
      title ="Unirse"
      containerStyle={styles.btnContainerRegister}
      buttonStyle ={styles.btnRegister}
      onPress={register}
      />
    </View>
  );
};

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
  btnContainerRegister:{
      marginTop: 20,
      width:"95%"
  },
  btnRegister:{
      backgroundColor:"#00a680"
  }
});
