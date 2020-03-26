import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { withNavigation } from "@react-navigation/compat";
import { Button } from "react-native-elements";


UserGuest = (props) => {
  const {navigation} = props;

  return (
    <ScrollView style={styles.viewBody} centerContent={true}>
      <Image
        source={require("../../../assets/img/gestUserLogin.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.tittle}>Consulta tu perfil de APV</Text>
      <Text style={styles.description}>
        ¿Como describirías tu tienda preferida? Busca de una forma rápida y
        sencilla tu tienda favorita. Comenta que tal te ha ido en la búsqueda.
      </Text>

      <View style={styles.viewBtn}>
        <Button
          buttonStyle={styles.btnStyle}
          containerStyle={styles.btnContainer}
          title="Ver Perfil"
          onPress={() => navigation.navigate("Login")}
        />
      </View>
    </ScrollView>
  );
};

export default withNavigation(UserGuest);


const styles = StyleSheet.create({
  viewBody: {
    marginLeft: 30,
    marginRight: 30
  },
  image: {
    height: 300,
    width: "100%",
    marginBottom: 40
  },
  tittle: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center"
  },
  description: {
    textAlign: "center",
    marginBottom: 20
  },
  viewBtn: {
    flex: 1,
    alignItems: "center"
  },
  btnStyle: {
    backgroundColor: "#00a680"
  },
  btnContainer: {
    width: "70%"
  }
});
