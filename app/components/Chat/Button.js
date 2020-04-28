import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";


export default Button = ({ text, disabled, onPress })=> {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#5FB0FF',
    borderRadius: 3,
  },
  text: {
    color: '#000',
  },
});
