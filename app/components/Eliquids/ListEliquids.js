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
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default ListEliquids = (props) => {
  const {
    eliquids,
    isLoading,
    handleLoadMore,
    navigation,
    setIsReloadEliquids,
    setIsReloadEliquid,
    isReloadEliquid,
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
              navigation={navigation}
              userIsAdmin={userIsAdmin}
              setIsReloadEliquids={setIsReloadEliquids}
              setIsReloadEliquid={setIsReloadEliquid}
              setUpdatedEliquid={setUpdatedEliquid}
              updatedEliquid={updatedEliquid}
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
    navigation,
    userIsAdmin,
    setIsReloadEliquids,
    setIsReloadEliquid,
    setUpdatedEliquid,
    updatedEliquid,
  } = props;
  const { name, address, description, images } = eliquid.item.eliquid;
  const [imageEliquid, setImageEliquid] = useState(null);

  useEffect(() => {
    const image = images[0];

    firebase
      .storage()
      .ref(`eliquids-images/${image}`)
      .getDownloadURL()
      .then((resultUrlImage) => {
        setImageEliquid(resultUrlImage);
      });
  });

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
