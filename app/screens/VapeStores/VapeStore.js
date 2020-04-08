import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import StarRating from "react-native-star-rating";
import CarouselImages from "../../components/CarouselImages";
import * as firebase from "firebase";

const screesWidth = Dimensions.get("window").width;

export default VapeStore = (props) => {
  const { route } = props;
  const { store } = route.params.store.item; //Function pasada por parámetros a través de navigation.
  const [imagesStore, setImagesStore] = useState([]);

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
  return (
    <ScrollView style={StyleSheet.viewBodyStyle}>
      <CarouselImages
        imagesStore={imagesStore}
        width={screesWidth}
        height={250}
      />

      <TitleStore
        name={store.name}
        description={store.description}
        rating={store.rating}
      />
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

const styles = StyleSheet.create({
  viewBodyStyle: {
    flex: 1,
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
});
