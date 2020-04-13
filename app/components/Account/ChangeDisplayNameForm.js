import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";

export default ChangeDisplayNameForm = props => {
  const { displayName, setIsVisibleModal, setReloadData, toastRef } = props;
  const [newDisplayName, setNewDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateDisplayName = () => {
    setError(null);
    if (!newDisplayName) {
      setError("No ha introducido ningún nombre");
    } else {
      setIsLoading(true);
      const update ={
          displayName : newDisplayName
      };

      firebase.auth().currentUser.updateProfile(update).then(()=>{
          setIsLoading(false);
          setReloadData(true);
          toastRef.current.show("Nombre actualizado correctamente");
          setIsVisibleModal(false);
      }).catch(()=>{
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
        onChange={e => setNewDisplayName(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2"
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
      
      <Loading isVisible={isLoading} text="Guardando Review" />

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
    width:"95%"
  },
  btnStyle: {
    backgroundColor: "#00a680"
  }
});
