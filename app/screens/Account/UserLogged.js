import React, { useState, useEffect } from "react"; // useState, useEffect son Hooks
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import * as firebase from "firebase/app";
import InfoUser from "../../components/Account/InfoUser";

export default UserLogged = () => {
  const [userInfo, setUserInfo] = useState({});

  //useEffect se ejecuta justo depués de montar un componente o justo después de actualizarse alguna de las variables que contiene su array []
  useEffect(() => {
    (async () => {
      const user = await firebase.auth().currentUser;
      setUserInfo(user.providerData[0])
    })();
  }, []);
  return (
    <View>
      <InfoUser userInfo = {userInfo} />
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
