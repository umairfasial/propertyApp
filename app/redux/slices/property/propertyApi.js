import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {PermissionsAndroid, Platform, Alert, Linking} from 'react-native';
import Toast from 'react-native-toast-message';
import {convertFirestoreTimestamps} from '../../../utils/functions';
import RNFS from 'react-native-fs';
import moment from 'moment';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../../../firebase/firebaseConfig';
import {addContractSlice} from './propertySlice';

// Helper function to verify Firebase Authentication
const verifyFirebaseAuth = async () => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    throw new Error('User not authenticated with Firebase. Please log in again.');
  }
  return currentUser;
};

export const addPropertyApi = async ({finalData, dispatch}) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${finalData?.address}&key=${process.env.MAPS_API_KEY}&language=en`,
    );
    const data = await response.json();
    const {contractFile, userId} = finalData;
    const {lat, lng} =
      data.results && data.results.length > 0
        ? data.results[0].geometry.location
        : {
            lat: 0,
            lng: 0,
          };
    let contractFileUrl = null;

    if (contractFile) {
      try {
        // Verify Firebase Authentication before upload
        await verifyFirebaseAuth();
        
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}_${contractFile.name}`;

        const reference = storage().ref(`certificates/${userId}/${fileName}`);

        console.log('Uploading certificate file:', contractFile.uri);
        console.log('File details:', {
          name: contractFile.name,
          size: contractFile.size,
          type: contractFile.type,
          uri: contractFile.uri,
        });

        const filePath =
          Platform.OS === 'android'
            ? contractFile.uri
            : contractFile.uri || contractFile.fileCopyUri;

        if (!filePath) {
          throw new Error('No valid file path found');
        }

        await reference.putFile(filePath);

        contractFileUrl = await reference.getDownloadURL();
        console.log('Certificate file uploaded successfully:', contractFileUrl);

        if (
          Platform.OS === 'android' &&
          filePath.startsWith(RNFS.CachesDirectoryPath)
        ) {
          try {
            await RNFS.unlink(filePath);
            console.log('Temporary file deleted:', filePath);
          } catch (unlinkError) {
            console.warn('Error deleting temporary file:', unlinkError);
          }
        }
      } catch (error) {
        console.error('Error uploading certificate file:', error);
        
        // Provide specific error message for authentication issues
        if (error.message.includes('not authenticated')) {
          Alert.alert('Authentication Error', 'Please log out and log back in to continue.');
        } else {
          Alert.alert(
            'Error',
            'Failed to upload certificate document. Please try again.',
          );
        }
        throw error;
      }
    }

    const propertyData = {
      ...finalData,
      latitude: lat,
      longitude: lng,
      contractFile: contractFileUrl,
      reviewDate: firestore.Timestamp.fromDate(new Date(finalData.reviewDate)),
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    const propertyRef = await firestore()
      .collection('properties')
      .add(propertyData);

    const propertyDoc = await propertyRef.get();
    const docData = propertyDoc.data();

    const property = {
      id: propertyDoc.id,
      ...docData,
      reviewDate: moment(docData?.reviewDate?.toDate()).format('YYYY-MM-DD'),
      createdAt: docData.createdAt
        ? moment(docData?.createdAt?.toDate()).format('YYYY-MM-DD HH:mm:ss')
        : null,
      updatedAt: docData.updatedAt
        ? moment(docData?.updatedAt?.toDate()).format('YYYY-MM-DD HH:mm:ss')
        : null,
    };

    console.log('property data api', property);

    const contractData = {
      contractFileUrl,
      contractPrice: property?.monthlyIncome,
      contractTitle: 'Property Contact',
      contractType: property?.tenancyType,
      currency: property?.currency,
      owner: property?.userId,
      propertyId: property?.id,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    console.log('contractData in api', contractData);

    if (!property.empty && !property.ownerOccupied) {
      await firestore().collection('contracts').add(contractData);
    }
    Toast.show({
      type: 'success',
      text1: `Property added successfully`,
    });

    return property;
  } catch (error) {
    console.error('Error adding property:', error);
    Alert.alert('Error', 'Failed to add property. Please try again.');
    throw error;
  }
};

