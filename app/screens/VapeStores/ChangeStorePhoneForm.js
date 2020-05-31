import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { validatePhoneNumber } from "../../utils/Validation";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default ChangeStorePhoneForm = (props) => {
  const {
    phoneNumber,
    setIsVisibleModal,
    setIsReloadStore,
    setIsReloadStores,
    toastRef,
    store,
    setUpdatedStore,
  } = props;
  const [newPhone, setNewPhone] = useState("");
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  const updatePhone = () => {
    setError({});

    if (!newPhone || newPhone === phoneNumber) {
      setError({
        phoneNumber: "El Teléfono no puede ser el ya registrado ni puede estar vacío",
      });
    } else {
      if (!validatePhoneNumber(newPhone)) {
        setError({
          phoneNumber: "El Teléfono introducido no tiene un formato válido",
        });
      } else {
        setIsLoading(true);
        db.collection("stores")
          .doc(store.id)
          .update({ phoneNumber: newPhone })
          .then((x) => {
            store.phoneNumber = newPhone;
            setUpdatedStore(store);
            setIsLoading(false);
            setIsReloadStore(true);
            setIsReloadStores(true);
            toastRef.current.show("Teléfono actualizado correctamente");
            setIsVisibleModal(false);
          })
          .catch(() => {
            setError("Error al intentar actualizar Teléfono");
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <View style={styles.viewStyle}>
      <Input
        placeholder="Teléfono Actual"
        containerStyle={styles.inputContainerStyle}
        defaultValue={phoneNumber && phoneNumber}
        onChange={(e) => setNewPhone(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "eye-outline",
          color: "#c2c2c2",
        }}
        errorMessage={error.phoneNumber}
      />
      <Button
        title="Editar Teléfono"
        containerStyle={styles.btnContainerStyle}
        buttonStyle={styles.btnStyle}
        onPress={updatePhone}
        loading={isLoading}
      />
      <Loading isVisible={isLoading} text="Guardando Email" />
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
