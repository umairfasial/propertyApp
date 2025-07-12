import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

export const addInspectionItem = async ({inspectionData}) => {
  try {
    // Add the document
    const docRef = await firestore()
      .collection('inspectionItems')
      .add({
        ...inspectionData,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    const snapshot = await docRef.get();

    return {
      id: snapshot.id,
      ...snapshot.data(),
      success: true,
    };
  } catch (error) {
    console.error('Error adding inspection item:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const addInspectionTemplateApi = async ({inspectionTemplate}) => {
  try {
    // Add the document
    const docRef = await firestore()
      .collection('inspectionTemplates')
      .add({
        ...inspectionTemplate,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    const snapshot = await docRef.get();

    return {
      id: snapshot.id,
      ...snapshot.data(),
      success: true,
    };
  } catch (error) {
    console.error('Error adding inspection item:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const fetchInspectionItemsApi = async () => {
  try {
    const snapshot = await firestore()
      .collection('inspectionItems')
      .orderBy('createdAt', 'desc')
      .get();

    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      const createdAtDate = data.createdAt?.toDate();

      // remove the original createdAt to avoid conflict
      const {createdAt, ...rest} = data;

      return {
        id: doc.id,
        createdAt: createdAtDate ? createdAtDate.toISOString() : null,
        createdAtFormatted: createdAtDate
          ? moment(createdAtDate).format('DD MMM YYYY')
          : null,
        ...rest,
      };
    });

    return {success: true, data: items};
  } catch (error) {
    console.error('Error fetching inspection items:', error);
    return {success: false, error: error.message};
  }
};

export const fetchInspectionTemplatesApi = async () => {
  try {
    const snapshot = await firestore()
      .collection('inspectionTemplates')
      .orderBy('createdAt', 'desc')
      .get();

    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      const createdAtDate = data.createdAt?.toDate();

      // remove the original createdAt to avoid conflict
      const {createdAt, ...rest} = data;

      return {
        id: doc.id,
        createdAt: createdAtDate ? createdAtDate.toISOString() : null,
        createdAtFormatted: createdAtDate
          ? moment(createdAtDate).format('DD MMM YYYY')
          : null,
        ...rest,
      };
    });

    return {success: true, data: items};
  } catch (error) {
    console.error('Error fetching inspection items:', error);
    return {success: false, error: error.message};
  }
};

export const scheduleInspectionApi = async inspectionData => {
  try {
    const docRef = await firestore()
      .collection('inspections')
      .add({
        ...inspectionData,
        status: 'scheduled',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    const snapshot = await docRef.get();

    return {
      id: snapshot.id,
      ...snapshot.data(),
      success: true,
    };
  } catch (error) {
    console.error('Error scheduling inspection:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const fetchInspectionsByUserIdApi = async userId => {
  try {
    // Add a check for a valid userId before making the query
    if (!userId || typeof userId !== 'string') {
      console.error(
        'Invalid userId provided to fetchInspectionsByUserIdApi:',
        userId,
      );
      return {success: true, data: []}; // Return empty data for invalid userId
    }

    const snapshot = await firestore()
      .collection('inspections')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const inspections = snapshot.docs.map(doc => {
      const data = doc.data();
      const createdAtDate = data.createdAt?.toDate();

      // remove the original createdAt to avoid conflict
      const {createdAt, ...rest} = data;

      return {
        id: doc.id,
        createdAt: createdAtDate ? createdAtDate.toISOString() : null,
        createdAtFormatted: createdAtDate
          ? moment(createdAtDate).format('DD MMM YYYY')
          : null,
        ...rest,
      };
    });

    console.log('inspections in the api', inspections);

    return {success: true, data: inspections};
  } catch (error) {
    console.error('Error fetching inspections:', error);
    return {success: false, error: error.message};
  }
};

export const fetchTemplateByTemplateIdApi = async templateIds => {
  try {
    const ids = Array.isArray(templateIds) ? templateIds : [templateIds];

    if (!ids || ids.length === 0) {
      console.error('No template IDs provided');
      return {success: false, error: 'No template IDs provided'};
    }

    const validTemplateIds = ids.filter(
      id =>
        id &&
        (typeof id === 'string' || typeof id === 'number') &&
        String(id).trim() !== '',
    );

    if (validTemplateIds.length === 0) {
      console.error('No valid template IDs found');
      return {success: false, error: 'No valid template IDs found'};
    }

    const chunkSize = 10;
    const templateChunks = [];
    for (let i = 0; i < validTemplateIds.length; i += chunkSize) {
      templateChunks.push(validTemplateIds.slice(i, i + chunkSize));
    }

    const allTemplates = [];

    for (const chunk of templateChunks) {
      const templatesSnapshot = await firestore()
        .collection('inspectionTemplates')
        .where(firestore.FieldPath.documentId(), 'in', chunk)
        .get();

      const chunkTemplates = templatesSnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAtDate = data.createdAt?.toDate();

        // Remove the original createdAt to avoid conflict
        const {createdAt, ...rest} = data;

        return {
          id: doc.id,
          createdAt: createdAtDate ? createdAtDate.toISOString() : null,
          createdAtFormatted: createdAtDate
            ? moment(createdAtDate).format('DD MMM YYYY')
            : null,
          ...rest,
        };
      });

      allTemplates.push(...chunkTemplates);
    }

    return {
      success: true,
      data: allTemplates,
    };
  } catch (error) {
    console.error('Error fetching templates:', error);
    return {success: false, error: error.message};
  }
};

export const fetchInspectionItemsByIdsApi = async inspectionItems => {
  try {
    const ids = Array.isArray(inspectionItems)
      ? inspectionItems
      : [inspectionItems];

    if (!ids || ids.length === 0) {
      console.error('No items IDs provided');
      return {success: false, error: 'No items IDs provided'};
    }

    const validInspectionItems = ids.filter(
      id =>
        id &&
        (typeof id === 'string' || typeof id === 'number') &&
        String(id).trim() !== '',
    );

    if (validInspectionItems.length === 0) {
      console.error('No valid items IDs found');
      return {success: false, error: 'No valid items IDs found'};
    }

    const chunkSize = 10;
    const itemChunks = [];
    for (let i = 0; i < validInspectionItems.length; i += chunkSize) {
      itemChunks.push(validInspectionItems.slice(i, i + chunkSize));
    }

    const allItems = [];

    for (const chunk of itemChunks) {
      const itemsSnapshot = await firestore()
        .collection('inspectionItems')
        .where(firestore.FieldPath.documentId(), 'in', chunk)
        .get();

      const chunkItems = itemsSnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAtDate = data.createdAt?.toDate();

        // Remove the original createdAt to avoid conflict
        const {createdAt, ...rest} = data;

        return {
          id: doc.id,
          createdAt: createdAtDate ? createdAtDate.toISOString() : null,
          createdAtFormatted: createdAtDate
            ? moment(createdAtDate).format('DD MMM YYYY')
            : null,
          ...rest,
        };
      });

      allItems.push(...chunkItems);
    }

    return {
      success: true,
      data: allItems,
    };
  } catch (error) {
    console.error('Error fetching Items:', error);
    return {success: false, error: error.message};
  }
};

export const uploadFileToFirebaseStorage = async (fileUri, path) => {
  try {
    // Verify Firebase Authentication before upload
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated with Firebase. Please log in again.');
    }
    
    console.log('Uploading inspection file:', fileUri);
    
    let processedFileUri;
    
    if (Platform.OS === 'android') {
      processedFileUri = fileUri;
    } else {
      // For iOS, handle different URI schemes
      if (fileUri.startsWith('ph://')) {
        // Photo library asset - need to copy to accessible location
        try {
          const cacheFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
          const destinationPath = `${RNFS.CachesDirectoryPath}/${cacheFileName}`;
          
          // Copy the file to cache directory for iOS accessibility
          await RNFS.copyAssetsFileIOS(fileUri, destinationPath, 0, 0);
          processedFileUri = destinationPath;
          
          console.log('iOS ph:// inspection file copied to cache:', destinationPath);
        } catch (copyError) {
          console.error('Error copying iOS ph:// inspection file to cache:', copyError);
          
          // Fallback: try regular copyFile
          try {
            const cacheFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
            const destinationPath = `${RNFS.CachesDirectoryPath}/${cacheFileName}`;
            
            await RNFS.copyFile(fileUri, destinationPath);
            processedFileUri = destinationPath;
            
            console.log('iOS inspection fallback copy successful:', destinationPath);
          } catch (fallbackError) {
            console.error('iOS inspection fallback copy also failed:', fallbackError);
            throw new Error('Failed to process inspection file on iOS - unable to access photo library asset');
          }
        }
      } else if (fileUri.startsWith('file://')) {
        // Already accessible file path
        processedFileUri = fileUri;
      } else {
        // Other URI schemes - try to copy to cache
        try {
          const cacheFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
          const destinationPath = `${RNFS.CachesDirectoryPath}/${cacheFileName}`;
          
          await RNFS.copyFile(fileUri, destinationPath);
          processedFileUri = destinationPath;
          
          console.log('iOS inspection other URI copied to cache:', destinationPath);
        } catch (copyError) {
          console.error('Error copying iOS inspection file to cache:', copyError);
          throw new Error('Failed to process inspection file on iOS');
        }
      }
    }
    
    console.log('Final inspection file path for upload:', processedFileUri);
    
    try {
      const reference = storage().ref(path);
      await reference.putFile(processedFileUri);
      const url = await reference.getDownloadURL();
      
      console.log('Inspection file uploaded successfully:', url);
      
      // Clean up iOS cache file after successful upload
      if (Platform.OS === 'ios' && processedFileUri.startsWith(RNFS.CachesDirectoryPath)) {
        try {
          await RNFS.unlink(processedFileUri);
          console.log('iOS inspection cache file deleted:', processedFileUri);
        } catch (unlinkError) {
          console.warn('Error deleting iOS inspection cache file:', unlinkError);
        }
      }
      
      return {success: true, url};
    } catch (uploadError) {
      console.error('Firebase Storage inspection upload error:', uploadError);
      
      // Clean up cache file on upload failure
      if (Platform.OS === 'ios' && processedFileUri.startsWith(RNFS.CachesDirectoryPath)) {
        try {
          await RNFS.unlink(processedFileUri);
          console.log('iOS inspection cache file cleaned up after upload failure:', processedFileUri);
        } catch (unlinkError) {
          console.warn('Error cleaning up iOS inspection cache file after upload failure:', unlinkError);
        }
      }
      
      throw uploadError;
    }
  } catch (error) {
    console.error('Error in uploadFileToFirebaseStorage:', error);
    
    // Provide specific error message for authentication issues
    if (error.message.includes('not authenticated')) {
      return {success: false, error: 'Authentication required. Please log out and log back in.'};
    }
    
    return {success: false, error: error.message};
  }
};

export const saveInspectionReportApi = async (
  inspectionId,
  reportData,
  templateId,
  userId,
  propertyId,
) => {
  try {
    const docRef = await firestore()
      .collection('inspectionReports')
      .doc(inspectionId) // Use inspectionId as the document ID
      .set(
        {
          inspectionId: inspectionId,
          timestamp: firestore.FieldValue.serverTimestamp(),
          reportData: reportData, // The collected data for all items
          templateId: templateId,
          userId: userId,
          propertyId: propertyId,
          // Add any other relevant top-level fields here, e.g., inspectorId, propertyId
        },
        {merge: true},
      ); // Use merge: true to avoid overwriting if a document for this inspectionId already exists

    // No need to fetch the document back for this operation, just confirm success
    return {success: true};
  } catch (error) {
    console.error('Error saving inspection report to Firestore:', error);
    return {success: false, error: error.message};
  }
};

export const fetchInspectionReportWithUserIdApi = async userId => {
  try {
    if (!userId || typeof userId !== 'string') {
      console.error(
        'Invalid userId provided to fetchInspectionReportWithUserIdApi:',
        userId,
      );
      return {success: true, data: []};
    }

    const snapshot = await firestore()
      .collection('inspectionReports')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    const reports = snapshot.docs.map(doc => {
      const data = doc.data();
      const timestampDate = data.timestamp?.toDate();
      const {timestamp, ...rest} = data;

      return {
        id: doc.id,
        timestamp: timestampDate ? timestampDate.toISOString() : null,
        timestampFormatted: timestampDate
          ? moment(timestampDate).format('DD MMM YYYY, h:mm:ss a')
          : null,
        ...rest,
      };
    });

    console.log('Inspection reports fetched in API:', reports);
    return {success: true, data: reports};
  } catch (error) {
    console.error('Error fetching inspection reports by userId:', error);
    return {success: false, error: error.message};
  }
};

export const fetchInspectionDetailsByIdsApi = async inspectionIds => {
  try {
    const ids = Array.isArray(inspectionIds) ? inspectionIds : [inspectionIds];

    if (!ids || ids.length === 0) {
      console.error('No inspection IDs provided');
      return {success: false, error: 'No inspection IDs provided'};
    }

    const validInspectionIds = ids.filter(
      id =>
        id &&
        (typeof id === 'string' || typeof id === 'number') &&
        String(id).trim() !== '',
    );

    if (validInspectionIds.length === 0) {
      console.error('No valid inspection IDs found');
      return {success: false, error: 'No valid inspection IDs found'};
    }

    const chunkSize = 10;
    const inspectionChunks = [];
    for (let i = 0; i < validInspectionIds.length; i += chunkSize) {
      inspectionChunks.push(validInspectionIds.slice(i, i + chunkSize));
    }

    const allInspections = [];

    for (const chunk of inspectionChunks) {
      const inspectionsSnapshot = await firestore()
        .collection('inspections')
        .where(firestore.FieldPath.documentId(), 'in', chunk)
        .get();

      const chunkInspections = inspectionsSnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAtDate = data.createdAt?.toDate();

        const {createdAt, ...rest} = data;

        return {
          id: doc.id,
          createdAt: createdAtDate ? createdAtDate.toISOString() : null,
          createdAtFormatted: createdAtDate
            ? moment(createdAtDate).format('DD MMM YYYY, h:mm:ss a')
            : null,
          ...rest,
        };
      });

      allInspections.push(...chunkInspections);
    }
    return {success: true, data: allInspections};
  } catch (error) {
    console.error('Error fetching inspection details by IDs:', error);
    return {success: false, error: error.message};
  }
};
