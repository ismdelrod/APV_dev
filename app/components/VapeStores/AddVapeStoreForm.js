import React, { useState, useEffect, useRef } from "react"; // useState, useEffect son Hooks
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { Icon, Avatar, Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import MainImage from "../MainImage";

export default AddVapeStoreForm = (props) => {
  const { navigation, toastRef, setIsLoading } = props;
  const [imagesSelected, setImageSelected] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  return (
    <ScrollView>
      <MainImage image={imagesSelected[0]} />
      <FormAdd
        setStoreName={setStoreName}
        setStoreAddress={setStoreAddress}
        setStoreDescription={setStoreDescription}
      />
      <UploadImage
        imagesSelected={imagesSelected}
        setImageSelected={setImageSelected}
        toastRef={toastRef}
      />
    </ScrollView>
  );
};

UploadImage = (props) => {
  const { imagesSelected, setImageSelected, toastRef } = props;

  const addImageSelected = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;
    if (resultPermissionCamera === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos de la Galería, si los rechazaste debes activarlos de forma manual desde los Ajustes del dispositivo.",
        5000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galería sin seleccionar ninguna imagen.",
          3000
        );
      } else {
        setImageSelected([...imagesSelected, result.uri]); //imagesSelected += result.uri
      }
    }
  };

  const removeImage = (img) => {
    const arrayImages = imagesSelected;

    Alert.alert(
      "Eliminar Imagen",
      "¿Estás seguro de querer eliminar esta imagen?",
      [
        {
          text: "cancel",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () =>
            setImageSelected(arrayImages.filter((imgUrl) => imgUrl !== img)),
        },
      ],
      { cancelable: false }
    );
  };

  console.log(imagesSelected);
  return (
    <View style={styles.viewImageStyle}>
      {imagesSelected.length < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIconCStyle}
          onPress={addImageSelected}
        />
      )}

      {imagesSelected.map((image, index) => (
        <Avatar
          key={index}
          onPress={() => removeImage(image)}
          style={styles.miniatureStyle}
          source={{ uri: image }}
        />
      ))}
    </View>
  );
};

FormAdd = (props) => {
  const{setStoreName, setStoreAddress, setStoreDescription} = props;
  return (
    <View style={styles.viewFormStyle}>
      <Input
        placeholder="Nombre de la Tienda"
        containerStyle={styles.inputStyle}
        onChange={(e)=>setStoreName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Dirección"
        containerStyle={styles.inputStyle}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: "#c2c2c2",
          // onPress={()=>}
        }}
        onChange={(e)=>setStoreAddress(e.nativeEvent.text)}
      />
      <Input
        placeholder="Descripción"
        multiline={true}
        inputContainerStyle={styles.textAreaStyle}
        onChange={(e)=>setStoreDescription(e.nativeEvent.text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewImageStyle: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIconCStyle: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    marginRight: 10,
    height: 70,
    width: 70,
  },
  viewFormStyle: {
    marginLeft: 10,
    marginRight: 10,
  },
  inputStyle: {
    marginBottom: 10,
  },
  textAreaStyle: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
});
