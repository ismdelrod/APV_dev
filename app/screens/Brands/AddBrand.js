// TO DELETE: Para Evitar los Warnings
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

import React, { useState, useRef } from "react"; // useState, useEffect son Hooks
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Global/Loading";
import AddBrandForm from "../../components/Brands/AddBrandForm";

export default AddBrand = (props) => {
  const { navigation, route } = props;

  const { setIsReloadBrands: setIsReloadBrands } = route.params; //Function pasada por parámetros a través de navigation.
;  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View>
      <AddBrandForm
        navigation={navigation}
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        setIsReloadBrands={setIsReloadBrands}
      />
      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={isLoading} text="Creando Brand" />
    </View>
  );
};
