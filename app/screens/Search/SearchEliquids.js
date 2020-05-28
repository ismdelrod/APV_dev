import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { useDebouncedCallback } from "use-debounce";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

import { FireSQL } from "firesql";
const fSQL = new FireSQL(db, { includeId: "id" });

export default SearchEliquids = (props) => {
  const { navigation } = props;
  const [eliquids, setEliquids] = useState([]);
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
    if (search) {
      fSQL
        .query(`SELECT * FROM eliquids WHERE name LIKE '${search}%'`)
        .then((response) => {
          setEliquids(response);
        });
    }
  }, 150);
  return (
    <View>
      <SearchBar
        placeholder="Busca tu E-liquid"
        onChangeText={(e) => setSearch(e)}
        value={search}
        containerStyle={styles.searchBarStyle}
      />
      {eliquids.length === 0 ? (
        <NoFoundEliquids />
      ) : (
        <FlatList
          data={eliquids}
          renderItem={(eliquid) => (
            <Eliquids
              userIsAdmin={userIsAdmin}
              eliquid={eliquid}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const Eliquids = (props) => {
  const { eliquid, navigation, userIsAdmin } = props;
  const { name, images } = eliquid.item;

  const [imageEliquid, setImageEliquid] = useState(null);

  const [updatedEliquid, setUpdatedEliquid] = useState(null);
  const [isReloadEliquids, setIsReloadEliquids] = useState(false);
  const [isReloadEliquid, setIsReloadEliquid] = useState(false);

  useEffect(() => {
    const image = images[0];
    firebase
      .storage()
      .ref(`eliquids-images/${image}`)
      .getDownloadURL()
      .then((response) => {
        setImageEliquid(response);
      });
  }, []);

  return (
    <ListItem
      title={name}
      leftAvatar={{ source: { uri: imageEliquid } }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() =>
        navigation.navigate("Eliquid", {
          eliquid: eliquid.item,
          userIsAdmin: userIsAdmin,
          setIsReloadEliquids: setIsReloadEliquids,
          setIsReloadEliquid: setIsReloadEliquid,
          updatedEliquid: eliquid.item,
          setUpdatedEliquid: setUpdatedEliquid,
        })
      }
    />
  );
};

const NoFoundEliquids = () => {
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
