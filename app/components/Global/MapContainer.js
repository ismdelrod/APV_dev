import React, { useState, useEffect } from "react";
import { View } from "react-native";
import MapInput from "./MapInput";
import MyMapViewSearcher from "./MyMapViewSearcher";
import { getLocation, geocodeLocationByName } from "../../utils/location-service";

export default MapContainer = (props) => {
  const { expoLocation } = props;
  const [region, setRegion] = useState(expoLocation);

  // De forma similar a componentDidMount y componentDidUpdate
  useEffect(() => {
    setRegion(region);
  }, []);

  const getCoordsFromName = (location) => {
    let regionData = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    };
    setRegion(regionData);
  };

  const onMapRegionChange = (region) => {
    setRegion(region);
  };

  return (
    <View style={{ height: "auto", width: "100%" }}>
      <View style={{ height: "auto", width: "100%" }}>
        {<MapInput notifyChange={(loc) => getCoordsFromName(loc)} />}
      </View>

      <View>
        <MyMapViewSearcher
          region={region}
          onRegionChange={(reg) => onMapRegionChange(reg)}
        />
      </View>
    </View>
  );
};
