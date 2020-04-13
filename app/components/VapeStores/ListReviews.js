import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet  } from "react-native";
import { Button, Avatar } from "react-native-elements";
import firebase from "../../utils/Firebase";
import StarRating from "react-native-star-rating";
const db = firebase.firestore(firebase);

export default ListReviews = (props) => {
  const { navigation, idStore, setRating } = props;
  const [reviews, setReviews] = useState([]);
  const [reviewsReload, setReviewsReload] = useState(false);
  const [userLogged, setUserLogged] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useEffect(() => {
    (async () => {
      const resultReviews = [];
      const arrayRatings = [];

      db.collection("reviews")
        .where("idStore", "==", idStore)
        .get()
        .then((response) => {
          response.forEach((doc) => {
            resultReviews.push(doc.data());
            arrayRatings.push(doc.data().rating);
          });

          let numSum = 0;
          arrayRatings.map((value) => {
            numSum = numSum + value;
          });
          const countRating = arrayRatings.length;
          const resultRating = numSum / countRating;
          const resultRatingFinish = resultRating ? resultRating : 0;
          setReviews(resultReviews);
          setRating(resultRatingFinish);
        });

      setReviewsReload(false);
    })();
  }, [reviewsReload]);

  return (
    <View >
      {userLogged ? (
        <Button
          title="Opiniones"
          buttonStyle={styles.btnAddReviewStyle}
          titleStyle={styles.btnAddTitleStyle}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#00a680",
          }}
          onPress={() =>
            navigation.navigate("AddReviewVapeStore", {
              idStore,
              setReviewsReload,
            })
          }
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Text
            onPress={() => navigation.navigate("Login")}
            style={{ textAlign: "center", color: "#db0000", paddingTop: 10 }}
          >
            Para comentar o votar debes estar Logueado
          </Text>
          <Text
            onPress={() => navigation.navigate("Login")}
            style={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 10,
              color: "#00a380",
            }}
          >
            Pulsa aquí para iniciar sesión
          </Text>
        </View>
      )}

      <FlatList
        data={reviews}
        // ListHeaderComponent={(rvw) => <Review review={rvw} />}
        // ListFooterComponent={(rvw) => <Review review={rvw} />}
        renderItem={(rvw) => <Review review={rvw} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const Review = (props) => {
  const { title, review, rating, createAt, avatarUser } = props.review.item;
  const dateCreateReview = new Date(createAt.seconds * 1000);
  return (
    <View style={styles.viewReviewsStyle}>
      <View style={styles.viewImageAvatarStyle}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.imageAvatarUserStyle}
          source={{
            url: avatarUser
              ? avatarUser
              : "https://api.adorable.io/avatars/50/abott@adorable.png",
          }}
        />
      </View>
      <View style={styles.viewInfoStyle}>
        <Text style={styles.titleReviewStyle}>{title}</Text>
        <Text style={styles.textReviewStyle}>{review}</Text>
        <StarRating
          starSize={15}
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
        <Text style={styles.textReviewCreateAtStyle}>
          {dateCreateReview.getDate()}/{dateCreateReview.getMonth() + 1}/
          {dateCreateReview.getFullYear()}/{dateCreateReview.getHours()}:
          {dateCreateReview.getMinutes() < 10
            ? "" + dateCreateReview.getMinutes()
            : dateCreateReview.getMinutes()}
        </Text>
      </View>
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
  viewReviewsStyle: {
    flexDirection: "row",
    margin: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
  },
  viewImageAvatarStyle: {
    marginRight: 15,
  },
  imageAvatarUserStyle: {
    width: 50,
    height: 50,
  },
  viewInfoStyle: {
    flex: 1,
    alignItems: "flex-start",
  },
  titleReviewStyle: {
    fontWeight: "bold",
  },
  textReviewStyle: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 5,
  },
  textReviewCreateAtStyle: {
    marginTop: 5,
    color: "grey",
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
