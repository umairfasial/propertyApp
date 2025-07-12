export const addCertificateApi = async certificateData => {
  try {
    const {
      propertyId,
      certificateType,
      startDate,
      endDate,
      neverExpires,
      status,
      certificateFile,
      userId,
    } = certificateData;

    // Upload certificate file to Firebase Storage
    const storageRef = ref(
      storage,
      `certificates/${userId}/${Date.now()}_${certificateFile.name}`,
    );
    const fileSnapshot = await uploadBytes(storageRef, certificateFile);
    const fileUrl = await getDownloadURL(fileSnapshot.ref);

    // Add certificate to Firestore
    const certificateRef = await addDoc(collection(db, 'certificates'), {
      propertyId,
      certificateType,
      startDate: Timestamp.fromDate(new Date(startDate)),
      endDate: neverExpires ? null : Timestamp.fromDate(new Date(endDate)),
      neverExpires,
      status,
      certificateFileUrl: fileUrl,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Get the newly created certificate
    const newCertificate = await getDoc(certificateRef);
    return {id: newCertificate.id, ...newCertificate.data()};
  } catch (error) {
    console.error('Error adding certificate:', error);
    throw error;
  }
};

export const editCertificateApi = async (certificateData, certificateId) => {
  try {
    const {
      propertyId,
      certificateType,
      startDate,
      endDate,
      neverExpires,
      status,
      certificateFile,
      userId,
    } = certificateData;

    let fileUrl = null;

    // Only upload new file if provided
    if (certificateFile) {
      const storageRef = ref(
        storage,
        `certificates/${userId}/${Date.now()}_${certificateFile.name}`,
      );
      const fileSnapshot = await uploadBytes(storageRef, certificateFile);
      fileUrl = await getDownloadURL(fileSnapshot.ref);
    }

    // Update certificate in Firestore
    const certificateRef = doc(db, 'certificates', certificateId);
    const updateData = {
      propertyId,
      certificateType,
      startDate: Timestamp.fromDate(new Date(startDate)),
      endDate: neverExpires ? null : Timestamp.fromDate(new Date(endDate)),
      neverExpires,
      status,
      updatedAt: Timestamp.now(),
    };

    // Only update file URL if a new file was uploaded
    if (fileUrl) {
      updateData.certificateFileUrl = fileUrl;
    }

    await updateDoc(certificateRef, updateData);

    // Get the updated certificate
    const updatedCertificate = await getDoc(certificateRef);
    return {id: updatedCertificate.id, ...updatedCertificate.data()};
  } catch (error) {
    console.error('Error editing certificate:', error);
    throw error;
  }
};
