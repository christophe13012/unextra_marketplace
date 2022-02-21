import * as firebase from "firebase";

export const getTest = async () => {
  const ref = firebase.database().ref(`/annulations`);
  const snapshot = await ref.once("value");
  return snapshot.val();
};
