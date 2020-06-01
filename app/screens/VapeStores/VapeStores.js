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
import ListStores from "../../components/VapeStores/ListStores";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Global/Loading";
import { NavigationEvents } from "@react-navigation/compat";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default VapeStores = (props) => {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [startStores, setStartStores] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalStores, setTotalStores] = useState(0);
  const [isReloadStores, setIsReloadStores] = useState(false);
  const [isReloadStore, setIsReloadStore] = useState(false);
  const limitStores = 8;
  const toastRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIsReloadStores(true);
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

  //useEffectGetStores
  useEffect(() => {
    setStores([]);
    setIsReloadStores(false);
    db.collection("stores")
      .get()
      .then((snap) => {
        setTotalStores(snap.size);
      });
    
      const updateList = (async () => {
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

    return () => {
      updateList;
    };
  }, [isReloadStores]);

  const handleLoadMore = async () => {
    const resultStores = [];
    stores.legth < totalStores && setIsLoading(true);

    const storesDB = db
      .collection("stores")
      .orderBy("createAt", "desc")
      .startAfter(startStores.data().createAt)
      .limit(limitStores);

    await storesDB.get().then((response) => {
      if (response.docs.length > 0) {
        setStartStores(response.docs[response.docs.length - 1]);
      } else {
        setIsLoading(false);
      }

      response.forEach((doc) => {
        let store = doc.data();
        store.id = doc.id;
        resultStores.push({ store });
      });

      setStores([...stores, ...resultStores]);
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
        <NavigationEvents onWillFocus={() => setIsReloadStores(true)} />
        <ListStores
          stores={stores}
          toastRef={toastRef}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          handleLoadMore={handleLoadMore}
          navigation={navigation}
          setIsReloadStores={setIsReloadStores}
          setIsReloadStore={setIsReloadStore}
          isReloadStore={isReloadStore}
        />
        <Toast ref={toastRef} position="center" opacity={1} />
        <Loading text="Cargando" isVisible={isLoading} />
      </ScrollView>
      {user && (
        <AddVapeStoreButton
          navigation={navigation}
          setIsReloadStores={setIsReloadStores}
        />
      )}
    </View>
  );
};

AddVapeStoreButton = (props) => {
  const { navigation, setIsReloadStores } = props;
  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() => navigation.navigate("AddVapeStore", { setIsReloadStores })}
    />
  );
};

const styles = StyleSheet.create({
  viewBodyStyle: {
    flex: 1,
  },
});
