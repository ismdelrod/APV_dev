import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image } from "react-native-elements";
// import * as firebase from "firebase";
// const db = firebase.firestore(firebase);

import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default ListStores = (props) => {
  const {
    stores,
    setIsLoading,
    isLoading,
    handleLoadMore,
    navigation,
    setIsReloadStores,
    setIsReloadStore,
    isReloadStore,
    toastRef,
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
              setIsLoading={setIsLoading}
              navigation={navigation}
              userIsAdmin={userIsAdmin}
              setIsReloadStores={setIsReloadStores}
              setIsReloadStore={setIsReloadStore}
              setUpdatedStore={setUpdatedStore}
              updatedStore={updatedStore}
              toastRef={toastRef}
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
    setIsLoading,
    navigation,
    userIsAdmin,
    setIsReloadStores,
    setIsReloadStore,
    setUpdatedStore,
    updatedStore,
    toastRef,
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

  const confirmRemoveStore = () => {
    let storeName = store.item.store.name;
    Alert.alert(
      "Eliminar Tienda",
      "¿Estás seguro de querer eliminar a la Tienda: " + storeName + "?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: removeStore,
        },
      ],
      { cancelable: false }
    );
  };

  const removeStore = () => {
    let storeId = store.item.store.id;
    let imagesArray = store.item.store.images;
    setIsLoading(true);
    //Elimina la Tienda
    db.collection("stores")
      .doc(storeId)
      .delete()
      .then(() => {
        toastRef.current.show("Tienda Eliminada");
        setIsLoading(false);
        setIsReloadStores(true);
      })
      .catch((error) => {
        toastRef.current.show(
          "No se ha podido eliminar la Tienda, intentarlo más tarde"
        );
      });
    //Elimina los Favoritos asociados a la Tienda
    db.collection("favorites")
      .where("idFavorite", "==", storeId)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          response.forEach((doc) => {
            const idFavorite = doc.id;
            db.collection("favorites")
              .doc(idFavorite)
              .delete()
              .then(() => {
                toastRef.current.show(
                  "Eliminados los Favoritos asociados a la Tienda: " + storeName
                );
              })
              .catch(() => {});
          });
        }
      })
      .catch(() => {});

    // TO DO Solucionar el borrado de Imágenes asociadas a la Tienda eliminada.
    //Elimina las Imágenes asociados a la Tienda
    // if (imagesArray.length > 0) {

    //   imagesArray.forEach(async (image) => {
    //   const response = await fetch(image);
    //   const blob = await response.blob();
    //   const ref = firebase.storage().ref("stores-images").child(`avatar/${nameImage}`);;

    //   await ref
    //     .delete()
    //     .then(() => {
    //       toastRef.current.show(
    //         "Eliminadas las Imágenes asociadas a la Tienda: " + storeName
    //       );
    //     })
    //     .catch(() => {});
    // });
    // }
  };

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
      onLongPress={() => userIsAdmin && confirmRemoveStore()}
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
