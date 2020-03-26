import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import firebase from "firebase/app";

export default UserLogged = () => {
  return (
    <View>
      <Text>UserLogged</Text>
      <Button
        buttonStyle={styles.btnStyle}
        containerStyle={styles.btnContainer}
        tittle="Cerrar Sesión"
        onPress={() => firebase.auth().signOut()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: "#00a680"
  },
  btnContainer: {
    width: "100%",
    height: 30
  }
});
