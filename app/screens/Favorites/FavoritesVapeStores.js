import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import Loading from "../../components/Global/Loading";
import Toast from "react-native-easy-toast";
import { GeneralTypeEnum } from "../../utils/Enumerations";
import { NavigationEvents } from "@react-navigation/compat";

import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default FavoritesVapeStores = (props) => {
  const { navigation } = props;
  const [stores, setStores] = useState([]);
  const [reloadStores, setReloadStores] = useState(false);
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  const [userIsAdmin, setUserIsAdmin] = useState(false);

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
    if (userLogged) {
      const idUser = firebase.auth().currentUser.uid;
      db.collection("favorites")
        .where("idUser", "==", idUser)
        .where("type", "==", GeneralTypeEnum.store)
        .get()
        .then((response) => {
          const idStoresArray = [];
          response.forEach((doc) => {
            idStoresArray.push(doc.data().idFavorite);
          });
          getDataStores(idStoresArray).then((response) => {
            //Se puede hacer el then porque la function getDataStores devuelve una Promise
            const stores = [];
            response.forEach((doc) => {
              let store = doc.data();
              store.id = doc.id; // añadimos el id manualmente porque no va incluída en el objeto
              stores.push(store);
            });
            setStores(stores);
          });
        })
        .catch(() => {
          toastRef.current.show("Error obteniendo Favoritos");
        });
    }
    setReloadStores(false);
  }, [reloadStores]);

  const getDataStores = (idStoresArray) => {
    const arrayStores = [];
    idStoresArray.forEach((idStore) => {
      const result = db.collection("stores").doc(idStore).get();
      arrayStores.push(result);
    });
    return Promise.all(arrayStores); // la Promise espera a que acabe de llenarse el array
  };

  if (!userLogged) {
    return (
      <UserNotLogged
        setReloadStores={setReloadStores}
        navigation={navigation}
      />
    );
  }
  if (stores.length === 0) {
    return <NotFoundStores setReloadStores={setReloadStores} />;
  }
  return (
    <View style={styles.viewBodyStyle}>
      <NavigationEvents onWillFocus={() => setReloadStores(true)} />
      {stores ? (
        <FlatList
          data={stores}
          renderItem={(store) => (
            <Store
              store={store}
              navigation={navigation}
              setIsVisibleLoading={setIsVisibleLoading}
              setReloadStores={setReloadStores}
              userIsAdmin={userIsAdmin}
              toastRef={toastRef}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderStoresStyle}>
          <ActivityIndicator size="large" />
          <Text>Cargando Stores...</Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={1} />
      <Loading text="Eliminando Favorito" isVisible={isVisibleLoading} />
    </View>
  );
};

const Store = (props) => {
  const {
    store,
    navigation,
    setIsVisibleLoading,
    setReloadStores,
    toastRef,
    userIsAdmin,
  } = props;
  const { id, name, images } = store.item;
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

  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar de Favoritos",
      "¿Estás seguro de querer eliminar el Favorito?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: removeFavorite,
        },
      ],
      { cancelable: false }
    );
  };

  const removeFavorite = () => {
    setIsVisibleLoading(true);
    db.collection("favorites")
      .where("idFavorite", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .where("type", "==", GeneralTypeEnum.store)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsVisibleLoading(false);
              setReloadStores(true);
              toastRef.current.show("Eliminado de Favoritos");
              navigation.navigate("FavoritesVapeStores");
            })
            .catch(() => {
              toastRef.current.show(
                "No se ha podido eliminar de Favoritos, intentarlo más tarde"
              );
            });
        });
      });
  };

  return (
    <View style={styles.storesStyle}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("VapeStore", {
            store: store.item,
            favoriteCall: true,
            userIsAdmin: userIsAdmin,
            setIsReloadStores: setIsReloadStores,
            setIsReloadStore: setIsReloadStore,
            updatedStore: store.item,
            setUpdatedStore: setUpdatedStore,
          })
        }
      >
        <Image
          resizeMode="cover"
          source={{ uri: imageStore }}
          style={styles.imageStoreStyle}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
        />
      </TouchableOpacity>
      <View style={styles.infoStyle}>
        <Text style={styles.nameStoreStyle}>{name}</Text>
        <Icon
          type="material-community"
          name="heart"
          color="#00a680"
          containerStyle={styles.favoriteContainerStyle}
          onPress={confirmRemoveFavorite}
          size={40}
          underlayColor="transparent"
        />
      </View>
    </View>
  );
};

const NotFoundStores = (props) => {
  const { setReloadStores } = props;
  return (
    <View style={styles.viewNotFoundStoresStyle}>
      <NavigationEvents onWillFocus={() => setReloadStores(true)} />
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={styles.textNotFoundStoresStyle}>
        La lista de favoritos está vacía{" "}
      </Text>
    </View>
  );
};

const UserNotLogged = (props) => {
  const { setReloadStores, navigation } = props;
  return (
    <View style={styles.viewUserNotLoggedStyle}>
      <NavigationEvents onWillFocus={() => setReloadStores(true)} />
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={styles.textUserNotLoggedStyle}>
        Esta sección es exclusiva para Usuarios Logueados{" "}
      </Text>
      <Button
        title="Ir al LogIn de Usuarios"
        onPress={() => navigation.navigate("Login")}
        containerStyle={styles.btnUserNotLoggedContainerStyle}
        buttonStyle={styles.btnUserNotLoggedButtonStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewNotFoundStoresStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textNotFoundStoresStyle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  viewUserNotLoggedStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textUserNotLoggedStyle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  btnUserNotLoggedContainerStyle: {
    marginTop: 20,
    width: "80%",
  },
  btnUserNotLoggedButtonStyle: {
    backgroundColor: "#00a680",
  },
  loaderStoresStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  viewBodyStyle: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  storesStyle: {
    margin: 10,
  },
  imageStoreStyle: {
    width: "100%",
    height: 180,
  },
  infoStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  nameStoreStyle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  favoriteContainerStyle: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
});
