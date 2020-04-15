import React from "react";
import { View, StyleSheet } from "react-native";

import DrawerTrigger from "./DrawerTrigger";

class Header extends React.Component {
  render() {
    return (
      <View style={styles.headerStyle}>
        <DrawerTrigger />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    paddingTop: 30,
    tintColor:"transparent",
  },
});

export default Header;
