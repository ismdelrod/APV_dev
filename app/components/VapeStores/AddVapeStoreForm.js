import React, { useState, useEffect } from "react"; // useState, useEffect son Hooks
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { Icon, Avatar, Input, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import MainImage from "../MainImage";
import MapView from "react-native-maps";
import Modal from "../Modal";
import * as Location from "expo-location";

export default AddVapeStoreForm = (props) => {
  const { navigation, toastRef, setIsLoading } = props;
  const [imagesSelected, setImageSelected] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationStore, setLocationStore] = useState(null);
  return (
    <ScrollView>
      <MainImage image={imagesSelected[0]} />
      <FormAdd
        setStoreName={setStoreName}
        setStoreAddress={setStoreAddress}
        setStoreDescription={setStoreDescription}
        setIsVisibleMap={setIsVisibleMap}
        locationStore={locationStore}
      />
      <UploadImage
        imagesSelected={imagesSelected}
        setImageSelected={setImageSelected}
        toastRef={toastRef}
      />

      <GoogleMap
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
    </View>
  );
};

const GoogleMap = (props) => {
  const { isVisibleMap, setIsVisibleMap, setLocationStore, toastRef } = props;
  const [location, setLocation] = useState(null);

  console.log(location);
  
  
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
        const loc = await Location.getCurrentPositionAsync({});
        console.log(loc);
        setLocation({
          latitude: loc.coords.latitude,
          latitudeDelta: 0.001,
          longitude: loc.coords.longitude,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, []);

  
  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={region => setLocation(region)}
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
            // onPress={()=> }
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
});
