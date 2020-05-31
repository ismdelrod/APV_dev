// TO DO:  Para Evitar los Warnings sobre el componente ActionButton
import { YellowBox } from "react-native";
import _ from "lodash";
YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};
//********************************************************** */

import React, { useState, useEffect  } from "react"; // useState, useEffect son Hooks
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Picker,
  Text,
} from "react-native";
import { Icon, Avatar, Input, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { EliquidFlavorsEnum } from "../../utils/Enumerations";
import MainImage from "../Global/MainImage";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

import uuid from "random-uuid-v4/uuidv4";

export default AddEliquidForm = (props) => {
  const { navigation, toastRef, setIsLoading, setIsReloadEliquids } = props;
  const [imagesSelected, setImageSelected] = useState([]);
  const [brandId, setBrandId] = useState("");
  const [eliquidName, setEliquidName] = useState("");
  const [eliquidDescription, setEliquidDescription] = useState("");
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    (async () => {
      const resultBrands = [];

      const listBrands = db
        .collection("brands")
        .orderBy("name", "desc");

      await listBrands.get().then((response) => {

        response.forEach((doc) => {
          let brand = doc.data();
          brand.id = doc.id;
          resultBrands.push({ brand: brand });
        });
        setBrands(resultBrands);
        console.log(brands);
      });
    })();
  }, []);

  const addEliquid = () => {
    if (!eliquidName || !eliquidDescription) {
      toastRef.current.show("Todos los campos del formulario son obligatorios");
    } else if (imagesSelected.length === 0) {
      toastRef.current.show("Hay que añadir mínimo una imagen");
    } else {
      setIsLoading(true);
      uploadImageStorage(imagesSelected).then((arrayImages) => {
        db.collection("eliquids")
          .add({
            name: eliquidName,
            description: eliquidDescription,
            images: arrayImages,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: firebase.auth().currentUser.uid,
            isActive: true,
            brandId: brandId,
          })
          .then(() => {
            setIsLoading(false);
            setIsReloadEliquids(true);
            navigation.navigate("Eliquids");
          })
          .catch(() => {
            setIsLoading(false);
            toastRef.current.show(
              "Error al añadir el nuevo registro, inténtelo más tarde"
            );
          });
      });
    }
  };

  const uploadImageStorage = async (imagesArray) => {
    const arrayImages = [];
    await Promise.all(
      imagesArray.map(async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("eliquids-images").child(uuid());

        await ref.put(blob).then((result) => {
          arrayImages.push(result.metadata.name);
        });
      })
    );
    return arrayImages;
  };

  return (
    <ScrollView>
      <MainImage image={imagesSelected[0]} />
      <FormAdd
        brands={brands}
        setEliquidName={setEliquidName}
        setEliquidDescription={setEliquidDescription}
        setBrandId={setBrandId}
      />
      <UploadImage
        imagesSelected={imagesSelected}
        setImageSelected={setImageSelected}
        toastRef={toastRef}
      />

      <Button
        title="Añadir"
        onPress={addEliquid}
        buttonStyle={styles.btnAddEliquidStyle}
      />
    </ScrollView>
  );
};

const UploadImage = (props) => {
  const { imagesSelected, setImageSelected, toastRef } = props;

  const addImageSelected = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;
    if (resultPermissionCamera === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos de la Galería, si los rechazaste debes activarlos de forma manual desde los Ajustes del dispositivo.",
        5000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galería sin seleccionar ninguna imagen.",
          3000
        );
      } else {
        setImageSelected([...imagesSelected, result.uri]); //imagesSelected += result.uri
      }
    }
  };

  const removeImage = (img) => {
    const arrayImages = imagesSelected;

    Alert.alert(
      "Eliminar Imagen",
      "¿Estás seguro de querer eliminar esta imagen?",
      [
        {
          text: "cancel",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () =>
            setImageSelected(arrayImages.filter((imgUrl) => imgUrl !== img)),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.viewImageStyle}>
      {imagesSelected.length < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIconCStyle}
          onPress={addImageSelected}
        />
      )}

      {imagesSelected.map((image, index) => (
        <Avatar
          key={index}
          onPress={() => removeImage(image)}
          style={styles.miniatureStyle}
          source={{ uri: image }}
        />
      ))}
    </View>
  );
};

const FormAdd = (props) => {
  const { brands, setEliquidName, setEliquidDescription, setBrandId } = props;
  const [selection, setSelection] = useState(0);
  return (
    <View style={styles.viewFormStyle}>
      <Input
        placeholder="Nombre del E-liquid"
        containerStyle={styles.inputStyle}
        onChange={(e) => setEliquidName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Descripción"
        multiline={true}
        inputContainerStyle={styles.textAreaStyle}
        onChange={(e) => setEliquidDescription(e.nativeEvent.text)}
      />
      <Text style={{ margin: 10, fontSize: 20, fontWeight: "bold" }}>
        Marca
      </Text>
      <Picker
        style={styles.pickerStyle}
        selectedValue={selection}
        onValueChange={(brandId) => {
          setBrandId(brandId);
          setSelection(brandId);
        }}
      >
        {brands.map((brnd, index) => (
          <Picker.Item key={index} label={brnd.brand.name} value={brnd.brand.id} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  viewImageStyle: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIconCStyle: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    marginRight: 10,
    height: 70,
    width: 70,
  },
  viewFormStyle: {
    marginLeft: 10,
    marginRight: 10,
  },
  inputStyle: {
    marginBottom: 10,
  },
  textAreaStyle: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtnStyle: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  btnSaveMapContainerStyle: {
    paddingRight: 10,
  },
  btnSaveMapBtnStyle: {
    backgroundColor: "#00a680",
  },
  btnCancelMapContainerStyle: {
    paddingLeft: 10,
  },
  btnCancelMapBtnStyle: {
    backgroundColor: "#a60d0d",
  },
  btnAddEliquidStyle: {
    backgroundColor: "#00a680",
    margin: 20,
  },
});
