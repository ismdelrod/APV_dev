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
import ListBrands from "../../components/Brands/ListBrands";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);


export default Brands = (props) => {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [brands, setBrands] = useState([]);
  const [startBrands, setStartBrands] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [totalBrands, setTotalBrands] = useState(0);
  const [isReloadBrands, setIsReloadBrands] = useState(false);
  const limitBrands = 8;

  //useEffectInfoUsuario
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  //useEffectGetBrands
  useEffect(() => {
    db.collection("brands")
      .get()
      .then((snap) => {
        setTotalBrands(snap.size);
      });

    (async () => {
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
    setIsReloadBrands(false);
  }, [isReloadBrands]);

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
      <ListBrands
        brands={brands}
        isLoading={isLoading}
        handleLoadMore={handleLoadMore}
        navigation={navigation}
      />
      {user && <AddBrandButton navigation={navigation} setIsReloadBrands={setIsReloadBrands} />}
    </View>
  );
};

AddBrandButton = (props) => {
  const { navigation, setIsReloadBrands } = props;
  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() => navigation.navigate("AddBrand",{setIsReloadBrands})}
    />
  );
};

const styles = StyleSheet.create({
  viewBodyStyle: {
    flex: 1,
  },
});