export const editPropertyApi = async ({finalData, propertyId}) => {
  try {
    // Prepare the updated data
    const updatedData = {
      ...finalData,
      reviewDate: firestore.Timestamp.fromDate(new Date(finalData.reviewDate)),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    // Update the property in Firestore
    const propertyRef = firestore().collection('properties').doc(propertyId);
    await propertyRef.update(updatedData);

    // Fetch the updated document
    const updatedDoc = await propertyRef.get();
    const docData = updatedDoc.data();

    const property = {
      id: updatedDoc.id,
      ...docData,
      reviewDate: moment(docData?.reviewDate?.toDate()).format('YYYY-MM-DD'),
      createdAt: docData.createdAt
        ? moment(docData?.createdAt?.toDate()).format('YYYY-MM-DD HH:mm:ss')
        : null,
      updatedAt: docData.updatedAt
        ? moment(docData?.updatedAt?.toDate()).format('YYYY-MM-DD HH:mm:ss')
        : null,
    };

    Toast.show({
      type: 'success',
      text1: 'Property updated successfully',
    });

    return property;
  } catch (error) {
    console.error('Error updating property:', error);
    Alert.alert('Error', 'Failed to update property. Please try again.');
    throw error;
  }
};

// Function to fetch all properties for a user
export const fetchPropertiesApi = async ({userId}) => {
  console.log('fetch properties called witht he userId', userId);

  try {
    const propertiesSnapshot = await firestore()
      .collection('properties')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const properties = propertiesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertFirestoreTimestamps(data),
      };
    });

    return properties;
  } catch (error) {
    console.error('Error fetching properties:', error);
    Alert.alert('Error', 'Failed to fetch properties. Please try again.');
    throw error;
  }
};

// Function to add a new certificate
export const addCertificateApi = async ({
  propertyId,
  certificateType,
  startDate,
  endDate,
  status,
  certificateFile,
  userId,
}) => {
  try {
    let certificateFileUrl = null;

    // Upload certificate file to Firebase Storage if provided
    if (certificateFile) {
      try {
        // Verify Firebase Authentication before upload
        await verifyFirebaseAuth();
        
        // Generate a unique filename
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}_${certificateFile.name}`;

        // Create a reference to the file location in Firebase Storage
        const reference = storage().ref(
          `certificates/${userId}/${propertyId}/${fileName}`,
        );

        console.log('Uploading certificate file:', certificateFile.uri);
        console.log('File details:', {
          name: certificateFile.name,
          size: certificateFile.size,
          type: certificateFile.type,
          uri: certificateFile.uri,
        });

        // For Android, we need to use the file path directly
        const filePath =
          Platform.OS === 'android'
            ? certificateFile.uri
            : certificateFile.uri || certificateFile.fileCopyUri;

        if (!filePath) {
          throw new Error('No valid file path found');
        }

        // Upload the file
        await reference.putFile(filePath);

        // Get the download URL
        certificateFileUrl = await reference.getDownloadURL();
        console.log(
          'Certificate file uploaded successfully:',
          certificateFileUrl,
        );

        // Clean up the temporary file on Android
        if (
          Platform.OS === 'android' &&
          certificateFile.uri.startsWith(RNFS.CachesDirectoryPath)
        ) {
          try {
            await RNFS.unlink(certificateFile.uri);
            console.log('Temporary file deleted:', certificateFile.uri);
          } catch (unlinkError) {
            console.warn('Error deleting temporary file:', unlinkError);
          }
        }
      } catch (error) {
        console.error('Error uploading certificate file:', error);
        
        // Provide specific error message for authentication issues
        if (error.message.includes('not authenticated')) {
          Alert.alert('Authentication Error', 'Please log out and log back in to continue.');
        } else {
          Alert.alert(
            'Error',
            'Failed to upload certificate document. Please try again.',
          );
        }
        throw error;
      }
    }

    // Create certificate document in Firestore
    const certificateData = {
      propertyId,
      certificateType,
      startDate: firestore.Timestamp.fromDate(new Date(startDate)),
      endDate: firestore.Timestamp.fromDate(new Date(endDate)),
      status,
      certificateFileUrl,
      userId,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    // Add the certificate to Firestore
    const certificateRef = await firestore()
      .collection('certificates')
      .add(certificateData);

    // Get the created certificate with its ID
    const certificateDoc = await certificateRef.get();
    const docData = certificateDoc.data();

    // Convert Firestore Timestamp to Date object
    const certificate = {
      id: certificateDoc.id,
      ...docData,
      startDate: moment(docData.startDate.toDate()).format('YYYY-MM-DD'),
      endDate: moment(docData.endDate.toDate()).format('YYYY-MM-DD'),
      createdAt: docData.createdAt
        ? moment(docData.createdAt.toDate()).format('YYYY-MM-DD HH:mm:ss')
        : null,
      updatedAt: docData.updatedAt
        ? moment(docData.updatedAt.toDate()).format('YYYY-MM-DD HH:mm:ss')
        : null,
    };

    Toast.show({
      type: 'success',
      text1: 'Certificate added successfully',
    });

    return certificate;
  } catch (error) {
    console.error('Error adding certificate:', error);
    Alert.alert('Error', 'Failed to add certificate. Please try again.');
    throw error;
  }
};

export const editCertificateApi = async ({certificateData, certificateId}) => {
  try {
    let certificateFileUrl = null;
    const {certificateFile, userId, propertyId} = certificateData;
    // Upload new certificate file if provided
    if (certificateFile) {
      try {
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}_${certificateFile.name}`;

        const reference = storage().ref(
          `certificates/${userId}/${propertyId}/${fileName}`,
        );

        const filePath =
          Platform.OS === 'android'
            ? certificateFile.uri
            : certificateFile.uri || certificateFile.fileCopyUri;

        if (!filePath) {
          throw new Error('No valid file path found');
        }

        await reference.putFile(filePath);
        certificateFileUrl = await reference.getDownloadURL();

        if (
          Platform.OS === 'android' &&
          certificateFile.uri.startsWith(RNFS.CachesDirectoryPath)
        ) {
          try {
            await RNFS.unlink(certificateFile.uri);
          } catch (unlinkError) {
            console.warn('Error deleting temporary file:', unlinkError);
          }
        }
      } catch (error) {
        console.error('Error uploading certificate file:', error);
        Alert.alert(
          'Error',
          'Failed to upload certificate document. Please try again.',
        );
        throw error;
      }
    }

    // Prepare data for update
    const certificateDataUpload = {
      ...certificateData,
      startDate: firestore.Timestamp.fromDate(
        new Date(certificateData.startDate),
      ),
      endDate: firestore.Timestamp.fromDate(new Date(certificateData.endDate)),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    // Only update certificateFileUrl if a new file was uploaded
    if (certificateFileUrl) {
      certificateDataUpload.certificateFileUrl = certificateFileUrl;
    }

    // Update certificate document in Firestore
    const certificateRef = firestore()
      .collection('certificates')
      .doc(certificateId);
    await certificateRef.update(certificateDataUpload);

    // Get the updated document
    const updatedDoc = await certificateRef.get();
    const docData = updatedDoc.data();

    const certificate = {
      id: updatedDoc.id,
      ...docData,
      startDate: moment(docData.startDate.toDate()).format('YYYY-MM-DD'),
      endDate: moment(docData.endDate.toDate()).format('YYYY-MM-DD'),
      updatedAt: docData.updatedAt
        ? moment(docData.updatedAt.toDate()).format('YYYY-MM-DD HH:mm:ss')
        : null,
    };

    Toast.show({
      type: 'success',
      text1: 'Certificate updated successfully',
    });

    return certificate;
  } catch (error) {
    console.error('Error updating certificate:', error);
    Alert.alert('Error', 'Failed to update certificate. Please try again.');
    throw error;
  }
};

