import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default ChangeBrandNameForm = (props) => {
  const {
    displayName,
    setIsVisibleModal,
    setIsReloadBrand,
    setIsReloadBrands,
    toastRef,
    brand,
    setUpdatedBrand
  } = props;
  const [newName, setNewName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const updateDisplayName = () => {
    setError(null);
    if (!newName) {
      setError("No ha introducido ningún nombre");
    } else {
      setIsLoading(true);
      const update = {
        name: newName,
      };
      db.collection("brands") 
        .doc(brand.id)
        .update({name: newName})
        .then((x) => {
          brand.name = newName;
          setUpdatedBrand(brand);
          setIsLoading(false);
          setIsReloadBrand(true);
          setIsReloadBrands(true);
          toastRef.current.show("Nombre actualizado correctamente");
          setIsVisibleModal(false);
        })
        .catch(() => {
          setError("Error al intentar actualizar Nombre");
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={styles.viewStyle}>
      <Input
        placeholder="Nuevo Nombre"
        containerStyle={styles.inputContainerStyle}
        defaultValue={displayName && displayName}
        onChange={(e) => setNewName(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2",
        }}
        errorMessage={error}
      />

      <Button
        title="Editar Nombre"
        containerStyle={styles.btnContainerStyle}
        buttonStyle={styles.btnStyle}
        onPress={updateDisplayName}
        loading={isLoading}
      />

      <Loading isVisible={isLoading} text="Guardando Nombre" />
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
