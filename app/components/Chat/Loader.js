import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating color={"#5FB0FF"} size="small" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    top: 0,
    left: 0,

    height: "100%",
    width: "100%",

    justifyContent: "center",
    alignItems: "center",
  },
});
