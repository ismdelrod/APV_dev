import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default AddReviewVapeStore = (props) => {

    const {navigation, route} = props;
    const { idStore } = route.params; //pasada por parámetros a través de navigation.

  return (
    <View>
      <Text>AddReviewVapeStore</Text>
    </View>
  );
};

const styles = StyleSheet.create({});
