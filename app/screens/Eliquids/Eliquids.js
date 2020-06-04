// TO DELETE: Soluciona problema al cargar imagenes en ciertas versiones de firebase
import { decode, encode } from "base-64";
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}
//****************************************************************************** */
// TO DELETE: Para Evitar los Warnings sobre el componente ActionButton
import {
  YellowBox,
  RefreshControl,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import _ from "lodash";
YellowBox.ignoreWarnings(["componentWillReceiveProps"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("componentWillReceiveProps") <= -1) {
    _console.warn(message);
  }
};
//********************************************************** */

import React, { useState, useEffect, useRef, useCallback } from "react";
import ActionButton from "react-native-action-button";
import ListEliquids from "../../components/Eliquids/ListEliquids";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Global/Loading";
import { NavigationEvents } from "@react-navigation/compat";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default Eliquids = (props) => {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [eliquids, setEliquids] = useState([]);
  const [startEliquids, setStartEliquids] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalEliquids, setTotalEliquids] = useState(0);
  const [isReloadEliquids, setIsReloadEliquids] = useState(false);
  const [isReloadEliquid, setIsReloadEliquid] = useState(false);
  const limitEliquids = 8;
  const toastRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIsReloadEliquids(true);
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, [refreshing]);
  //useEffectInfoUsuario
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  //useEffectGetEliquids
  useEffect(() => {
    let mounted = true;
    const updateList = (async () => {
      mounted && setIsReloadEliquids(false);
      await db.collection("eliquids")
        .get()
        .then((snap) => {
          mounted && setTotalEliquids(snap.size);
        });

      const resultEliquids = [];
      const listEliquids = await db
        .collection("eliquids")
        .orderBy("createAt", "desc")
        .limit(limitEliquids);

      await listEliquids.get().then((response) => {
        mounted && setStartEliquids(response.docs[response.docs.length - 1]);

        response.forEach((doc) => {
          let eliquid = doc.data();
          eliquid.id = doc.id;
          resultEliquids.push({ eliquid: eliquid });
        });
        mounted && setEliquids(resultEliquids);
      });
    })();

    return function cleanup() {
      updateList;
      mounted = false;
    };
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
      <ScrollView
        style={styles.viewBodyStyle}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <NavigationEvents onWillFocus={() => setIsReloadEliquids(true)} />
        <ListEliquids
          eliquids={eliquids}
          toastRef={toastRef}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          handleLoadMore={handleLoadMore}
          navigation={navigation}
          setIsReloadEliquids={setIsReloadEliquids}
          setIsReloadEliquid={setIsReloadEliquid}
          isReloadEliquid={isReloadEliquid}
        />
        <Toast ref={toastRef} position="center" opacity={1} />
        <Loading text="Cargando" isVisible={isLoading} />
      </ScrollView>
      {user && (
        <AddEliquidButton
          navigation={navigation}
          setIsReloadEliquids={setIsReloadEliquids}
        />
      )}
    </View>
  );
};

AddEliquidButton = (props) => {
  const { navigation, setIsReloadEliquids } = props;
  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() => navigation.navigate("AddEliquid", { setIsReloadEliquids })}
    />
  );
};

const styles = StyleSheet.create({
  viewBodyStyle: {
    flex: 1,
  },
});