export const addContractApi = async ({
  contractTitle,
  propertyId,
  tenantId,
  startDate,
  endDate,
  contractFile,
  owner,
  contractPrice,
  currency,
  contractType,
}) => {
  try {
    let contractFileUrl = null;

    if (contractFile) {
      try {
        // Verify Firebase Authentication before upload
        await verifyFirebaseAuth();
        
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}_${contractFile.name}`;

        const reference = storage().ref(
          `certificates/${owner}/${propertyId}/${fileName}`,
        );

        console.log('Uploading certificate file:', contractFile.uri);
        console.log('File details:', {
          name: contractFile.name,
          size: contractFile.size,
          type: contractFile.type,
          uri: contractFile.uri,
        });

        const filePath =
          Platform.OS === 'android'
            ? contractFile.uri
            : contractFile.uri || contractFile.fileCopyUri;

        if (!filePath) {
          throw new Error('No valid file path found');
        }

        await reference.putFile(filePath);

        contractFileUrl = await reference.getDownloadURL();
        console.log('Certificate file uploaded successfully:', contractFileUrl);

        if (
          Platform.OS === 'android' &&
          filePath.startsWith(RNFS.CachesDirectoryPath)
        ) {
          try {
            await RNFS.unlink(filePath);
            console.log('Temporary file deleted:', filePath);
          } catch (unlinkError) {
            console.warn('Error deleting temporary file:', unlinkError);
          }
        }
      } catch (error) {
        console.error('Error uploading certificate file:', error);
        
        // Provide specific error message for authentication issues
        if (error.message.includes('not authenticated')) {
          Alert.alert('Authentication Error', 'Please log out and log back in to continue.');
        } else {
          Alert.alert(
            'Error',
            'Failed to upload certificate document. Please try again.',
          );
        }
        throw error;
      }
    }

    const contractData = {
      contractTitle,
      propertyId,
      tenantId,
      startDate: firestore.Timestamp.fromDate(new Date(startDate)),
      endDate: firestore.Timestamp.fromDate(new Date(endDate)),
      contractFileUrl,
      owner,
      contractPrice,
      currency,
      contractType,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    const contractRef = await firestore()
      .collection('contracts')
      .add(contractData);

    const contractDoc = await contractRef.get();
    const docData = contractDoc.data();

    const certificate = {
      id: contractDoc.id,
      ...docData,
      startDate: moment(docData.startDate.toDate()).format('YYYY-MM-DD'),
      endDate: moment(docData.endDate.toDate()).format('YYYY-MM-DD'),
      createdAt: docData.createdAt
        ? moment(docData.createdAt.toDate()).format('YYYY-MM-DD HH:mm:ss')
        : null,
      updatedAt: docData.updatedAt
        ? moment(docData.updatedAt.toDate()).format('YYYY-MM-DD HH:mm:ss')
        : null,
    };

    Toast.show({
      type: 'success',
      text1: 'Contract added successfully',
    });

    return certificate;
  } catch (error) {
    console.error('Error adding certificate:', error);
    Alert.alert('Error', 'Failed to add certificate. Please try again.');
    throw error;
  }
};

export const editContractApi = async ({contractData, contractId}) => {
  try {
    let contractFileUrl = null;
    const {contractFile, owner, propertyId} = contractData;

    // Upload new contract file if provided
    if (contractFile) {
      try {
        // Verify Firebase Authentication before upload
        await verifyFirebaseAuth();
        
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}_${contractFile.name}`;

        const reference = storage().ref(
          `contracts/${owner}/${propertyId}/${fileName}`,
        );

        const filePath =
          Platform.OS === 'android'
            ? contractFile.uri
            : contractFile.uri || contractFile.fileCopyUri;

        if (!filePath) {
          throw new Error('No valid file path found');
        }

        await reference.putFile(filePath);
        contractFileUrl = await reference.getDownloadURL();

        if (
          Platform.OS === 'android' &&
          contractFile.uri.startsWith(RNFS.CachesDirectoryPath)
        ) {
          try {
            await RNFS.unlink(contractFile.uri);
          } catch (unlinkError) {
            console.warn('Error deleting temporary file:', unlinkError);
          }
        }
      } catch (error) {
        console.error('Error uploading contract file:', error);
        
        // Provide specific error message for authentication issues
        if (error.message.includes('not authenticated')) {
          Alert.alert('Authentication Error', 'Please log out and log back in to continue.');
        } else {
          Alert.alert(
            'Error',
            'Failed to upload contract document. Please try again.',
          );
        }
        throw error;
      }
    }

    // Prepare data for update
    const contractDataUpload = {
      ...contractData,
      startDate: firestore.Timestamp.fromDate(new Date(contractData.startDate)),
      endDate: firestore.Timestamp.fromDate(new Date(contractData.endDate)),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    // Only update contractFileUrl if a new file was uploaded
    if (contractFileUrl) {
      contractDataUpload.contractFileUrl = contractFileUrl;
    }

    // Update contract document in Firestore
    const contractRef = firestore().collection('contracts').doc(contractId);
    await contractRef.update(contractDataUpload);

    // Get the updated document
    const updatedDoc = await contractRef.get();
    const docData = updatedDoc.data();

    const contract = {
      id: updatedDoc.id,
      ...docData,
      startDate: moment(docData.startDate.toDate()).format('YYYY-MM-DD'),
      endDate: moment(docData.endDate.toDate()).format('YYYY-MM-DD'),
      updatedAt: docData.updatedAt
        ? moment(docData.updatedAt.toDate()).format('YYYY-MM-DD HH:mm:ss')
        : null,
    };

    Toast.show({
      type: 'success',
      text1: 'Contract updated successfully',
    });

    return contract;
  } catch (error) {
    console.error('Error updating contract:', error);
    Alert.alert('Error', 'Failed to update contract. Please try again.');
    throw error;
  }
};

