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

import React, { useState, useEffect } from "react"; // useState, useEffect son Hooks
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { Icon, Avatar, Input, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import MainImage from "../Global/MainImage";
import MapView from "react-native-maps";
import { formPropertieType } from "../../utils/Enumerations";
import Modal from "../Global/Modal";
import {
  validateEmail,
  validatePhoneNumber,
  validateWebSite,
} from "../../utils/Validation";
import * as Location from "expo-location";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

import uuid from "random-uuid-v4/uuidv4";

export default AddVapeStoreForm = (props) => {
  const { navigation, toastRef, setIsLoading, setIsReloadStores } = props;
  const [imagesSelected, setImageSelected] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationStore, setLocationStore] = useState(null);

  const [storeWebSite, setStoreWebSite] = useState("");
  const [storePhoneNumber, setStorePhoneNumber] = useState("");
  const [storeEmail, setStoreEmail] = useState("");

  const addStore = () => {
    let errorMessage = "";

    if (!storeName || !storeAddress || !storeDescription) {
      errorMessage = getErrorMessage(formPropertieType.typeRequireds);
      toastRef.current.show(errorMessage);
    } else if (imagesSelected.length === 0) {
      errorMessage = getErrorMessage(formPropertieType.typeImage);
      toastRef.current.show(errorMessage);
    } else if (!locationStore) {
      errorMessage = getErrorMessage(formPropertieType.typeLocation);
      toastRef.current.show(errorMessage);
    } else {
      if (
        typeof storeEmail !== "undefined" &&
        storeEmail.trim() !== "" &&
        !validateEmail(storeEmail)
      ) {
        errorMessage = getErrorMessage(formPropertieType.typeEmail);
        toastRef.current.show( errorMessage  );
      } else if (
        typeof storePhoneNumber !== "undefined" &&
        storePhoneNumber.trim() !== "" &&
        !validatePhoneNumber(storePhoneNumber)
      ) {
        errorMessage = getErrorMessage(formPropertieType.typePhone);
        toastRef.current.show( errorMessage );
      } else if (
        typeof storeWebSite !== "undefined" &&
        storeWebSite.trim() !== "" &&
        !validateWebSite(storeWebSite)
      ) {
        errorMessage = getErrorMessage(formPropertieType.typeWebSite);
        toastRef.current.show( errorMessage );
      } else {
        setIsLoading(true);
        uploadImageStorage(imagesSelected).then((arrayImages) => {
          db.collection("stores")
            .add({
              name: storeName,
              address: storeAddress,
              description: storeDescription,
              location: locationStore,
              webSite: storeWebSite,
              phoneNumber: storePhoneNumber,
              email: storeEmail,
              images: arrayImages,
              rating: 0,
              ratingTotal: 0,
              quantityVoting: 0,
              createAt: new Date(),
              createBy: firebase.auth().currentUser.uid,
              isActive: false,
            })
            .then(() => {
              setIsLoading(false);
              setIsReloadStores(true);
              navigation.navigate("VapeStores");
            })
            .catch(() => {
              setIsLoading(false);
              toastRef.current.show(
                "Error al añadir el nuevo registro, inténtelo más tarde"
              );
            });
        });
      }
    }
  };

  const uploadImageStorage = async (imagesArray) => {
    const arrayImages = [];
    await Promise.all(
      imagesArray.map(async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("stores-images").child(uuid());

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
        setStoreName={setStoreName}
        setStoreAddress={setStoreAddress}
        setStoreDescription={setStoreDescription}
        setStoreWebSite={setStoreWebSite}
        setStorePhoneNumber={setStorePhoneNumber}
        setStoreEmail={setStoreEmail}
        setIsVisibleMap={setIsVisibleMap}
        locationStore={locationStore}
      />
      <UploadImage
        imagesSelected={imagesSelected}
        setImageSelected={setImageSelected}
        toastRef={toastRef}
      />

      <Button
        title="Añadir"
        onPress={addStore}
        buttonStyle={styles.btnAddStoreStyle}
      />
      <MyMap
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationStore={setLocationStore}
        toastRef={toastRef}
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
  const {
    setStoreName,
    setStoreAddress,
    setStoreDescription,
    setStoreWebSite,
    setStorePhoneNumber,
    setStoreEmail,
    setIsVisibleMap,
    locationStore,
  } = props;
  return (
    <View style={styles.viewFormStyle}>
      <Input
        placeholder="Nombre de la Tienda"
        containerStyle={styles.inputStyle}
        onChange={(e) => setStoreName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Dirección"
        containerStyle={styles.inputStyle}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationStore ? "#00a680" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
        onChange={(e) => setStoreAddress(e.nativeEvent.text)}
      />
      <Input
        placeholder="Descripción"
        multiline={true}
        inputContainerStyle={styles.textAreaStyle}
        onChange={(e) => setStoreDescription(e.nativeEvent.text)}
      />
      <Input
        placeholder="Página Web"
        containerStyle={styles.inputStyle}
        onChange={(e) => setStoreWebSite(e.nativeEvent.text)}
      />
      <Input
        placeholder="Nº Teléfono"
        containerStyle={styles.inputStyle}
        onChange={(e) => setStorePhoneNumber(e.nativeEvent.text)}
      />
      <Input
        placeholder="Email"
        containerStyle={styles.inputStyle}
        onChange={(e) => setStoreEmail(e.nativeEvent.text)}
      />
    </View>
  );
};

const MyMap = (props) => {
  const { isVisibleMap, setIsVisibleMap, setLocationStore, toastRef } = props;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );
      const statusPermission = resultPermissions.permissions.location.status;

      if (statusPermission !== "granted") {
        toastRef.current.show(
          "Es necesario aceptar los permisos de Localización, si los rechazaste debes activarlos de forma manual desde los Ajustes del dispositivo.",
          5000
        );
      } else {
        const loc = await Location.getCurrentPositionAsync({
          enableHighAccurracy: true,
        });
        setLocation({
          latitude: loc.coords.latitude,
          latitudeDelta: 0.001,
          longitude: loc.coords.longitude,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationStore(location);
    toastRef.current.show("Se ha guardado la localización");
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
            />
          </MapView>
        )}

        <View style={styles.viewMapBtnStyle}>
          <Button
            title="Guardar"
            onPress={confirmLocation}
            containerStyle={styles.btnSaveMapContainerStyle}
            buttonStyle={styles.btnSaveMapBtnStyle}
          />
          <Button
            title="Cancelar"
            onPress={() => setIsVisibleMap(false)}
            containerStyle={styles.btnCancelMapContainerStyle}
            buttonStyle={styles.btnCancelMapBtnStyle}
          />
        </View>
      </View>
    </Modal>
  );
};

const getErrorMessage = (type) => {
  let errorMessage = "";
  if (type === formPropertieType.typeRequireds) {
    errorMessage =
      "Falta por introducir alguno de los campos obligatorios (nombre, dirección, localización o descripción)";
  } else if (type === formPropertieType.typeImage) {
    errorMessage = "Hay que añadir mínimo una imagen";
  } else if (type === formPropertieType.typeLocation) {
    errorMessage = "Tienes que ubicar la dirección en el mapa";
  } else {
    if (type === formPropertieType.typeEmail) {
      errorMessage = "El Email introducido no tiene un formato válido";
    } else if (type === formPropertieType.typePhone) {
      errorMessage = "El Nº de Teléfono introducido no tiene un formato válido";
    } else if (type === formPropertieType.typeWebSite) {
      errorMessage = "La Página Web introducida no tiene un formato válido";
    }
  }
  return errorMessage;
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
  btnAddStoreStyle: {
    backgroundColor: "#00a680",
    margin: 20,
  },
});
