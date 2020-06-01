//****************************************************************************** */
// TO DELETE: Para Evitar los Warnings
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
import { Icon } from "react-native-elements";
import StarRating from "react-native-star-rating";
import CarouselImages from "../../components/Global/CarouselImages";
import { GeneralTypeEnum } from "../../utils/Enumerations";
import Toast from "react-native-easy-toast";

import Modal from "../../components/Global/Modal";
import ChangeBrandNameForm from "./ChangeBrandNameForm";


import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

const screesWidth = Dimensions.get("window").width;
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default Brand = (props) => {
  const { route } = props;
  const {
    brand,
    userIsAdmin,
    setIsReloadBrands,
    setIsReloadBrand,
    setUpdatedBrand,
  } = route.params; //Function pasada por parámetros a través de navigation.
  const [imagesBrand, setImagesBrand] = useState([]);
  const [userLogged, setUserLogged] = useState(false);
  const [rating, setRating] = useState(brand.rating);
  const [refreshing, setRefreshing] = useState(false);

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
        brand.images.map(async (idImage) => {
          await firebase
            .storage()
            .ref(`brands-images/${idImage}`)
            .getDownloadURL()
            .then((imageUrl) => {
              arrayImagesUrls.push(imageUrl);
            });
        })
      );
      setImagesBrand(arrayImagesUrls);
    })();
  }, [refreshing]);

  const selectedComponent = (key, text, brand, setUpdatedBrand) => {
    switch (key) {
      case "displayModalChangeName":
        setRenderComponent(
          <ChangeBrandNameForm
            displayName={text}
            setIsVisibleModal={setIsVisibleModal}
            setIsReloadBrand={setIsReloadBrand}
            setIsReloadBrands={setIsReloadBrands}
            toastRef={toastRef}
            brand={brand}
            setUpdatedBrand={setUpdatedBrand}
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
      <CarouselImages images={imagesBrand} width={screesWidth} height={200} />

      <TitleBrand
        name={brand.name}
        description={brand.description}
        rating={rating}
        userIsAdmin={userIsAdmin}
        selectedComponent={selectedComponent}
        brand={brand}
        setUpdatedBrand={setUpdatedBrand}
      />

      {renderComponent && (
        <Modal isVisible={isVisibleModal} setIsVisible={setIsVisibleModal}>
          {renderComponent}
        </Modal>
      )}

      <Toast ref={toastRef} position="center" opacity={0.5} />
    </ScrollView>
  );
};

const TitleBrand = (props) => {
  const {
    name,
    description,
    rating,
    userIsAdmin,
    selectedComponent,
    brand,
    setUpdatedBrand,
  } = props;
  return (
    <View style={styles.viewBrandTitleStyle}>
      <View style={styles.viewBrandTitleRowStyle}>
        <Text
          onLongPress={() =>
            userIsAdmin &&
            selectedComponent(
              "displayModalChangeName",
              name,
              brand,
              setUpdatedBrand
            )
          }
          style={styles.nameBrandStyle}
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
      <Text style={styles.descriptionBrandStyle}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewBodyStyle: {
    flex: 1,
  },
  viewBrandTitleStyle: {
    margin: 15,
  },
  viewBrandTitleRowStyle: {
    flexDirection: "row",
    width: "100%",
  },
  nameBrandStyle: {
    fontSize: 20,
    fontWeight: "bold",
    width: "70%",
  },
  descriptionBrandStyle: {
    marginTop: 5,
    color: "grey",
  },
  viewInfoBrandStyle: {
    margin: 15,
    marginTop: 25,
  },
  containerListItemStyle: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
});
