import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { useDebouncedCallback } from "use-debounce";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

import { FireSQL } from "firesql";
const fSQL = new FireSQL(db, { includeId: "id" });

export default SearchVapeStores = (props) => {
  const { navigation } = props;
  const [stores, setStores] = useState([]);
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
    if(search === ""){setStores([]);}
    else if (search) {
      fSQL
        .query(`SELECT * FROM stores WHERE name LIKE '${search}%'`)
        .then((response) => {
          setStores(response);
        });
    }
  }, 150);
  return (
    <View>
      <SearchBar
        placeholder="Busca tu Tienda"
        onChangeText={(e) => setSearch(e)}
        value={search}
        containerStyle={styles.searchBarStyle}
      />
      {stores.length === 0 ? (
        <NoFoundStores />
      ) : (
        <FlatList
          data={stores}
          renderItem={(store) => (
            <Stores
              userIsAdmin={userIsAdmin}
              store={store}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const Stores = (props) => {
  const { store, navigation, userIsAdmin } = props;
  const { name, images } = store.item;

  const [imageStore, setImageStore] = useState(null);

  const [updatedStore, setUpdatedStore] = useState(null);
  const [isReloadStores, setIsReloadStores] = useState(false);
  const [isReloadStore, setIsReloadStore] = useState(false);

  useEffect(() => {
    const image = images[0];
    firebase
      .storage()
      .ref(`stores-images/${image}`)
      .getDownloadURL()
      .then((response) => {
        setImageStore(response);
      });
  }, [store]);

  return (
    <ListItem
      title={name}
      leftAvatar={{ source: { uri: imageStore } }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() =>
        navigation.navigate("VapeStore", {
          store: store.item,
          userIsAdmin: userIsAdmin,
          setIsReloadStores: setIsReloadStores,
          setIsReloadStore: setIsReloadStore,
          updatedStore: store.item,
          setUpdatedStore: setUpdatedStore,
        })
      }
    />
  );
};

const NoFoundStores = () => {
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
