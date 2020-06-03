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
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default ListEliquids = (props) => {
  const {
    eliquids,
    setIsLoading,
    isLoading,
    handleLoadMore,
    navigation,
    setIsReloadEliquids,
    setIsReloadEliquid,
    isReloadEliquid,
    toastRef,
  } = props;
  const [user, setUser] = useState(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [updatedEliquid, setUpdatedEliquid] = useState(null);

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
    if (isReloadEliquid) {
      setIsReloadEliquid(false);
      navigation.navigate("Eliquid", {
        eliquid: updatedEliquid,
        userIsAdmin: userIsAdmin,
        setIsReloadEliquids: setIsReloadEliquids,
        setIsReloadEliquid: setIsReloadEliquid,
        updatedEliquid: updatedEliquid,
        setUpdatedEliquid: setUpdatedEliquid,
      });
    }
  }, [isReloadEliquid]);

  return (
    <View>
      {eliquids ? (
        <FlatList
          data={eliquids}
          renderItem={(eliquid) => (
            <Eliquid
              eliquid={eliquid}
              setIsLoading={setIsLoading}
              navigation={navigation}
              userIsAdmin={userIsAdmin}
              setIsReloadEliquids={setIsReloadEliquids}
              setIsReloadEliquid={setIsReloadEliquid}
              setUpdatedEliquid={setUpdatedEliquid}
              updatedEliquid={updatedEliquid}
              toastRef={toastRef}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderEliquidStyle}>
          <ActivityIndicator size="large" />
          <Text>Cargando E-liquids</Text>
        </View>
      )}
    </View>
  );
};

const Eliquid = (props) => {
  const {
    eliquid,
    setIsLoading,
    navigation,
    userIsAdmin,
    setIsReloadEliquids,
    setIsReloadEliquid,
    setUpdatedEliquid,
    updatedEliquid,
    toastRef,
  } = props;

  const { name, address, description, images } = eliquid.item.eliquid;
  const [imageEliquid, setImageEliquid] = useState(null);
  const [remove, setRemove] = useState(false);

  useEffect(() => {
    let mounted = true
    let image = images[0];
    const updateImages = (async () => {
      await firebase
        .storage()
        .ref(`eliquids-images/${image}`)
        .getDownloadURL()
        .then((resultUrlImage) => {
          mounted && setImageEliquid(resultUrlImage);
        });
    })();
    return function cleanup() {
      updateImages;
      mounted = false;
    };
  }),
    [];

  const confirmRemoveEliquid = () => {
    let eliquidName = eliquid.item.eliquid.name;
    Alert.alert(
      "Eliminar E-liquid",
      "¿Estás seguro de querer eliminar el E-liquid: " + eliquidName + "?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: removeEliquid,
        },
      ],
      { cancelable: false }
    );
  };

  const removeEliquid = async () => {
    let eliquidId = eliquid.item.eliquid.id;
    let imagesArray = eliquid.item.eliquid.images;
    setIsLoading(true);
    //Elimina el E-liquid
    await db
      .collection("eliquids")
      .doc(eliquidId)
      .delete()
      .then(() => {
        // wait(2000).then(() => {});
        toastRef.current.show("E-liquid Eliminado!");
        setIsLoading(false);
        setIsReloadEliquids(true);
      })
      .catch((error) => {
        toastRef.current.show(
          "No se ha podido eliminar el E-liquid, intentarlo más tarde"
        );
      });
    //Elimina los Favoritos asociados el E-liquid
    await db
      .collection("favorites")
      .where("idFavorite", "==", eliquidId)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          response.forEach((doc) => {
            const idFavorite = doc.id;
            db.collection("favorites")
              .doc(idFavorite)
              .delete()
              .then(() => {})
              .catch(() => {});
          });
        }
      })
      .catch(() => {});
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Eliquid", {
          eliquid: eliquid.item.eliquid,
          userIsAdmin: userIsAdmin,
          setIsReloadEliquids: setIsReloadEliquids,
          setIsReloadEliquid: setIsReloadEliquid,
          updatedEliquid: updatedEliquid,
          setUpdatedEliquid: setUpdatedEliquid,
        })
      }
      onLongPress={() => userIsAdmin && confirmRemoveEliquid()}
    >
      <View style={styles.viewEliquidStyle}>
        <View style={styles.viewEliquidImageStyle}>
          <Image
            resizeMode="cover"
            source={{ uri: imageEliquid }}
            style={styles.eliquidImageStyle}
            PlaceholderContent={<ActivityIndicator color="fff" />}
          />
        </View>
        <View>
          <Text style={styles.eliquidNameStyle}>{name}</Text>
          <Text style={styles.eliquidAddressStyle}>{address}</Text>
          <Text style={styles.eliquidDescriptionStyle}>
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
      <View style={styles.notFoundEliquidsStyle}>
        <Text>No quedan más E-liquids por cargar.</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  loadingEliquidsStyle: {
    marginTop: 20,
    alignItems: "center",
  },
  viewEliquidStyle: {
    flexDirection: "row",
    margin: 10,
  },
  viewEliquidImageStyle: {
    marginRight: 15,
  },
  eliquidImageStyle: {
    width: 80,
    height: 80,
  },
  eliquidNameStyle: {
    fontWeight: "bold",
  },
  eliquidAddressStyle: {
    paddingTop: 2,
    color: "grey",
  },
  eliquidDescriptionStyle: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
  viewLoadingStyle: {
    marginTop: 20,
    alignItems: "center",
  },
  loaderEliquidStyle: {
    marginTop: 19,
    marginBottom: 10,
  },
  notFoundEliquidsStyle: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
