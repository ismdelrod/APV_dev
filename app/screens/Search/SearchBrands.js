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

  useEffect(() => {
    onSearch();
  }, [search]);

  const [onSearch] = useDebouncedCallback(() => {
    if (search) {
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
            <Brands brand={brand} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const Brands = (props) => {
  const { brand, navigation } = props;
  const { name, images } = brand.item;

  const [imageBrand, setImageBrand] = useState(null);

  useEffect(() => {
    const image = images[0];
    firebase
      .storage()
      .ref(`brands-images/${image}`)
      .getDownloadURL()
      .then((response) => {
        setImageBrand(response);
      });
  }, []);

  return (
    <ListItem
      title={name}
      leftAvatar={{ source: { uri: imageBrand } }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() => navigation.navigate("Brand", { brand: brand.item })}
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
