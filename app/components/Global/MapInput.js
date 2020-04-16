import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

export default MapInput = (props) =>{
const {notifyChange} = props;
    return (
      <GooglePlacesAutocomplete
        placeholder="Search"
        minLength={2} // minimum length of text to search
        autoFocus={true}
        returnKeyType={"search"} // Can be left out for default return key
        listViewDisplayed={false} // true/false/undefined
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          notifyChange(details.geometry.location);
        }}
        query={{
          key: "AIzaSyDlpQgm9rWMA38jsW5kvXCic2GW7i2HCr0",
          language: "en",
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
      />
    );

}

