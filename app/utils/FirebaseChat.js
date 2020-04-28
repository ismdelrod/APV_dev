import firebase from "./Firebase";

const FirebaseService = () => {


  signIn = async () => {
    try {
      const response = await firebase.auth().signInAnonymously();
      return { user: response.user };
    } catch (error) {
      return { error };
    }
  };

  fetchMessages = async () => {
    const messages = await firebase.firestore().collection("messages")
      .orderBy("created_at", "desc")
      .limit(10)
      .get();

    return messages.docs;
  };

  createMessage = async ({ message, uid }) => {
    await firebase.firestore().collection("messages").add({
      message,
      user_id: uid,
      created_at: new Date(),
    });
  };
};

export default FirebaseService;
