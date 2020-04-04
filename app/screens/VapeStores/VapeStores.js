import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import ActionButton from "react-native-action-button";
import * as firebase from "firebase";

export default VapeStores = (props) => {
  const { navigation } = props;
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);
  return (
    <View style={styles.viewBodyStyle}>
      <Text>VapeStores</Text>
      {user && <AddVapeStoreButton navigation={navigation} />}
    </View>
  );
};

AddVapeStoreButton = (props) => {
  const { navigation } = props;
  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() => navigation.navigate("AddVapeStore")}
    />
  );
};

const styles = StyleSheet.create({
  viewBodyStyle: {
    flex: 1,
  },
});
