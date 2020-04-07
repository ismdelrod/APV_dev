import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import * as firebase from "firebase";

// const db = firebase.firestore(firebase);

export default ListStores = (props) => {
  const { stores, isLoading } = props;

  return (
    <View>
      {stores ? (
        <FlatList
          data={stores}
          renderItem={(store) => <Store store={store} />}
          keyExtractor={(item, index) => index.toString()}
          //    onEndReached={}
          onEndReachedThreshold={0}
          // ListFooterComponent={}
        />
      ) : (
        <View style={styles.loadingStoresStyle}>
          <ActivityIndicator size="large" />
          <Text>Cargando Stores</Text>
        </View>
      )}
    </View>
  );
};

const Store = (props) => {
  const { store } = props;
  const { name, address, description, images } = store.item.store;
  const [imageStore, setImageStore] = useState(null);
  
  useEffect(() => {
    const image = images[0];

    firebase
      .storage()
      .ref(`stores-images/${image}`)
      .getDownloadURL()
      .then((resultUrlImage) => {
        setImageStore(resultUrlImage);
      });
  });

  return (
    <TouchableOpacity onPress={() => console.log("Ir a la tienda")}>
      <View style={styles.viewStoreStyle}>
        <View style={styles.viewStoreImageStyle}>
          <Image
            resizeMode="cover"
            source={{ uri: imageStore }}
            style={styles.storeImageStyle}
            PlaceholderContent={<ActivityIndicator color="fff" />}
          />
        </View>
        <View>
          <Text style={styles.storeNameStyle}>{name}</Text>
          <Text style={styles.storeAddressStyle}>{address}</Text>
          <Text style={styles.storeDescriptionStyle}>{description.substr(0,60)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loadingStoresStyle: {
    marginTop: 20,
    alignItems: "center",
  },
  viewStoreStyle: {
    flexDirection: "row",
    margin: 10,
  },
  viewStoreImageStyle: {
    marginRight: 15,
  },
  storeImageStyle: {
    width: 80,
    height: 80,
  },
  storeNameStyle: {
    fontWeight: "bold",
  },
  storeAddressStyle:{
      paddingTop:2,
      color:"grey"
  },
  storeDescriptionStyle:{
    paddingTop:2,
      color:"grey",
      width:300
  }
});
