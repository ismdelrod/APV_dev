import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import { ListItem } from "react-native-elements";
import StarRating from "react-native-star-rating";
import CarouselImages from "../../components/CarouselImages";
import GoogleMap from "../../components/GoogleMap";
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
        height={200}
      />

      <TitleStore
        name={store.name}
        description={store.description}
        rating={store.rating}
      />

      <StoreInfo
        location={store.location}
        name={store.name}
        address={store.address}
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
      text: "añadir email al form" ,
      iconName: "at",
      iconType: "material-community",
      action: null,
    }
  ];
  return (
    <View style={styles.viewInfoStoreStyle}>
      <Text style={styles.storeInfoTitleStyle}>Info sobre la Tienda</Text>
      <GoogleMap location={location} name={name} height={100} />
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
