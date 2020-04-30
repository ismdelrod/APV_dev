import React, { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";

import Loader from "../../components/Chat/Loader";
import HooksChat from "../../components/Chat//HooksChat";

import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);

export default Chat = () => {
  const [user, setUser] = useState(firebase.auth().currentUser);
  const logout = useCallback(() => firebase.auth().signOut(), []);

  const signIn = async () => {
    try {
      const response = await firebase.auth().signInAnonymously();
      return { user: response.user };
    } catch (error) {
      return { error };
    }
  };

  const fetchMessages = async () => {
    const messages = await db
      .collection("messages")
      .orderBy("created_at", "desc")
      .limit(10)
      .get();

    return messages.docs;
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((usr) => {
      usr && setUser(usr);
    });
  }, []);

  useEffect(() => {
    if (user) {
      const user = firebase.auth().currentUser;
      setUser(user);
    } else {
      Alert.alert("Something went wrong");
      return;
    }
  }, []);

  if (!user) {
    return <Loader />;
  }

  return <HooksChat uid={user.uid} />;
};
