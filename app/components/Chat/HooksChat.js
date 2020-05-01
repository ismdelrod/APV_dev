import React, { useEffect, useReducer } from "react";
import { FlatList, SafeAreaView, View, StyleSheet } from "react-native";
import Input from "./Input";
import Message from "./Message";
import { unionWith } from "lodash";
import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

const messagesReducer = (state, action) => {
  switch (action.type) {
    case "add":
      return unionWith(state, action.payload, (a, b) => {
        return a.id === b.id;
      }).sort((a, b) => {
        const aData = a.data();
        const bData = b.data();

        return bData.created_at.seconds - aData.created_at.seconds;
      });
    default:
      throw new Error("Action type is not implemented!");
  }
};

export default HooksChat = (props) => {
  const { logMessages, user, uid } = props;
  const [messages, dispatchMessages] = useReducer(messagesReducer, []);

  useEffect(() => {
    return db
      .collection("messages")
      .orderBy("created_at", "desc")
      .onSnapshot((snapshot) => {
        dispatchMessages({ type: "add", payload: snapshot.docs });
      });
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.messagesContainer}>
        <FlatList
          inverted
          data={messages}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={({ item }) => {
            const data = item.data();
            const side = data.user_id === uid ? "right" : "left";

            return <Message side={side} message={data.message} />;
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <Input uid={uid} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  messagesContainer: {
    height: "100%",
    paddingBottom: 100,
  },
  inputContainer: {
    width: "100%",
    height: 100,
    position: "absolute",
    bottom: 0,
    paddingVertical: 10,
    paddingLeft: 20,

    borderTopWidth: 1,
    borderTopColor: "#B4B4B4",
  },
});
