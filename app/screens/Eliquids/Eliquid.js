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

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { ListItem, Icon } from "react-native-elements";
import StarRating from "react-native-star-rating";
import CarouselImages from "../../components/Global/CarouselImages";
import ListEliquidReviews from "../../components/Eliquids/ListEliquidReviews";
import { GeneralTypeEnum } from "../../utils/Enumerations";
import Toast from "react-native-easy-toast";
import { NavigationEvents } from "@react-navigation/compat";

import Modal from "../../components/Global/Modal";
import ChangeEliquidNameForm from "./ChangeEliquidNameForm";
import ChangeEliquidBrandForm from "./ChangeEliquidBrandForm";

import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

const screesWidth = Dimensions.get("window").width;
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default Eliquid = (props) => {
  // TO DO: Falta refrescar la Eliquid cuando se elimina de favoritos(desde favoritos).

  const { navigation, route } = props;
  const {
    eliquid,
    userIsAdmin,
    setIsReloadEliquids,
    setIsReloadEliquid,
    setUpdatedEliquid,
  } = route.params; //Function pasada por parámetros a través de navigation.
  const [imagesEliquid, setImagesEliquid] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [rating, setRating] = useState(eliquid.rating);
  const [refreshing, setRefreshing] = useState(false);
  const [brand, setBrand] = useState(null);
  const [reloadBrand, setReloadBrand] = useState(false);

  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [renderComponent, setRenderComponent] = useState(null);

  const toastRef = useRef();

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, [refreshing]);

  useEffect(() => {
    const arrayImagesUrls = [];
    (async () => {
      await Promise.all(
        eliquid.images.map(async (idImage) => {
          await firebase
            .storage()
            .ref(`eliquids-images/${idImage}`)
            .getDownloadURL()
            .then((imageUrl) => {
              arrayImagesUrls.push(imageUrl);
            });
        })
      );
      setImagesEliquid(arrayImagesUrls);
      setIsReloadEliquids(true);
    })();
  }, [isFavorite, refreshing]);

  useEffect(() => {
    if (userLogged) {
      db.collection("favorites")
        .where("idFavorite", "==", eliquid.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
          }
        });
    }
    setRefreshing(false);
  }, [imagesEliquid]);

  //useEffectGetBrand
  useEffect(() => {
    db.collection("brands").get();

    (async () => {
      var docRef = db.collection("brands").doc(eliquid.brandId);
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            let brand = doc.data();
            brand.id = doc.id;
            setBrand(brand);
          }
        })
        .catch(() => {
          toastRef.current.show("Error al intentar recuperar la Marca");
        });
      setReloadBrand(false);
    })();
  }, [reloadBrand]);

  const addFavorite = () => {
    if (userLogged) {
      const payload = {
        idFavorite: eliquid.id,
        idUser: firebase.auth().currentUser.uid,
        type: GeneralTypeEnum.e_liquid,
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
    } else {
      toastRef.current.show(
        "Para usar el sistema de favoritos debes estar Logueado",
        3000
      );
    }
  };

  const removeFavorite = () => {
    db.collection("favorites")
      .where("idFavorite", "==", eliquid.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          let idFavorite = doc.id;
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

  const selectedComponent = (key, text, eliquid, setUpdatedEliquid) => {
    switch (key) {
      case "displayModalChangeName":
        setRenderComponent(
          <ChangeEliquidNameForm
            displayName={text}
            setIsVisibleModal={setIsVisibleModal}
            setIsReloadEliquid={setIsReloadEliquid}
            setIsReloadEliquids={setIsReloadEliquids}
            toastRef={toastRef}
            eliquid={eliquid}
            setUpdatedEliquid={setUpdatedEliquid}
          />
        );
        setIsVisibleModal(true);
        break;

        case "displayModalChangeEliquidBrand":
        setRenderComponent(
          <ChangeEliquidBrandForm
            setIsVisibleModal={setIsVisibleModal}
            setIsReloadEliquid={setIsReloadEliquid}
            setIsReloadEliquids={setIsReloadEliquids}
            toastRef={toastRef}
            eliquid={eliquid}
            setUpdatedEliquid={setUpdatedEliquid}
            setReloadBrand = {setReloadBrand}
          />
        );
        setIsVisibleModal(true);
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView
      style={StyleSheet.viewBodyStyle}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <NavigationEvents onWillFocus={() => setRefreshing(true)} />
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
      <CarouselImages images={imagesEliquid} width={screesWidth} height={200} />

      <TitleEliquid
        name={eliquid.name}
        description={eliquid.description}
        rating={rating}
        userIsAdmin={userIsAdmin}
        selectedComponent={selectedComponent}
        eliquid={eliquid}
        setUpdatedEliquid={setUpdatedEliquid}
      />

      <EliquidInfo
        brandName={brand && brand.name}
        toastRef={toastRef}
        userIsAdmin={userIsAdmin}
        renderComponent={renderComponent}
        isVisibleModal={isVisibleModal}
        setIsVisibleModal={setIsVisibleModal}
        eliquid={eliquid}
        setUpdatedEliquid={setUpdatedEliquid}
        selectedComponent={selectedComponent}
      />
      {renderComponent && (
        <Modal isVisible={isVisibleModal} setIsVisible={setIsVisibleModal}>
          {renderComponent}
        </Modal>
      )}

      <ListEliquidReviews
        navigation={navigation}
        idEliquid={eliquid.id}
        setRating={setRating}
      />

      <Toast ref={toastRef} position="center" opacity={0.5} />
    </ScrollView>
  );
};

const TitleEliquid = (props) => {
  const {
    name,
    description,
    rating,
    userIsAdmin,
    selectedComponent,
    eliquid,
    setUpdatedEliquid,
  } = props;
  return (
    <View style={styles.viewEliquidTitleStyle}>
      <View style={styles.viewEliquidTitleRowStyle}>
        <Text
          onLongPress={() =>
            userIsAdmin &&
            selectedComponent(
              "displayModalChangeName",
              name,
              eliquid,
              setUpdatedEliquid
            )
          }
          style={styles.nameEliquidStyle}
        >
          {name}
        </Text>
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
      <Text style={styles.descriptionEliquidStyle}>{description}</Text>
    </View>
  );
};

const EliquidInfo = (props) => {
  const {
    brandName,
    toastRef,
    userIsAdmin,
    renderComponent,
    isVisibleModal,
    setIsVisibleModal,
    eliquid,
    setUpdatedEliquid,
    selectedComponent,
  } = props;
  const listInfo = [
    {
      name: "brand",
      text: brandName,
      iconName: "copyright",
      iconType: "material-community",
      action: null,
    },
  ];
  return (
    <View style={styles.viewInfoEliquidStyle}>
      <Text style={styles.storeInfoTitleStyle}>Info sobre el E-liquid</Text>
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
          onLongPress={
            item.name === "brand"
              ? () =>
                  userIsAdmin &&
                  selectedComponent(
                    "displayModalChangeEliquidBrand",
                    brandName,
                    eliquid,
                    setUpdatedEliquid
                  )
              : () => {}
          }
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
  viewEliquidTitleStyle: {
    margin: 15,
  },
  viewEliquidTitleRowStyle: {
    flexDirection: "row",
    width: "100%",
  },
  nameEliquidStyle: {
    fontSize: 20,
    fontWeight: "bold",
    width: "70%",
  },
  descriptionEliquidStyle: {
    marginTop: 5,
    color: "grey",
  },
  viewInfoEliquidStyle: {
    margin: 15,
    marginTop: 25,
  },
  containerListItemStyle: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
  storeInfoTitleStyle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
