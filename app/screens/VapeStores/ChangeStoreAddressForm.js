import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default ChangeStoreAddressForm = (props) => {
  const {
    address,
    setIsVisibleModal,
    setIsReloadStore,
    setIsReloadStores,
    toastRef,
    store,
    setUpdatedStore
  } = props;
  const [newAddress, setNewAddress] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const updateAddress = () => {
    setError(null);
    if (!newAddress) {
      setError("No ha introducido ninguna Dirección");
    } else {
      setIsLoading(true);

      db.collection("stores") 
        .doc(store.id)
        .update({address: newAddress})
        .then((x) => {
          store.address = newAddress;
          setUpdatedStore(store);
          setIsLoading(false);
          setIsReloadStore(true);
          setIsReloadStores(true);
          toastRef.current.show("Dirección actualizada correctamente");
          setIsVisibleModal(false);
        })
        .catch(() => {
          setError("Error al intentar actualizar Dirección");
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={styles.viewStyle}>
      <Input
        placeholder="Nueva Dirección"
        containerStyle={styles.inputContainerStyle}
        defaultValue={address && address}
        onChange={(e) => setNewAddress(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          address: "account-circle-outline",
          color: "#c2c2c2",
        }}
        errorMessage={error}
      />

      <Button
        title="Editar Dirección"
        containerStyle={styles.btnContainerStyle}
        buttonStyle={styles.btnStyle}
        onPress={updateAddress}
        loading={isLoading}
      />

      <Loading isVisible={isLoading} text="Guardando Dirección" />
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
