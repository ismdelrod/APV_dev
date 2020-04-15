import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

export default ({ navigation }) => (
  <SafeAreaView>
    <Button
      title="Toggle Drawer"
      onPress={() => navigation.toggleDrawer()}
      containerStyle={styles.btnToggleContainerStyle}
      buttonStyle={styles.btnToggleStyle}
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  btnToggleContainerStyle: {
      marginTop:30
  },
  btnToggleStyle: {
    backgroundColor: "#00a680",
    margin: 20,
  },
});
