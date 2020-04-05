import React, { useState, useRef } from "react"; // useState, useEffect son Hooks
import { StyleSheet, View, Text } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddVapeStoreForm from "../../components/VapeStores/AddVapeStoreForm";

export default AddVapeStore = (props) => {
  const { navigation } = props;
  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View>
      <AddVapeStoreForm navigation={navigation} toastRef={toastRef} setIsLoading={setIsLoading}/>
      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={isLoading} text="Creando Tienda" />
    </View>
  );
};
