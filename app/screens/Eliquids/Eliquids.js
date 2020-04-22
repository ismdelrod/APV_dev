// TO DO: Soluciona problema al cargar imagenes en ciertas versiones de firebase
import {decode, encode} from 'base-64'
if (!global.btoa) {
    global.btoa = encode;
}
if (!global.atob) {
    global.atob = decode;
}
//****************************************************************************** */
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

import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ActionButton from "react-native-action-button";
import ListEliquids from "../../components/Eliquids/ListEliquids";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);


export default Eliquids = (props) => {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [eliquids, setEliquids] = useState([]);
  const [startEliquids, setStartEliquids] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [totalEliquids, setTotalEliquids] = useState(0);
  const [isReloadEliquids, setIsReloadEliquids] = useState(false);
  const limitEliquids = 8;

  //useEffectInfoUsuario
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  //useEffectGetEliquids
  useEffect(() => {
    db.collection("eliquids")
      .get()
      .then((snap) => {
        setTotalEliquids(snap.size);
      });

    (async () => {
      const resultEliquids = [];

      const listEliquids = db
        .collection("eliquids")
        .orderBy("createAt", "desc")
        .limit(limitEliquids);

      await listEliquids.get().then((response) => {
        setStartEliquids(response.docs[response.docs.length - 1]);

        response.forEach((doc) => {
          let eliquid = doc.data();
          eliquid.id = doc.id;
          resultEliquids.push({ eliquid: eliquid });
        });
        setEliquids(resultEliquids);
      });
    })();
    setIsReloadEliquids(false);
  }, [isReloadEliquids]);

  const handleLoadMore = async () => {
    const resultEliquids = [];
    eliquids.legth < totalEliquids && setIsLoading(true);

    const eliquidsDB = db
      .collection("eliquids")
      .orderBy("createAt", "desc")
      .startAfter(startEliquids.data().createAt)
      .limit(limitEliquids);

    await eliquidsDB.get().then((response) => {
      if (response.docs.length > 0) {
        setStartEliquids(response.docs[response.docs.length - 1]);
      } else {
        setIsLoading(false);
      }

      response.forEach((doc) => {
        let eliquid = doc.data();
        eliquid.id = doc.id;
        resultEliquids.push({ eliquid: eliquid });
      });

      setEliquids([...eliquids, ...resultEliquids]);
    });
  };
  return (
    <View style={styles.viewBodyStyle}>
      <ListEliquids
        eliquids={eliquids}
        isLoading={isLoading}
        handleLoadMore={handleLoadMore}
        navigation={navigation}
      />
      {user && <AddEliquidButton navigation={navigation} setIsReloadEliquids={setIsReloadEliquids} />}
    </View>
  );
};

AddEliquidButton = (props) => {
  const { navigation, setIsReloadEliquids } = props;
  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() => navigation.navigate("AddEliquid",{setIsReloadEliquids})}
    />
  );
};

const styles = StyleSheet.create({
  viewBodyStyle: {
    flex: 1,
  },
});
