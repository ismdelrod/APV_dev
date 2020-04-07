import React, { useState, useRef } from "react"; // useState, useEffect son Hooks
import { StyleSheet, View, Text } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddVapeStoreForm from "../../components/VapeStores/AddVapeStoreForm";

// TO DO: Para Evitar los Warnings sobre el componente ActionButton
import { YellowBox } from "react-native";
import _ from "lodash";
YellowBox.ignoreWarnings([
  "Non-serializable values were found in the navigation state",
]);
const _console = _.clone(console);
console.warn = (message) => {
  if (
    message.indexOf(
      "Non-serializable values were found in the navigation state"
    ) <= -1
  ) {
    _console.warn(message);
  }
};
//********************************************************** */

export default AddVapeStore = (props) => {
  const { navigation, route } = props;

  const { setIsReloadStores } = route.params; //Function pasada por parámetros a través de navigation.
  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View>
      <AddVapeStoreForm
        navigation={navigation}
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        setIsReloadStores={setIsReloadStores}
      />
      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={isLoading} text="Creando Tienda" />
    </View>
  );
};
