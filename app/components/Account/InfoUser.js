import React, { useState } from "react"; // { useState } es un Hook
import { StyleSheet, View, Text } from "react-native";
import { Avatar } from "react-native-elements";
import * as firebase from "firebase/app";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default InfoUser = props => {
  const {
    userInfo: { uid, displayName, email, photoURL }
  } = props;

  const changeAvatar = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;

    if (resultPermissionCamera === "denied") {
      console.log("Es necesario aceptar los permisos de la galería");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (result.cancelled) {
        console.log("Has cerrado la galería de imagenes");
      } else {
        uploadImage(result.uri, uid).then(()=>{
            console.log("Subida OK")
        });
      }
    }
  };

  const uploadImage = async (uri, nameImage) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase
      .storage()
      .ref()
      .child(`avatar/${nameImage}`);
    return ref.put(blob);
  };
  return (
    <View style={styles.viewUserIfo}>
      <Avatar
        rounded
        size="large"
        showEditButton
        onEditPress={changeAvatar}
        containerStyle={styles.userInfoAvatar}
        source={{
          uri: photoURL
            ? photoURL
            : "https://api.adorable.io/avatars/266/abott@adorable.png"
        }}
      />
      <View>
        <Text style={styles.displayName}>
          {displayName ? displayName : "Anónimo"}{" "}
        </Text>
      </View>
      <View>
        <Text>{email ? email : "Social Login"} </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewUserIfo: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    paddingTop: 30,
    paddingBottom: 30
  },
  userInfoAvatar: {
    marginRight: 20
  },
  displayName: {
    fontWeight: "bold"
  }
});
