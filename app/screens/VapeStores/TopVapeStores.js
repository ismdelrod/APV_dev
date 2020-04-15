import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import ListTopVapeStores from "../../components/Ranking/ListTopVapeStores";
import { NavigationEvents } from "@react-navigation/compat";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default TopVapeStores = (props) => {
  const { navigation } = props;
  const [stores, setStores] = useState([]);
  const [reloadTop, setReloadTop] = useState(false);
  const toastRef = useRef();

  useEffect(() => {
    db.collection("stores")
    .orderBy("rating", "desc")
    .limit(5)
    .get()
    .then((response) => {
      const storesArray = [];
      response.forEach((doc) => {
        let store = doc.data();
        store.id = doc.id;
        storesArray.push(store);
      });
      setStores(storesArray);
    })
    .catch(() => {
      toastRef.current.show("Error al recuperar el Ranking", 3000);
    });
    setReloadTop(false);
  }, [reloadTop]);

  return (
    <View>
      <NavigationEvents onWillFocus={() => setReloadTop(true)} />
      <ListTopVapeStores stores={stores} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={0.7} />
    </View>
  );
};
