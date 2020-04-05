import React, { useState, useEffect, useRef } from "react"; // useState, useEffect son Hooks
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default AddVapeStoreForm = (props) => {
  const { navigation, toastRef, setIsLoading } = props;
  const [imageSelected, setImageSelected] = useState([]);
  return (
    <ScrollView>
      <UploadImage
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
        toastRef={toastRef}
      />
    </ScrollView>
  );
};

UploadImage = (props) => {
  const { imageSelected, setImageSelected, toastRef } = props;

  const AddImageSelected = async () => {
    debugger;
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    debugger;
    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;
      debugger;
    if (resultPermissionCamera === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos de la Galería, si los rechazaste debes activarlos de forma manual desde los Ajustes del dispositivo.", 5000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing:true,
        aspect:[4, 3]
      })

      if(result.cancelled){
        toastRef.current.show("Has cerrado la galería sin seleccionar ninguna imagen.", 3000);
      }
      else{
        setImageSelected([...imageSelected, result.uri]);//imageSelected += result.uri
      }
    }
  };
  return (
    <View style={styles.viewImageStyle}>
      <Icon
        type="material-community"
        name="camera"
        color="#7a7a7a"
        containerStyle={styles.containerIconCStyle}
        onPress={AddImageSelected}
      />
      <Avatar
        // onPress={()=> }
        style={styles.miniatureStyle}
        // source={{}}
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
});
