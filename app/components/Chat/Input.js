import React, { useCallback, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

import Button from "../Chat/Button";
import Loader from "../Chat/Loader";

import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default Input = (props) => {
  const { uid } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const createMessage = async ({ message, uid }) => {
    await db.collection("messages").add({
      message,
      user_id: uid,
      created_at: new Date(),
    });
  };

  const handlePress = useCallback(() => {
    setIsLoading(true);
    createMessage({ message, uid }).then(() => {
      setIsLoading(false);
      setMessage("");
    });
  }, [message]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Write you message"
        />
      </View>

      <Button text="Send" onPress={handlePress} disabled={isLoading} />

      {isLoading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  inputContainer: {
    width: "70%",
  },
  input: {
    height: 40,
    borderColor: "#B4B4B4",
    borderWidth: 1,
    borderRadius: 3,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
});
