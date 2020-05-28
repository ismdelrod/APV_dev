import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default ListBrands = (props) => {
  const {
    brands,
    isLoading,
    handleLoadMore,
    navigation,
    setIsReloadBrands,
    setIsReloadBrand,
    isReloadBrand,
  } = props;
  const [user, setUser] = useState(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [updatedBrand, setUpdatedBrand] = useState(null);

  //useEffect Validación User Logueado y si es Admin
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
      validateAdmin(userInfo);
    });
  }, []);

  const validateAdmin = (user) => {
    if (user) {
      const resultUsers = [];
      const idUser = user.uid;
      db.collection("users_roles")
        .where("uid", "==", idUser)
        .get()
        .then((response) => {
          if (response.docs.length > 0) {
            response.forEach((doc) => {
              let user_role = doc.data();
              resultUsers.push({ user_role });
            });
          }
          setUserIsAdmin(resultUsers[0].user_role.admin);
        })
        .catch(() => {});
    }
  };

  //useEffect encargado de actualizar el elemento de la lista justo después de sufrir un cambio (update)
  useEffect(() => {
    debugger;
    if (isReloadBrand) {
      setIsReloadBrand(false);
      navigation.navigate("VapeBrand", {
        brand: updatedBrand,
        userIsAdmin: userIsAdmin,
        setIsReloadBrands: setIsReloadBrands,
        setIsReloadBrand: setIsReloadBrand,
        updatedBrand: updatedBrand,
        setUpdatedBrand: setUpdatedBrand,
      });
    }
  }, [isReloadBrand]);

  return (
    <View>
      {brands ? (
        <FlatList
          data={brands}
          renderItem={(brand) => (
            <Brand
              brand={brand}
              navigation={navigation}
              userIsAdmin={userIsAdmin}
              setIsReloadBrands={setIsReloadBrands}
              setIsReloadBrand={setIsReloadBrand}
              setUpdatedBrand={setUpdatedBrand}
              updatedBrand={updatedBrand}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderBrandStyle}>
          <ActivityIndicator size="large" />
          <Text>Cargando E-liquids</Text>
        </View>
      )}
    </View>
  );
};

const Brand = (props) => {
  const {
    brand,
    navigation,
    userIsAdmin,
    setIsReloadBrands,
    setIsReloadBrand,
    setUpdatedBrand,
    updatedBrand,
  } = props;
  const { name, address, description, images } = brand.item.brand;
  const [imageBrand, setImageBrand] = useState(null);

  useEffect(() => {
    const image = images[0];

    firebase
      .storage()
      .ref(`brands-images/${image}`)
      .getDownloadURL()
      .then((resultUrlImage) => {
        setImageBrand(resultUrlImage);
      });
  });

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Brand", {
          brand: brand.item.brand,
          userIsAdmin: userIsAdmin,
          setIsReloadBrands: setIsReloadBrands,
          setIsReloadBrand: setIsReloadBrand,
          updatedBrand: updatedBrand,
          setUpdatedBrand: setUpdatedBrand,
        })
      }
      onLongPress={() => userIsAdmin && console.log("Abrir modal de Borrado")}
    >
      <View style={styles.viewBrandStyle}>
        <View style={styles.viewBrandImageStyle}>
          <Image
            resizeMode="cover"
            source={{ uri: imageBrand }}
            style={styles.brandImageStyle}
            PlaceholderContent={<ActivityIndicator color="fff" />}
          />
        </View>
        <View>
          <Text style={styles.brandNameStyle}>{name}</Text>
          <Text style={styles.brandAddressStyle}>{address}</Text>
          <Text style={styles.brandDescriptionStyle}>
            {description.substr(0, 60)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FooterList = (props) => {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundBrandsStyle}>
        <Text>No quedan más Marcas por cargar.</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  loadingBrandsStyle: {
    marginTop: 20,
    alignItems: "center",
  },
  viewBrandStyle: {
    flexDirection: "row",
    margin: 10,
  },
  viewBrandImageStyle: {
    marginRight: 15,
  },
  brandImageStyle: {
    width: 80,
    height: 80,
  },
  brandNameStyle: {
    fontWeight: "bold",
  },
  brandAddressStyle: {
    paddingTop: 2,
    color: "grey",
  },
  brandDescriptionStyle: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
  viewLoadingStyle: {
    marginTop: 20,
    alignItems: "center",
  },
  loaderBrandStyle: {
    marginTop: 19,
    marginBottom: 10,
  },
  notFoundBrandsStyle: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
