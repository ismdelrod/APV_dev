import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "react-native-elements";
import Carousel from "react-native-banner-carousel";

export default CarouselImages = (props) => {
  const { imagesStore, width, height } = props;

  return (
    <Carousel
      autoplay
      autoplayTimeout={5000}
      loop
      index={0}
      pageSize={width}
      pageIndicatorStyle={StyleSheet.indicatorStyle}
      activePageIndicatorStyle={styles.indicatorActiveStyle}
    >
      {imagesStore.map((urlImage) => (
        <View key={urlImage}>
          <Image style={{ width, height }} source={{ uri: urlImage }} />
        </View>
      ))}
    </Carousel>
  );
};

const styles = StyleSheet.create({
  indicatorStyle: {
    backgroundColor: "#00a680",
  },
  indicatorActiveStyle: {
    backgroundColor: "#00ffc5",
  },
});
