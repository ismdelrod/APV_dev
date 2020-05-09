// TO DO:  Para Evitar los Warnings sobre el componente ActionButton
import { YellowBox } from "react-native";
import _ from "lodash";
YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};
//********************************************************** */

import React, { useState } from "react"; // useState, useEffect son Hooks
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Text,
} from "react-native";
import { Icon, Avatar, Input, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import MainImage from "../Global/MainImage";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

import uuid from "random-uuid-v4/uuidv4";

export default AddBrandForm = (props) => {
  const { navigation, toastRef, setIsLoading, setIsReloadBrands } = props;
  const [imagesSelected, setImageSelected] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");


  const addBrand = () => {
    if (!brandName || !brandDescription) {
      toastRef.current.show("Todos los campos del formulario son obligatorios");
    } else if (imagesSelected.length === 0) {
      toastRef.current.show("Hay que añadir mínimo una imagen");
    } else {
      setIsLoading(true);
      uploadImageStorage(imagesSelected).then((arrayImages) => {
        db.collection("brands")
          .add({
            name: brandName,
            description: brandDescription,
            images: arrayImages,
            createAt: new Date(),
            createBy: firebase.auth().currentUser.uid,
            isActive: true,
          })
          .then(() => {
            setIsLoading(false);
            setIsReloadBrands(true);
            navigation.navigate("Brands");
          })
          .catch(() => {
            setIsLoading(false);
            toastRef.current.show(
              "Error al añadir el nuevo registro, inténtelo más tarde"
            );
          });
      });
    }
  };

  const uploadImageStorage = async (imagesArray) => {
    const arrayImages = [];
    await Promise.all(
      imagesArray.map(async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("brands-images").child(uuid());

        await ref.put(blob).then((result) => {
          arrayImages.push(result.metadata.name);
        });
      })
    );
    return arrayImages;
  };

  return (
    <ScrollView>
      <MainImage image={imagesSelected[0]} />
      <FormAdd
        setBrandName={setBrandName}
        setBrandDescription={setBrandDescription}
      />
      <UploadImage
        imagesSelected={imagesSelected}
        setImageSelected={setImageSelected}
        toastRef={toastRef}
      />

      <Button
        title="Añadir"
        onPress={addBrand}
        buttonStyle={styles.btnAddBrandStyle}
      />
    </ScrollView>
  );
};

const UploadImage = (props) => {
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

const FormAdd = (props) => {
  const {setBrandName, setBrandDescription} = props;
  return (
    <View style={styles.viewFormStyle}>
      <Input
        placeholder="Nombre de la Marca"
        containerStyle={styles.inputStyle}
        onChange={(e) => setBrandName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Descripción"
        multiline={true}
        inputContainerStyle={styles.textAreaStyle}
        onChange={(e) => setBrandDescription(e.nativeEvent.text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pickerStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
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
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtnStyle: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  btnSaveMapContainerStyle: {
    paddingRight: 10,
  },
  btnSaveMapBtnStyle: {
    backgroundColor: "#00a680",
  },
  btnCancelMapContainerStyle: {
    paddingLeft: 10,
  },
  btnCancelMapBtnStyle: {
    backgroundColor: "#a60d0d",
  },
  btnAddBrandStyle: {
    backgroundColor: "#00a680",
    margin: 20,
  },
});
