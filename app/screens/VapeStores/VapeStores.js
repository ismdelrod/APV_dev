import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import ActionButton from "react-native-action-button";
import ListStores from "../../components/VapeStores/ListStores";

import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

// TO DO: Para Evitar los Warnings sobre el componente ActionButton
import { YellowBox } from "react-native";
import _ from "lodash";
YellowBox.ignoreWarnings(["componentWillReceiveProps"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("componentWillReceiveProps") <= -1) {
    _console.warn(message);
  }
};
//********************************************************** */

export default VapeStores = (props) => {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [startStores, setStartStores] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [totalStores, setTotalStores] = useState(0);
  const limitStores = 8;


  //useEffectInfoUsuario
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  //useEffectGetStores
  useEffect(() => {
    db.collection("stores")
      .get()
      .then((snap) => {
        setTotalStores(snap.size);
      });

    (async () => {
      const resultStores = [];

      const listStores = db
        .collection("stores")
        .orderBy("createAt", "desc")
        .limit(limitStores);

      await listStores.get().then((response) => {
        setStartStores(response.docs[response.docs.length - 1]);

        response.forEach((doc) => {
          let store = doc.data();
          store.id = doc.id;
          resultStores.push({ store });
        });
        setStores(resultStores);
      });
    })();
  }, []);
  return (
    <View style={styles.viewBodyStyle}>
      <ListStores stores={stores} isLoading={isLoading}/>
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
