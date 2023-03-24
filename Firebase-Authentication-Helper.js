import * as firebase from 'firebase';
import 'firebase/firestore';
import { getRecord } from './FireStoreHelper';

/**
 * @description Function to Login with Email/Password.
 * @param email - Email of the user.
 * @param password - Password of the user.
 */

export const signInWithEmail = (email, password) => {
  return new Promise(function (resolve, reject) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @description Function to Register with Email/Password.
 * @param email - Email of the user.
 * @param password - Password of the user.
 */

export const signUpWithEmail = (email, password) => {
  return new Promise(function (resolve, reject) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @description Function to Signout user.
 * @param null.
 */

export const signOutUser = () => {
  return new Promise(function (resolve, reject) {
    firebase
      .auth()
      .signOut()
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

let userLoaded = false;

/**
 * @description Function check if User is logged in or not.
 * @param null.
 * @returns User object if logged in otherwise null
 */

export const checkAuthState = () => {
  return new Promise((resolve, reject) => {
    if (userLoaded && firebase.auth().currentUser !== null) {
      resolve(firebase.auth().currentUser);
    }
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      userLoaded = true;
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

/**
 * @description Function to get Current LoggedIn User.
 * @param null.
 * @returns User object if logged in otherwise null
 */

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    if (firebase.auth().currentUser) {
      resolve(firebase.auth().currentUser);
    } else {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        userLoaded = true;
        unsubscribe();
        resolve(user);
      }, reject);
    }
  });
};

/**
 * @description Function to Forgot password of User.
 * @param email - Email of the user.
 */

export const forgotPassword = (email) => {
  return new Promise(function (resolve, reject) {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @description Function to get Current LoggedIn User.
 * @param collection - from where find user data.
 * @returns User data
 */

export const getCurrentUserInfo = (collection) => {
  return new Promise((resolve, reject) => {
    getCurrentUser()
      .then((user) => {
        if (user !== null && user.uid) {
          getRecord(collection, user.uid)
            .then((snap) => {
              resolve(snap);
            })
            .catch((err) => {
              reject(err);
            });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
