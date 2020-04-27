import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import ListTopEliquids from "../../components/Ranking/ListTopEliquids";
import { NavigationEvents } from "@react-navigation/compat";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default TopEliquids = (props) => {
  const { navigation } = props;
  const [eliquids, setEliquids] = useState([]);
  const [reloadTop, setReloadTop] = useState(false);
  const toastRef = useRef();

  useEffect(() => {
    db.collection("eliquids")
    .orderBy("rating", "desc")
    .limit(5)
    .get()
    .then((response) => {
      const eliquidsArray = [];
      response.forEach((doc) => {
        let eliquid = doc.data();
        eliquid.id = doc.id;
        eliquidsArray.push(eliquid);
      });
      setEliquids(eliquidsArray);
    })
    .catch(() => {
      toastRef.current.show("Error al recuperar el Ranking", 3000);
    });
    setReloadTop(false);
  }, [reloadTop]);

  return (
    <View>
      <NavigationEvents onWillFocus={() => setReloadTop(true)} />
      <ListTopEliquids eliquids={eliquids} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={0.7} />
    </View>
  );
};
