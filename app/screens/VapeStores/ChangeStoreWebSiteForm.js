import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { validateWebSite } from "../../utils/Validation";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default ChangeStoreWebSiteForm = (props) => {
  const {
    webSite,
    setIsVisibleModal,
    setIsReloadStore,
    setIsReloadStores,
    toastRef,
    store,
    setUpdatedStore,
  } = props;
  const [newWebSite, setNewWebSite] = useState("");
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  const updateWebSite = () => {
    setError({});

    if (!newWebSite || newWebSite === webSite) {
      setError({
        webSite: "La Dirección Web no puede ser la ya registrada ni puede estar vacía",
      });
    } else {
      if (!validateWebSite(newWebSite)) {
        setError({
          webSite: "La Dirección Web introducida no tiene un formato válido",
        });
      } else {
        debugger;
        setIsLoading(true);
        db.collection("stores")
          .doc(store.id)
          .update({ webSite: newWebSite })
          .then((x) => {
            store.webSite = newWebSite;
            setUpdatedStore(store);
            setIsLoading(false);
            setIsReloadStore(true);
            setIsReloadStores(true);
            toastRef.current.show("Dirección Web actualizada correctamente");
            setIsVisibleModal(false);
          })
          .catch(() => {
            setError("Error al intentar actualizar Dirección Web");
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <View style={styles.viewStyle}>
      <Input
        placeholder="Dirección Web Actual"
        containerStyle={styles.inputContainerStyle}
        defaultValue={webSite && webSite}
        onChange={(e) => setNewWebSite(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "eye-outline",
          color: "#c2c2c2",
        }}
        errorMessage={error.webSite}
      />
      <Button
        title="Editar Dirección Web"
        containerStyle={styles.btnContainerStyle}
        buttonStyle={styles.btnStyle}
        onPress={updateWebSite}
        loading={isLoading}
      />
      <Loading isVisible={isLoading} text="Guardando Dirección Web" />
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
