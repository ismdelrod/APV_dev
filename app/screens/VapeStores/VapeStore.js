import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import { Rating } from "react-native-elements";
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
        <Rating
          style={styles.ratingStyle}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
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
  },
  nameStoreStyle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  ratingStyle: {
    position: "absolute",
    right: 0,
  },
  descriptionStoreStyle:{
    marginTop:5,
    color:"grey"
  }
});