// Function to fetch all certificates for a property
export const fetchCertificatesApi = async ({userId}) => {
  try {
    const certificatesSnapshot = await firestore()
      .collection('certificates')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')

      .get();

    const certificates = certificatesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertFirestoreTimestamps(data),
      };
    });

    return certificates;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    Alert.alert('Error', 'Failed to fetch certificates. Please try again.');
    throw error;
  }
};

export const fetchContractsApi = async ({id}) => {
  try {
    // Fetch contracts where owner == id
    const ownerSnapshot = await firestore()
      .collection('contracts')
      .where('owner', '==', id)
      .orderBy('createdAt', 'desc')
      .get();

    // Map both results
    const ownerContracts = ownerSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertFirestoreTimestamps(data),
      };
    });

    return ownerContracts;
  } catch (error) {
    console.error('Error fetching contracts:', error);
    Alert.alert('Error', 'Failed to fetch contracts. Please try again.');
    throw error;
  }
};

export const addPropertyManagerApi = async ({managerId, propertyId}) => {
  try {
    const propertyRef = firestore().collection('properties').doc(propertyId);

    // Optional: check if the document exists
    const docSnapshot = await propertyRef.get();
    if (!docSnapshot.exists) {
      throw new Error('Property not found');
    }

    // Update the managerId field
    await propertyRef.update({managerId});

    console.log('Property updated successfully');
    Toast.show({
      type: 'success',
      text1: 'Manager added successfully',
    });

    return true;
  } catch (error) {
    console.error('Error updating manager ID:', error);
    Alert.alert('Error', 'Failed to update manager. Please try again.');
    throw error;
  }
};

