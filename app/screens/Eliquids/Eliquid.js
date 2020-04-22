//****************************************************************************** */
// TO DO: Para Evitar los Warnings
import { YellowBox } from "react-native";
import _ from "lodash";

YellowBox.ignoreWarnings(["componentWillMount"]);
YellowBox.ignoreWarnings(["VirtualizedLists should never be nested"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("componentWillMount") <= -1) {
    _console.warn(message);
  }
};
const _console2 = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("VirtualizedLists should never be nested") <= -1) {
    _console2.warn(message);
  }
};
//********************************************************** */

import React, { useState, useEffect, useRef } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import StarRating from "react-native-star-rating";
import CarouselImages from "../../components/Global/CarouselImages";
import MyMapView from "../../components/Global/MyMapView";
import ListVapeStoreReviews from "../../components/VapeStores/ListVapeStoreReviews";
import { GeneralTypeEnum } from "../../utils/Enumerations";
import Toast from "react-native-easy-toast";

import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

const screesWidth = Dimensions.get("window").width;

export default Eliquid = (props) => {
  const { navigation, route } = props;
  const { store } = route.params; //Function pasada por parámetros a través de navigation.
  const [imagesStore, setImagesStore] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [rating, setRating] = useState(store.rating);

  const toastRef = useRef();

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useEffect(() => {   
    const arrayImagesUrls = [];
    (async () => {
      await Promise.all(
        store.images.map(async (idImage) => {
          await firebase
            .storage()
            .ref(`stores-images/${idImage}`)
            .getDownloadURL()
            .then((imageUrl) => {
              arrayImagesUrls.push(imageUrl);
            });
        })
      );
      setImagesStore(arrayImagesUrls);
    })();
  }, []);

  useEffect(() => {
    if (userLogged) {
      db.collection("favorites")
        .where("idFavorite", "==", store.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
          }
        });
    }
  }, []);
  const addFavorite = () => {
    if (userLogged) {
      const payload = {
        idFavorite: store.id,
        idUser: firebase.auth().currentUser.uid,
        type: GeneralTypeEnum.store,
      };
  
      db.collection("favorites")
        .add(payload)
        .then(() => {
          toastRef.current.show("Añadido a Favoritos");
          setIsFavorite(true);
        })
        .catch(() => {
          toastRef.current.show("Error al intentar añadir a Favoritos");
        });
    }
    else{
      toastRef.current.show("Para usar el sistema de favoritos debes estar Logueado", 3000)
    }
  };

  const removeFavorite = () => {
    db.collection("favorites")
      .where("idFavorite", "==", store.id)
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
              setIsFavorite(false);
              toastRef.current.show("Eliminado de Favoritos");
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
    <ScrollView style={StyleSheet.viewBodyStyle}>
      <View style={styles.viewFavoriteStyle}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "#00a680" : "#000"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <CarouselImages
        imagesStore={imagesStore}
        width={screesWidth}
        height={200}
      />

      <TitleStore
        name={store.name}
        description={store.description}
        rating={rating}
      />

      <StoreInfo
        location={store.location}
        name={store.name}
        address={store.address}
      />

      <ListVapeStoreReviews
        navigation={navigation}
        idStore={store.id}
        setRating={setRating}
      />

      <Toast ref={toastRef} position="center" opacity={0.5} />
    </ScrollView>
  );
};

const TitleStore = (props) => {
  const { name, description, rating } = props;
  return (
    <View style={styles.viewStoreTitleStyle}>
      <View style={styles.viewStoreTitleRowStyle}>
        <Text style={styles.nameStoreStyle}>{name}</Text>
        <StarRating
          starSize={20}
          disabled={true}
          emptyStar={"ios-star-outline"}
          fullStar={"ios-star"}
          halfStar={"ios-star-half"}
          iconSet={"Ionicons"}
          maxStars={5}
          rating={parseFloat(rating)}
          fullStarColor={
            parseFloat(rating) <= 2
              ? "#C80000"
              : parseFloat(rating) > 2 && parseFloat(rating) < 4
              ? "#FFBD00"
              : "#03B900"
          }
        />
      </View>
      <Text style={styles.descriptionStoreStyle}>{description}</Text>
    </View>
  );
};

const StoreInfo = (props) => {
  const { location, name, address } = props;

  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null,
    },
    {
      text: "añadir nº teléfono al form",
      iconName: "phone",
      iconType: "material-community",
      action: null,
    },
    {
      text: "añadir email al form",
      iconName: "at",
      iconType: "material-community",
      action: null,
    },
  ];
  return (
    <View style={styles.viewInfoStoreStyle}>
      <Text style={styles.storeInfoTitleStyle}>Info sobre la Tienda</Text>
      <MyMapView location={location} name={name} height={100} />
      {listInfo.map((item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#00a680",
          }}
          containerStyle={styles.containerListItemStyle}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  viewBodyStyle: {
    flex: 1,
  },
  viewFavoriteStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    paddingTop: 5,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 5,
  },
  viewStoreTitleStyle: {
    margin: 15,
  },
  viewStoreTitleRowStyle: {
    flexDirection: "row",
    width: "100%",
  },
  nameStoreStyle: {
    fontSize: 20,
    fontWeight: "bold",
    width: "70%",
  },
  descriptionStoreStyle: {
    marginTop: 5,
    color: "grey",
  },
  viewInfoStoreStyle: {
    margin: 15,
    marginTop: 25,
  },
  storeInfoTitleStyle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerListItemStyle: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
});
