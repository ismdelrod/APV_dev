import React, { useState, useEffect } from "react";
import { StyleSheet, View, Picker, Text } from "react-native";
import { Button } from "react-native-elements";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default ChangeEliquidBrandForm = (props) => {
  const {
    setIsVisibleModal,
    setIsReloadEliquid,
    setIsReloadEliquids,
    toastRef,
    eliquid,
    setUpdatedEliquid,
    setReloadBrand
  } = props;
  const [newBrandId, setNewBrandId] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [brands, setBrands] = useState([]);
  const [selection, setSelection] = useState(1);

  useEffect(() => {
    const resultBrands = [];
    (async () => {
      const listBrands = db.collection("brands").orderBy("name", "desc");

      await listBrands.get().then((response) => {
        response.forEach((doc) => {
          let brand = doc.data();
          brand.id = doc.id;
          resultBrands.push({ brand });
        });
      });
      setBrands(resultBrands);
    })();
  }, []);

  const updateBrandName = () => {
    setIsLoading(true);
    db.collection("eliquids")
      .doc(eliquid.id)
      .update({ brandId: newBrandId })
      .then((x) => {
        
        eliquid.brandId = newBrandId;
        setUpdatedEliquid(eliquid);
        setIsLoading(false);
        setIsReloadEliquid(true);
        setIsReloadEliquids(true);
        setReloadBrand(true);
        toastRef.current.show("Marca actualizada correctamente");
        setIsVisibleModal(false);
      })
      .catch(() => {
        setError("Error al intentar actualizar Marca");
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.viewStyle}>
      <Text style={{ margin: 10, fontSize: 20, fontWeight: "bold" }}>
        {" "}
        Nueva Marca{" "}
      </Text>

      <Picker
        style={styles.picker}
        mode="dropdown"
        selectedValue={selection}
        itemStyle={styles.itemStyle}
        onValueChange={(newBrandId) => {
          setNewBrandId(newBrandId);
          setSelection(newBrandId);
        }}
      >
        {brands.map((brnd, index) => (
          <Picker.Item
            key={index}
            label={brnd.brand.name}
            value={brnd.brand.id}
          />
        ))}
      </Picker>

      <Button
        title="Editar Marca"
        containerStyle={styles.btnContainerStyle}
        buttonStyle={styles.btnStyle}
        onPress={updateBrandName}
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
  pickerStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  itemStyle: {
    fontSize: 15,
    height: 75,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  picker: {
    width: "80%",
  },
});
