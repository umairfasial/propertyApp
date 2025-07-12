import auth from '@react-native-firebase/auth';
import {updateUserData} from '../slices/authSlice';
import {Alert} from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {
  readUserDataSuccess,
  setIsAuthenticated,
  setManagers,
  setTenants,
} from './authSlice';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {convertFirestoreTimestamps} from '../../../utils/functions';

export async function signInUsingEmailAndPassword({
  navigation,
  email,
  password,
  dispatch,
  setSigninLoading,
}) {
  console.log('in api');

  try {
    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;
    console.log('User is', user);

    await startSession({user, navigation, type: 'sign-in'});

    await fetchUserData({uid: user.uid, dispatch}).then(() => {
      dispatch(setIsAuthenticated(true));
    });
    setSigninLoading(false);
    // return user;
  } catch (error) {
    console.log('Error during sign-in:', error);
    let errorMessage = error.code;
    switch (error.code) {
      case 'auth/user-not-found':
        Alert.alert(
          'Error',
          'Your account was not found with this email. Try another email for sign-in.',
        );
        setSigninLoading(false);
        break;
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        Alert.alert('Error', 'Your Email or password is incorrect.');
        setSigninLoading(false);
        break;
      case 'auth/invalid-email':
        Alert.alert('Error', 'Your email is incorrect.');
        setSigninLoading(false);
        break;
      default:
        Alert.alert('Error', 'An unknown error occurred. Please try again.');
        setSigninLoading(false);
    }
  }
}

