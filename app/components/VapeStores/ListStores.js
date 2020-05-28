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
// import * as firebase from "firebase";
// const db = firebase.firestore(firebase);

import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default ListStores = (props) => {
  const {
    stores,
    isLoading,
    handleLoadMore,
    navigation,
    setIsReloadStores,
    setIsReloadStore,
    isReloadStore,
  } = props;
  const [user, setUser] = useState(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [updatedStore, setUpdatedStore] = useState(null);

  //useEffect Validación User Logueado y si es Admin
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
      validateAdmin(userInfo);
    });
  }, []);

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

  //useEffect encargado de actualizar el elemento de la lista justo después de sufrir un cambio (update)
  useEffect(() => {
    debugger;
    if (isReloadStore) {
      setIsReloadStore(false);
      navigation.navigate("VapeStore", {
        store: updatedStore,
        userIsAdmin: userIsAdmin,
        setIsReloadStores: setIsReloadStores,
        setIsReloadStore: setIsReloadStore,
        updatedStore: updatedStore,
        setUpdatedStore: setUpdatedStore,
      });
    }
  }, [isReloadStore]);

  return (
    <View>
      {stores ? (
        <FlatList
          data={stores}
          renderItem={(store) => (
            <Store
              store={store}
              navigation={navigation}
              userIsAdmin={userIsAdmin}
              setIsReloadStores={setIsReloadStores}
              setIsReloadStore={setIsReloadStore}
              setUpdatedStore={setUpdatedStore}
              updatedStore={updatedStore}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderStoreStyle}>
          <ActivityIndicator size="large" />
          <Text>Cargando Stores</Text>
        </View>
      )}
    </View>
  );
};

const Store = (props) => {
  const {
    store,
    navigation,
    userIsAdmin,
    setIsReloadStores,
    setIsReloadStore,
    setUpdatedStore,
    updatedStore,
  } = props;

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
  }),
    [];

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("VapeStore", {
          store: store.item.store,
          userIsAdmin: userIsAdmin,
          setIsReloadStores: setIsReloadStores,
          setIsReloadStore: setIsReloadStore,
          updatedStore: updatedStore,
          setUpdatedStore: setUpdatedStore,
        })
      }
      onLongPress={() => userIsAdmin && console.log("Abrir modal de Borrado")}
    >
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
          <Text style={styles.storeDescriptionStyle}>
            {description.substr(0, 60)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FooterList = (props) => {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundStoresStyle}>
        <Text>No quedan más Tiendas por cargar.</Text>
      </View>
    );
  }
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
  storeAddressStyle: {
    paddingTop: 2,
    color: "grey",
  },
  storeDescriptionStyle: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
  viewLoadingStyle: {
    marginTop: 20,
    alignItems: "center",
  },
  loaderStoreStyle: {
    marginTop: 19,
    marginBottom: 10,
  },
  notFoundStoresStyle: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
