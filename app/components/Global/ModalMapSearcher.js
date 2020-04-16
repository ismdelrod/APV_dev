import React from "react";
import { StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";

export default ModalMapSearcher = props => {
  const { isVisible, setIsVisible, children } = props;

  const closeModal = () => setIsVisible(false);
  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor="rgba(0, 0, 0, .5)"
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlayStyle}
      onBackdropPress={closeModal}
    >
      {children}  
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlayStyle: {
    height: "auto",
    width: "90%",
    backgroundColor: "#fff"
  }
});
