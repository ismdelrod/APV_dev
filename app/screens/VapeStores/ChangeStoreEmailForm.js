import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import { validateEmail } from "../../utils/Validation";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default ChangeStoreEmailForm = (props) => {
  const {
    email,
    setIsVisibleModal,
    setIsReloadStore,
    setIsReloadStores,
    toastRef,
    store,
    setUpdatedStore,
  } = props;
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const updateEmail = () => {
    setError({});

    if (!newEmail || newEmail === email) {
      setError({
        email: "El Email no puede ser el ya registrado ni puede estar vacío",
      });
    } else {
      if (!validateEmail(newEmail)) {
        setError({
          email: "El Email introducido no tiene un formato válido",
        });
      } else {
        debugger;
        setIsLoading(true);

      db.collection("stores") 
        .doc(store.id)
        .update({email: newEmail})
        .then((x) => {
          store.email = newEmail;
          setUpdatedStore(store);
          setIsLoading(false);
          setIsReloadStore(true);
          setIsReloadStores(true);
          toastRef.current.show("Email actualizado correctamente");
          setIsVisibleModal(false);
        })
        .catch(() => {
          setError("Error al intentar actualizar Email");
          setIsLoading(false);
        });
      }
    }
  };

  return (
    <View style={styles.viewStyle}>
      <Input
        placeholder="Nuevo Email"
        containerStyle={styles.inputContainerStyle}
        defaultValue={email && email}
        onChange={(e) => setNewEmail(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
        errorMessage={error.email}
      />
      <Button
        title="Editar Email"
        containerStyle={styles.btnContainerStyle}
        buttonStyle={styles.btnStyle}
        onPress={updateEmail}
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
