import React from "react";
import { Image} from "react-native-elements";
import { StyleSheet, View, Dimensions} from "react-native";

const widthScreen = Dimensions.get("window").width;

export default MainImage = (props) => {
    const { image } = props;
  
    return (
      <View style={styles.viewMainImageStyle}>
        {image ? (
          <Image source={{ uri: image }} style={styles.mainImageStyle} />
        ) : (
          <Image
            source={require("../../assets/img/noImage.png")}
            style={styles.mainImageStyle}
          />
        )}
      </View>
    );
  };



  const styles = StyleSheet.create({
    viewMainImageStyle: {
      alignItems: "center",
      height: 200,
      marginBottom: 20,
    },
    mainImageStyle: {
      width: widthScreen,
      height: 200,
    },
  });
  