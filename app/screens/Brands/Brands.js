// TO DO: Soluciona problema al cargar imagenes en ciertas versiones de firebase
import { decode, encode } from "base-64";
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}
//****************************************************************************** */
// TO DO: Para Evitar los Warnings sobre el componente ActionButton
import { YellowBox, RefreshControl, View, StyleSheet, ScrollView } from "react-native";
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
import ListBrands from "../../components/Brands/ListBrands";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Global/Loading";
import { NavigationEvents } from "@react-navigation/compat";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default Brands = (props) => {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [brands, setBrands] = useState([]);
  const [startBrands, setStartBrands] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalBrands, setTotalBrands] = useState(0);
  const [isReloadBrands, setIsReloadBrands] = useState(false);
  const [isReloadBrand, setIsReloadBrand] = useState(false);
  const limitBrands = 8;
  const toastRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIsReloadBrands(true);
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, [refreshing]);

  //useEffectInfoUsuario
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
      validateAdmin(userInfo);
    });
  }, []);

  //useEffectGetBrands
  useEffect(() => {
    setIsReloadBrands(false);
    db.collection("brands")
      .get()
      .then((snap) => {
        setTotalBrands(snap.size);
      });

    const updateList = (async () => {
      const resultBrands = [];
      const listBrands = db
        .collection("brands")
        .orderBy("createAt", "desc")
        .limit(limitBrands);

      await listBrands.get().then((response) => {
        setStartBrands(response.docs[response.docs.length - 1]);
        response.forEach((doc) => {
          let brand = doc.data();
          brand.id = doc.id;
          resultBrands.push({ brand: brand });
        });
        setBrands(resultBrands);
      });
    })();
    
    return () => {
      debugger;
      updateList;
    };
  }, [isReloadBrands]);

  const validateAdmin = (user) => {
    if (user) {
      const resultUsers = [];
      const idUser = user.uid;
      db.collection("users_roles")
        .where("uid", "==", idUser)
        .get()
        .then((response) => {
          if (response.docs.length > 0) {
            response.forEach((doc) => {
              let user_role = doc.data();
              resultUsers.push({ user_role });
            });
          }
          setUserIsAdmin(resultUsers[0].user_role.admin);
        })
        .catch(() => {});
    }
  };

  const handleLoadMore = async () => {
    const resultBrands = [];
    brands.legth < totalBrands && setIsLoading(true);

    const brandsDB = db
      .collection("brands")
      .orderBy("createAt", "desc")
      .startAfter(startBrands.data().createAt)
      .limit(limitBrands);

    await brandsDB.get().then((response) => {
      if (response.docs.length > 0) {
        setStartBrands(response.docs[response.docs.length - 1]);
      } else {
        setIsLoading(false);
      }

      response.forEach((doc) => {
        let brand = doc.data();
        brand.id = doc.id;
        resultBrands.push({ brand: brand });
      });

      setBrands([...brands, ...resultBrands]);
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
        <NavigationEvents onWillFocus={() => setIsReloadBrands(true)} />
        <ListBrands
          brands={brands}
          toastRef={toastRef}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          handleLoadMore={handleLoadMore}
          navigation={navigation}
          setIsReloadBrands={setIsReloadBrands}
          setIsReloadBrand={setIsReloadBrand}
          isReloadBrand={isReloadBrand}
        />
        <Toast ref={toastRef} position="center" opacity={1} />
        <Loading text="Cargando" isVisible={isLoading} />
      </ScrollView>
      {user && userIsAdmin && (
        <AddBrandButton
          navigation={navigation}
          setIsReloadBrands={setIsReloadBrands}
        />
      )}
    </View>
  );
};

AddBrandButton = (props) => {
  const { navigation, setIsReloadBrands } = props;
  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() => navigation.navigate("AddBrand", { setIsReloadBrands })}
    />
  );
};

const styles = StyleSheet.create({
  viewBodyStyle: {
    flex: 1,
  },
});
