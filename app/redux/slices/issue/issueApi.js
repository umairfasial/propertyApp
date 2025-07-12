import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import moment from 'moment';

// Helper function to verify Firebase Authentication
const verifyFirebaseAuth = async () => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    throw new Error('User not authenticated with Firebase. Please log in again.');
  }
  return currentUser;
};

const uploadFile = async (file, userId) => {
  // Verify Firebase Authentication before upload
  await verifyFirebaseAuth();
  
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${
    file.fileName || 'file'
  }`;

  const reference = storage().ref(`issue_attachments/${userId}/${fileName}`);

  console.log('Uploading file:', file.uri);
  console.log('File details:', file);

  let filePath;
  
  if (Platform.OS === 'android') {
    filePath = file.uri;
  } else {
    // For iOS, handle different URI schemes
    if (file.uri.startsWith('ph://')) {
      // Photo library asset - need to copy to accessible location
      try {
        const fileExtension = file.type?.includes('video') ? 'mp4' : 'jpg';
        const cacheFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
        const destinationPath = `${RNFS.CachesDirectoryPath}/${cacheFileName}`;
        
        // Copy the file to cache directory for iOS accessibility
        await RNFS.copyAssetsFileIOS(file.uri, destinationPath, 0, 0);
        filePath = destinationPath;
        
        console.log('iOS ph:// file copied to cache:', destinationPath);
      } catch (copyError) {
        console.error('Error copying iOS ph:// file to cache:', copyError);
        
        // Fallback: try regular copyFile
        try {
          const fileExtension = file.type?.includes('video') ? 'mp4' : 'jpg';
          const cacheFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
          const destinationPath = `${RNFS.CachesDirectoryPath}/${cacheFileName}`;
          
          await RNFS.copyFile(file.uri, destinationPath);
          filePath = destinationPath;
          
          console.log('iOS fallback copy successful:', destinationPath);
        } catch (fallbackError) {
          console.error('iOS fallback copy also failed:', fallbackError);
          throw new Error('Failed to process image file on iOS - unable to access photo library asset');
        }
      }
    } else if (file.uri.startsWith('file://')) {
      // Already accessible file path
      filePath = file.uri;
    } else {
      // Other URI schemes - try to copy to cache
      try {
        const fileExtension = file.type?.includes('video') ? 'mp4' : 'jpg';
        const cacheFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
        const destinationPath = `${RNFS.CachesDirectoryPath}/${cacheFileName}`;
        
        await RNFS.copyFile(file.uri, destinationPath);
        filePath = destinationPath;
        
        console.log('iOS other URI copied to cache:', destinationPath);
      } catch (copyError) {
        console.error('Error copying iOS file to cache:', copyError);
        throw new Error('Failed to process image file on iOS');
      }
    }
  }

  if (!filePath) {
    throw new Error('No valid file path found');
  }

  console.log('Final file path for upload:', filePath);

  try {
    await reference.putFile(filePath);
    const downloadUrl = await reference.getDownloadURL();
    console.log('File uploaded successfully:', downloadUrl);

    // Clean up temporary files
    if (Platform.OS === 'ios' && filePath.startsWith(RNFS.CachesDirectoryPath)) {
      try {
        await RNFS.unlink(filePath);
        console.log('iOS cache file deleted:', filePath);
      } catch (unlinkError) {
        console.warn('Error deleting iOS cache file:', unlinkError);
      }
    }

    return {
      url: downloadUrl,
    };
  } catch (uploadError) {
    console.error('Firebase Storage upload error:', uploadError);
    
    // Clean up cache file on upload failure
    if (Platform.OS === 'ios' && filePath.startsWith(RNFS.CachesDirectoryPath)) {
      try {
        await RNFS.unlink(filePath);
        console.log('iOS cache file cleaned up after upload failure:', filePath);
      } catch (unlinkError) {
        console.warn('Error cleaning up iOS cache file after upload failure:', unlinkError);
      }
    }
    
    throw uploadError;
  }
};

export const addIssueApi = async ({finalData, dispatch}) => {
  try {
    let attachmentFiles = [];

    const {attachmentFile, userId} = finalData;

    if (attachmentFile && attachmentFile.length > 0) {
      try {
        // Upload all files in parallel
        const uploadPromises = attachmentFile.map(file =>
          uploadFile(file, userId),
        );
        attachmentFiles = await Promise.all(uploadPromises);

        console.log('All files uploaded successfully:', attachmentFiles);
      } catch (error) {
        console.error('Error uploading files:', error);
        
        // Provide specific error messages for authentication issues
        if (error.message.includes('not authenticated')) {
          Alert.alert('Authentication Error', 'Please log out and log back in to continue.');
        } else {
          Alert.alert('Error', 'Failed to upload some files. Please try again.');
        }
        throw error;
      }
    }

    const issueData = {
      ...finalData,
      attachmentFile: attachmentFiles,
      reportDate: firestore.Timestamp.fromDate(new Date(finalData.reportDate)),
    };

    const issueRef = await firestore().collection('issues').add(issueData);

    const issueDoc = await issueRef.get();
    const docData = issueDoc.data();

    const issue = {
      id: issueDoc.id,
      ...docData,
      reportDate: moment(docData?.reportDate?.toDate()).format('DD MMMM YYYY'),
    };

    Toast.show({
      type: 'success',
      text1: `Issue reported successfully`,
    });

    return issue;
  } catch (error) {
    console.error('Error adding issue:', error);
    
    // Provide specific error messages for authentication issues
    if (error.message.includes('not authenticated')) {
      Alert.alert('Authentication Error', 'Please log out and log back in to continue.');
    } else {
      Alert.alert('Error', 'Failed to report issue. Please try again.');
    }
    throw error;
  }
};
