import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Button, Avatar } from "react-native-elements";
import StarRating from "react-native-star-rating";

export default ListReviews = (props) => {
  const { navigation, idStore } = props;

  return (
    <View>
      <Button
        title="Opiniones"
        buttonStyle={styles.btnAddReviewStyle}
        titleStyle={styles.btnAddTitleStyle}
        icon={{
          type: "material-community",
          name: "square-edit-outline",
          color: "#00a680",
        }}
        onPress={() => navigation.navigate("AddReviewVapeStore",{idStore})}
      />

      <Text>Lista de opiniones</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  btnAddReviewStyle: {
    backgroundColor: "transparent",
  },
  btnAddTitleStyle: {
    color: "#00a680",
  },
});
