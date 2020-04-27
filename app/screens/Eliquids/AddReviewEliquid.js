import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import { RatingStarsNameEnum } from "../../utils/Enumerations";
import { GeneralTypeEnum } from "../../utils/Enumerations";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Global/Loading";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default AddReviewEliquid = (props) => {
  const { navigation, route } = props;
  const { idEliquid, setReviewsReload } = route.params; //pasada por parámetros a través de navigation.
  const [rating, setRating] = useState(null);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
 

  const addReview = () => {
    if (rating === null) {
      toastRef.current.show("Aún no has votado");
    } else if (!title) {
      toastRef.current.show("El título es obligatorio");
    } else if (!review) {
      toastRef.current.show("Debes añadir un breve comentario");
    } else {
      setIsLoading(true);
      const user = firebase.auth().currentUser;
      const payload = {
        idUser: user.uid,
        avatarUser: user.photoURL,
        idReview: idEliquid,
        title: title,
        review: review,
        rating: rating,
        createAt: new Date(),
        isActive: true,
        type: GeneralTypeEnum.e_liquid
      };

      db.collection("reviews")
        .add(payload)
        .then(() => {
          updateEliquid();
          
        })
        .catch(() => {
          toastRef.current.show("Error al intentar añadir la Review");
          setIsLoading(false);
        });
    }
  };

  const updateEliquid = () => {
    const eliquidRef = db.collection("eliquids").doc(idEliquid);
    
    eliquidRef.get().then((response) => {
      const eliquidData = response.data();
      const ratingTotal = eliquidData.ratingTotal + rating;
      const quantityVoting = eliquidData.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;

      eliquidRef
        .update({ rating: ratingResult, ratingTotal, quantityVoting })
        .then(() => {
          setIsLoading(false);
          setReviewsReload(true);
          navigation.goBack();
        });
    });
  };

  return (
    <View style={styles.viewBodyStyle}>
      <View style={styles.viewRatingStyle}>
        <AirbnbRating
          count={5}
          reviews={[
            RatingStarsNameEnum.one_star,
            RatingStarsNameEnum.two_stars,
            RatingStarsNameEnum.three_stars,
            RatingStarsNameEnum.four_stars,
            RatingStarsNameEnum.five_stars,
          ]}
          defaultRating={0}
          size={35}
          onFinishRating={(value) => setRating(value)}
        />
      </View>
      <View style={styles.formReviewStyle}>
        <Input
          placeholder="Título"
          containerStyle={styles.inputStyle}
          onChange={(e) => setTitle(e.nativeEvent.text)}
        />
        <Input
          placeholder="Comentario"
          multiline={true}
          inputContainerStyle={styles.textAreaContainerStyle}
          onChange={(e) => setReview(e.nativeEvent.text)}
        />
        <Button
          containerStyle={styles.btnContainerStyle}
          buttonStyle={styles.btnStyle}
          title="Enviar"
          onPress={addReview}
        />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={isLoading} text="Guardando Review" />
    </View>
  );
};

const styles = StyleSheet.create({
  viewBodyStyle: {
    flex: 1,
  },
  viewRatingStyle: {
    height: 110,
    backgroundColor: "#f2f2f2",
  },
  formReviewStyle: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    marginTop: 40,
  },
  inputStyle: {
    marginBottom: 10,
  },
  textAreaContainerStyle: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnContainerStyle: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
    width: "95%",
  },
  btnStyle: {
    backgroundColor: "#00a680",
  },
});
