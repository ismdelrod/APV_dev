import React from "react";
import{Dimensions} from "react-native";
import MapView, { Marker } from "react-native-maps";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").width;
export default MyMapViewSearcher = (props) => {
  const {region, onRegionChange}= props;
  return (
    <MapView
      style={{ height: (heightScreen), width: (widthScreen/100)*80 }}
      region={region}
      showsUserLocation={true}
      onRegionChange={(reg) => onRegionChange(reg)}
    >
      {props.region && (
        <Marker
         coordinate={region}
         draggable
         />
      )}
      
    </MapView>
  );
};