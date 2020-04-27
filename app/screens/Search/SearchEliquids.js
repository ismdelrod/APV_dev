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
            <Eliquids eliquid={eliquid} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const Eliquids = (props) => {
  const { eliquid, navigation } = props;
  const { name, images } = eliquid.item;

  const [imageEliquid, setImageEliquid] = useState(null);

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
      onPress={() => navigation.navigate("Eliquid", { eliquid: eliquid.item })}
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
