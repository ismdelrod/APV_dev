import React, { useState, useEffect,  useCallback } from "react"; //createContext 
import { Alert } from "react-native";

import Loader from "../../components/Chat/Loader";
import HooksChat from "../../components/Chat//HooksChat";

import firebase from "../../utils/Firebase";
const db = firebase.firestore(firebase);
// const UserContext = createContext();

export default Chat = () => {
  const [user, setUser] = useState(firebase.auth().currentUser);
  const [userLogged, setUserLogged] = useState(false);
  const logout = useCallback(() => firebase.auth().signOut(), []);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

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
 
  useEffect(function () {
   
    if (userLogged) {
        const user = firebase.auth().currentUser;
        const idUser = firebase.auth().currentUser.uid;
        setUser(user);
      } else {
        Alert.alert("Something went wrong");
        return;
      }
    // signIn().then(({ user, error }) => {
    //   if (error) {
    //     Alert.alert("Something went wrong");
    //     return;
    //   }

    //   setUser(user);
    // });
  }, []);

  if (!user) {
    return <Loader />;
  } 

  return (
    // <UserContext.Provider value={user}>
    //   <HooksChat />
    // </UserContext.Provider>
    <HooksChat uid ={user.uid} />
  );
};