export const addPropertyTenantApi = async ({tenantId, propertyId}) => {
  try {
    const propertyRef = firestore().collection('properties').doc(propertyId);

    // Optional: check if the document exists
    const docSnapshot = await propertyRef.get();
    if (!docSnapshot.exists) {
      throw new Error('Property not found');
    }

    // Update the managerId field
    await propertyRef.update({tenantId});

    console.log('Property updated successfully');
    Toast.show({
      type: 'success',
      text1: 'Tenant added successfully',
    });

    return true;
  } catch (error) {
    console.error('Error updating manager ID:', error);
    Alert.alert('Error', 'Failed to update tenant. Please try again.');
    throw error;
  }
};

export const deletePropertyApi = async ({propertyId}) => {
  try {
    // Delete the property document from Firestore
    await firestore().collection('properties').doc(propertyId).delete();

    // Optionally, delete associated certificates and contracts
    const certificatesSnapshot = await firestore()
      .collection('certificates')
      .where('propertyId', '==', propertyId)
      .get();

    const batch = firestore().batch();
    certificatesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    Toast.show({
      type: 'success',
      text1: 'Property deleted successfully',
    });

    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    Alert.alert('Error', 'Failed to delete property. Please try again.');
    throw error;
  }
};

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage to download files.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission Required',
          'Storage permission is required to download files. Please enable it from settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
        );
      }

      return false;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  }
  return true;
};

export const downloadFileApi = async url => {
  try {
    const granted = await requestStoragePermission();
    if (!granted) {
      throw new Error('Storage permission not granted');
    }

    const fileName = url.split('/').pop();
    const downloadDest = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    const options = {
      fromUrl: url,
      toFile: downloadDest,
      begin: res => {
        console.log('Download started:', res);
      },
      progress: res => {
        const percent = (res.bytesWritten / res.contentLength) * 100;
        console.log(`Progress: ${percent.toFixed(0)}%`);
      },
    };

    const result = await RNFS.downloadFile(options).promise;

    if (result.statusCode === 200) {
      return downloadDest;
    } else {
      throw new Error(`Download failed: ${result.statusCode}`);
    }
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

export const fetchPropertyByPropertyIdApi = async ({propertyId}) => {
  try {
    const propertyDocRef = firestore().collection('properties').doc(propertyId);
    const propertyDocSnap = await propertyDocRef.get();

    if (!propertyDocSnap.exists) {
      throw new Error('Property not found');
    }

    const {createdAt, updatedAt, reviewDate, ...rest} = propertyDocSnap.data();

    const propertyData = {
      id: propertyDocSnap.id,
      ...rest,
      reviewDate: reviewDate
        ? moment(reviewDate.toDate()).format('DD MMM YYYY')
        : null,
    };

    return propertyData;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

export const fetchPropertiesByPropertiesIdApi = async ({properties}) => {
  try {
    if (!properties || !Array.isArray(properties) || properties.length === 0) {
      return [];
    }

    const chunkSize = 10;
    const propertyChunks = [];
    for (let i = 0; i < properties.length; i += chunkSize) {
      propertyChunks.push(properties.slice(i, i + chunkSize));
    }

    const allProperties = [];

    for (const chunk of propertyChunks) {
      const propertiesSnapshot = await firestore()
        .collection('properties')
        .where(firestore.FieldPath.documentId(), 'in', chunk)
        .get();

      const chunkProperties = propertiesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...convertFirestoreTimestamps(data),
        };
      });

      allProperties.push(...chunkProperties);
    }

    return allProperties;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};
