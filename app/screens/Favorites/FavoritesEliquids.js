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
import { NavigationEvents} from "@react-navigation/compat";

import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default FavoritesEliquids = (props) => {
  const { navigation } = props;

  const [eliquids, setEliquids] = useState([]);
  const [reloadEliquids, setReloadEliquids] = useState(false);
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useEffect(() => {
    if (userLogged) {
      const idUser = firebase.auth().currentUser.uid;
      db.collection("favorites")
        .where("idUser", "==", idUser)
        .where("type", "==", GeneralTypeEnum.e_liquid)
        .get()
        .then((response) => {
          const idEliquidsArray = [];
          response.forEach((doc) => {
            idEliquidsArray.push(doc.data().idFavorite);
          });
          getDataEliquids(idEliquidsArray).then((response) => {
            //Se puede hacer el then porque la function getDataEliquids devuelve una Promise
            const eliquids = [];
            response.forEach((doc) => {
              let eliquid = doc.data();
              eliquid.id = doc.id; // añadimos el id manualmente porque no va incluída en el objeto
              eliquids.push(eliquid);
            });
            setEliquids(eliquids);
          });
        })
        .catch(() => {
          toastRef.current.show("Error obteniendo Favoritos");
        });
    }
    setReloadEliquids(false);
  }, [reloadEliquids]);

  const getDataEliquids = (idEliquidsArray) => {
    const arrayEliquids = [];
    idEliquidsArray.forEach((idEliquid) => {
      const result = db.collection("eliquids").doc(idEliquid).get();
      arrayEliquids.push(result);
    });
    return Promise.all(arrayEliquids); // la Promise espera a que acabe de llenarse el array
  };

  if (!userLogged) {
    return (
      <UserNotLogged
        setReloadEliquids={setReloadEliquids}
        navigation={navigation}
      />
    );
  }
  if (eliquids.length === 0) {
    return <NotFoundEliquids setReloadEliquids={setReloadEliquids} />;
  }
  return (
    <View style={styles.viewBodyStyle}>
      <NavigationEvents onWillFocus={() => setReloadEliquids(true)} />
      {eliquids ? (
        <FlatList
          data={eliquids}
          renderItem={(eliquid) => (
            <Eliquid
              eliquid={eliquid}
              navigation={navigation}
              setIsVisibleLoading={setIsVisibleLoading}
              setReloadEliquids={setReloadEliquids}
              toastRef={toastRef}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderEliquidsStyle}>
          <ActivityIndicator size="large" />
          <Text>Cargando E-liquids...</Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={1} />
      <Loading text="Eliminando Favorito" isVisible={isVisibleLoading} />
    </View>
  );
};

const Eliquid = (props) => {
  const {
    eliquid,
    navigation,
    setIsVisibleLoading,
    setReloadEliquids,
    toastRef,
  } = props;
  const { id, name, images } = eliquid.item;
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
      .where("type", "==", GeneralTypeEnum.e_liquid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsVisibleLoading(false);
              setReloadEliquids(true);
              toastRef.current.show("Eliminado de Favoritos");
              navigation.navigate("Eliquids");
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
    <View style={styles.eliquidsStyle}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Eliquid", { eliquid: eliquid.item })}
      >
        <Image
          resizeMode="cover"
          source={{ uri: imageEliquid }}
          style={styles.imageEliquidStyle}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
        />
      </TouchableOpacity>
      <View style={styles.infoStyle}>
        <Text style={styles.nameEliquidStyle}>{name}</Text>
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

const NotFoundEliquids = (props) => {
  const { setReloadEliquids } = props;
  return (
    <View style={styles.viewNotFoundEliquidsStyle}>
      <NavigationEvents onWillFocus={() => setReloadEliquids(true)} />
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={styles.textNotFoundEliquidsStyle}>
        La lista de favoritos está vacía{" "}
      </Text>
    </View>
  );
};

const UserNotLogged = (props) => {
  const { setReloadEliquids, navigation } = props;
  return (
    <View style={styles.viewUserNotLoggedStyle}>
      <NavigationEvents onWillFocus={() => setReloadEliquids(true)} />
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={styles.textUserNotLoggedStyle}>
        Esta sección es exclusiva para Usuarios Logueados{" "}
      </Text>
      <Button
        title="Ir al LogIn de Usuarios"
        onPress={()=> navigation.navigate("Login")}
        containerStyle={styles.btnUserNotLoggedContainerStyle}
        buttonStyle={styles.btnUserNotLoggedButtonStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewNotFoundEliquidsStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textNotFoundEliquidsStyle: {
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
  loaderEliquidsStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  viewBodyStyle: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  eliquidsStyle: {
    margin: 10,
  },
  imageEliquidStyle: {
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
  nameEliquidStyle: {
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
