import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Image,Icon } from "react-native-elements";
import { GeneralTypeEnum } from "../../utils/Enumerations";
import StarRating from "react-native-star-rating";
import { FlatList } from "react-native-gesture-handler";

import firebase from "../../utils/Firebase";

export default ListTopEliquids = (props) => {
  const { eliquids, navigation } = props;

  return (
    <FlatList
      data={eliquids}
      renderItem={(eliquid) => <Eliquids eliquid={eliquid} navigation={navigation} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};
//TO DO: Al añadir nuevos votos en una Tienda, se actualizan los textos del Ranking pero no lo hacen las imagenes 
const Eliquids = (props) => {
  const { eliquid, navigation } = props;
  const { name, description, images, rating } = eliquid.item;

  const [imageEliquid, setImageEliquid] = useState(null);
  const [iconColor, setIconColor] = useState("#000");

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

  useEffect(() => {
    if (eliquid.index === 0) {
      setIconColor("#efb819");
    } else if (eliquid.index === 1) {
      setIconColor("#e3e4e5");
    } else if (eliquid.index === 2) {
      setIconColor("#cd7f32");
    }
  }, []);
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Eliquid", { eliquid: eliquid.item })}>
      <Card containerStyle={styles.cardContainerStyle}>
        <Icon
          type="material-community"
          name="medal"
          color={iconColor}
          size={40}
          containerStyle={styles.iconContainerStyle}
        />
        <Image
          style={styles.eliquidImageStyle}
          resizeMode="cover"
          source={{ uri: imageEliquid }}
        />
        <View style={styles.titleRankingStyle}>
          <Text style={styles.titleStyle}>{name}</Text>
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
        <Text style={styles.descriptionStyle}>{description}</Text>
      </Card>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  cardContainerStyle: {
    marginBottom: 30,
    borderWidth: 0,
  },
  eliquidImageStyle: {
    width: "100%",
    height: 200,
  },
  titleRankingStyle: {
    flexDirection: "row",
    marginTop: 10,
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: "bold",
    width: "70%",
  },
  descriptionStyle: {
    color: "grey",
    marginTop: 5,
    textAlign: "justify",
  },
  iconContainerStyle: {
    position: "absolute",
    top: -15,
    left: -15,
    zIndex: 1,
    borderRadius: 100,
    backgroundColor: "#fff",
  },
});
