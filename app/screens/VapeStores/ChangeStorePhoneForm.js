import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { reauthenticate } from "../../utils/Api";
import {
  validatePhoneNumber
} from "../../utils/Validation";

export default ChangeStorePhoneForm = props => {
  const { setIsVisibleModal, toastRef } = props;
  const [phone, setPhone] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPhoneRepeat, setNewPhoneRepeat] = useState("");
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hidePhone, setHidePhone] = useState(true);
  const [hideNewPhone, setHideNewPhone] = useState(true);
  const [hideNewPhoneRepeat, setHideNewPhoneRepeat] = useState(true);

  // TO DO: Validar la seguridad del phone
  const updatePhone = () => {
    setError({});

    if (!phone || !newPhone || !newPhoneRepeat) {
      let objError = {};
      !phone && (objError.phone = "No puede estar vacío.");
      !newPhone && (objError.newPhone = "No puede estar vacío.");
      !newPhoneRepeat &&
        (objError.newPhoneRepeat = "No puede estar vacío.");

      setError(objError);
    } else {
      if (!validatePhoneNumber(newPhone, newPhoneRepeat)) {
        setError({
          newPhone: "Las nuevas Contraseñas deben ser idénticas.",
          newPhoneRepeat: "Las nuevas Contraseñas deben ser idénticas."
        });
      } else {
        setIsLoading(true);

        reauthenticate(phone)
          .then(() => {
            firebase
              .auth()
              .currentUser.updatePhone(newPhone)
              .then(() => {
                setIsLoading(false);
                toastRef.current.show("Contraseña actualizada correctamente.");
                setIsVisibleModal(false);
                // firebase.auth().signOut();
              })
              .catch(() => {
                setError({ general: "Error al intentar actualizar Contraseña." });
                setIsLoading(false);
              });
          })
          .catch(() => {
            setError({ phone: "La Contraseña introducida no es correcta." });
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <View style={styles.viewStyle}>
      <Input
        placeholder="Contraseña Actual"
        containerStyle={styles.inputContainerStyle}
        phoneRules={true}
        secureTextEntry={hidePhone}
        onChange={e => setPhone(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hidePhone ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHidePhone(!hidePhone)
        }}
        errorMessage={error.phone}
      />

      <Input
        placeholder="Nueva Contraseña"
        containerStyle={styles.inputContainerStyle}
        phoneRules={true}
        secureTextEntry={hideNewPhone}
        onChange={e => setNewPhone(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPhone ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewPhone(!hideNewPhone)
        }}
        errorMessage={error.newPhone}
      />

      <Input
        placeholder="Repetir Nueva Contraseña"
        containerStyle={styles.inputContainerStyle}
        phoneRules={true}
        secureTextEntry={hideNewPhoneRepeat}
        onChange={e => setNewPhoneRepeat(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPhoneRepeat ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewPhoneRepeat(!hideNewPhoneRepeat)
        }}
        errorMessage={error.newPhoneRepeat}
      />

      <Button
        title="Editar Contraseña"
        containerStyle={styles.btnContainerStyle}
        buttonStyle={styles.btnStyle}
        onPress={updatePhone}
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
