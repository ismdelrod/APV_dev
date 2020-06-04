import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { useDebouncedCallback } from "use-debounce";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

import { FireSQL } from "firesql";
const fSQL = new FireSQL(db, { includeId: "id" });

export default SearchBrands = (props) => {
  const { navigation } = props;
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [userLogged, setUserLogged] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
    validateAdmin(user);
  });

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

  useEffect(() => {
    onSearch();
  }, [search]);

  const [onSearch] = useDebouncedCallback(() => {
    if(search === ""){setBrands([]);}
    else if (search) {
      fSQL
        .query(`SELECT * FROM brands WHERE name LIKE '${search}%'`)
        .then((response) => {
          setBrands(response);
        });
    }
  }, 150);
  return (
    <View>
      <SearchBar
        placeholder="Busca tu Marca de E-Liquid"
        onChangeText={(e) => setSearch(e)}
        value={search}
        containerStyle={styles.searchBarStyle}
      />
      {brands.length === 0 ? (
        <NoFoundBrands />
      ) : (
        <FlatList
          data={brands}
          renderItem={(brand) => (
            <Brands
              userIsAdmin={userIsAdmin}
              brand={brand}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const Brands = (props) => {
  const { brand, navigation, userIsAdmin } = props;
  const { name, images } = brand.item;

  const [imageBrand, setImageBrand] = useState(null);

  const [updatedBrand, setUpdatedBrand] = useState(null);
  const [isReloadBrands, setIsReloadBrands] = useState(false);
  const [isReloadBrand, setIsReloadBrand] = useState(false);

  useEffect(() => {
    const image = images[0];
    firebase
      .storage()
      .ref(`brands-images/${image}`)
      .getDownloadURL()
      .then((response) => {
        setImageBrand(response);
      });
  }, [brand]);

  return (
    <ListItem
      title={name}
      leftAvatar={{ source: { uri: imageBrand } }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() =>
        navigation.navigate("Brand", {
          brand: brand.item,
          userIsAdmin: userIsAdmin,
          setIsReloadBrands: setIsReloadBrands,
          setIsReloadBrand: setIsReloadBrand,
          updatedBrand: brand.item,
          setUpdatedBrand: setUpdatedBrand,
        })
      }
    />
  );
};

const NoFoundBrands = () => {
  return (
    <View style={styles.viewNoFound}>
      <Image
        source={require("../../../assets/img/no-result-found.png")}
        resizeMode="cover"
        style={styles.imageNoFoundStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarStyle: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
  viewNoFound: {
    flex: 1,
    alignItems: "center",
  },
  imageNoFoundStyle: {
    width: 250,
    height: 250,
    marginTop: 100,
  },
});