export const userAccountEmailApi = async ({
  navigation,
  dispatch,
  email,
  photourl,
  fullName,
  phoneNumber,
  password,
  emailMarketing,
  pushNotification,
  role,
}) => {
  try {
    // 1️⃣ Create user in Firebase Authentication
    const userCredentials = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredentials.user;
    let uploadedPhotoUrl = null;

    if (photourl) {
      try {
        // Note: Authentication check not needed here since user was just created above
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}.jpg`; // Random filename
        const reference = storage().ref(`profileImages/${fileName}`);

        console.log('Uploading file:', photourl);

        await reference.putFile(photourl); // Upload file

        const downloadURL = await reference.getDownloadURL(); // Get file URL
        console.log('File uploaded:', downloadURL);

        uploadedPhotoUrl = downloadURL; // Return URL if needed
      } catch (error) {
        console.log('Upload failed:', error);
        // Don't throw error for profile image upload failures during signup
        // Continue with account creation without profile image
      }
    }

    console.log('log user data is', user.email, user.uid);

    dispatch(
      readUserDataSuccess({
        userData: {
          email: user.email,
          uid: user.uid,
        },
      }),
    );

    const response = await axios.post(
      'https://signupemail-fhwithjlaq-uc.a.run.app/sendVerificationEmail',
      {
        email,
        fullName,
        uid: user.uid,
        phoneNumber,
        role: role || 'user',
        nextPath: 'VerifyEmail',
        photoUrl: uploadedPhotoUrl,
        emailMarketing: emailMarketing || false,
        pushNotification: pushNotification || false,
      },
    );

    const result = response.data;
    console.log('result', result);
    if (result.success) {
      console.log('Email sent successfully');
      await startSession({user, navigation, type: 'VerifyEmail'});
    } else {
      console.log('Error: ', result.error);
    }
  } catch (error) {
    // Handle Firebase Authentication errors
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert(
        'Error',
        'This email is already registered. Please use a different email or log in.',
      );
    } else {
      console.error('Other backend error:', error.message);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  }
};

export const startSession = async ({user, navigation, type}) => {
  try {
    console.log('Test');
    const idTokenResult = await user.getIdTokenResult();
    console.log('idTokenResult', idTokenResult);
    if (type === 'sign-in') {
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      const userData = userDoc.data();
      if (!userData?.isVerified && user.email) {
        resendVarificationEmailApi({
          email: user.email,
          uid: user.uid,
        });
      }
      await firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          nextPath: userData?.isVerified ? 'Overview' : 'VerifyEmail',
        });
    } else {
      navigation.navigate('VerifyEmail');
    }
  } catch (error) {
    console.error('Error in startSession:', error);
    throw error;
  }
};

export const resendVarificationEmailApi = async ({email, uid}) => {
  try {
    const response = await axios.post(
      'https://signupemail-fhwithjlaq-uc.a.run.app/resendVerificationEmail',
      {
        email,
        uid,
      },
    );
    const result = response.data;
    console.log('result', result);
    if (result.success) {
      console.log('Email sent successfully');
      Toast.show({
        type: 'success',
        text1: 'new code sended to your email',
      });
    } else {
      console.log('Error: ', result.error);
    }
  } catch (error) {
    console.error('Error calling Firebase function:', error);
  }
};

export async function fetchUserData({uid, dispatch}) {
  try {
    const userDoc = await firestore().collection('users').doc(uid).get();

    if (userDoc.exists) {
      let userData = userDoc.data();
      userData = convertFirestoreTimestamps(userData);
      console.log('User Data', userData);

      dispatch(readUserDataSuccess({userData}));
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.log('Error fetching user data:', error);
  }
}

export const verifyEmailApi = async ({
  navigation,
  dispatch,
  verificationCode,
  uid,
  setIsInvalid,
}) => {
  try {
    const userDoc = await firestore().collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw new Error('User not found.');
    }
    const userData = userDoc.data();
    if (userData.verificationCode === verificationCode) {
      await firestore().collection('users').doc(uid).update({
        isVerified: true,
        nextPath: 'Overview',
      });

      await fetchUserData({uid, dispatch}).then(() => {
        dispatch(setIsAuthenticated(true));
      });
    } else {
      throw new Error('Invalid verification code.');
    }
  } catch (error) {
    setIsInvalid(true);
    console.log('Verification Failed', error.message);
    Alert.alert('Verification Failed', error.message);
  }
};

export const logoutUserApi = async ({uid, dispatch}) => {
  try {
    await firestore()
      .collection('users')
      .doc(uid)
      .update({
        nextPath: 'signin',
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Logout successfully',
        });
        dispatch(setIsAuthenticated(false));
      });
  } catch (error) {
    console.log('error signing out', error.message);
  }
};

export const resetPasswordsEmailApi = async ({email}) => {
  try {
    console.log('email in api is', email);

    await auth()
      .sendPasswordResetEmail(email)
      .then(async () => {
        Toast.show({
          type: 'success',
          text1: 'Password reset email sent successfully',
        });
      });
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

export const fetchManagersApi = async ({dispatch}) => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .where('role', '==', 'propertyManager')
      .where('isVerified', '==', true)
      .get();

    if (snapshot.empty) {
      console.log('No users found with the role propertyManager');
      return [];
    }

    const managers = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertFirestoreTimestamps(data),
      };
    });

    console.log('managers in teh api', managers);

    dispatch(setManagers(managers));
    return managers; // Return the array of managers
  } catch (error) {
    console.error('Error fetching property managers:', error);
    throw new Error('Failed to fetch property managers');
  }
};

export const fetchTenantsApi = async ({dispatch}) => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .where('role', '==', 'tanent')
      .where('isVerified', '==', true)
      .get();

    if (snapshot.empty) {
      console.log('No users found with the role tanent');
      return [];
    }

    const tenants = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertFirestoreTimestamps(data),
      };
    });

    console.log('tenants in the api', tenants);

    dispatch(setTenants(tenants));
    return tenants;
  } catch (error) {
    console.error('Error fetching tenants:', error);
    throw new Error('Failed to fetch tenants');
  }
};

export const fetchLandLoardApi = async ({dispatch}) => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .where('role', '==', 'landloard')
      .where('isVerified', '==', true)
      .get();

    if (snapshot.empty) {
      console.log('No users found with the role landloard');
      return [];
    }

    const landloard = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertFirestoreTimestamps(data),
      };
    });

    console.log('landloard in the api', landloard);

    dispatch(setTenants(tenants));
    return tenants;
  } catch (error) {
    console.error('Error fetching tenants:', error);
    throw new Error('Failed to fetch tenants');
  }
};
