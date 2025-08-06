import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';

import {pick} from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import Dropdown from '../components/ui/Dropdown';
import CertificateCard from '../components/ui/CertificateCard';
import {useSelector, useDispatch} from 'react-redux';
import {certificateTypes} from '../contants/Constants';
import * as Yup from 'yup';
import {
  addCertificateSlice,
  editCertificateSlice,
  fetchCertificatesSlice,
} from '../redux/slices/property/propertySlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Ionicons} from '@expo/vector-icons';
import {useRoute} from '@react-navigation/native';
import moment from 'moment';
import TagInput from '../components/ui/TagInput';
import UploadIcon from '../assets/icons/upload.svg';

const validationSchema = Yup.object().shape({
  propertyId: Yup.string().required('Property is required'),
  certificateType: Yup.string().required('Certificate type is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'End date must be after start date')
    .required('End date is required'),
  status: Yup.string().required('Status is required'),
});

const AddCertificate = ({navigation}) => {
  const route = useRoute();
  const {certificateId} = route.params || '';
  const dispatch = useDispatch();
  const {properties, loading} = useSelector(state => state.property);
  const {userData} = useSelector(state => state.auth);
  const {certificates} = useSelector(state => state.property);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedCertificateType, setSelectedCertificateType] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [status, setStatus] = useState([]);
  const [certificateFile, setCertificateFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [neverExpires, setNeverExpires] = useState(false);

  useEffect(() => {
    if (certificateId) {
      const certificateData = certificates.find(
        cert => cert.id === certificateId,
      );
      setSelectedCertificateType(certificateData?.certificateType || '');
      setSelectedProperty(certificateData?.propertyId || '');
      setStartDate(moment(certificateData?.startDate).format('YYYY-MM-DD'));
      setEndDate(moment(certificateData?.endDate).format('YYYY-MM-DD'));
      setStatus(certificateData?.status || '');
      setNeverExpires(certificateData?.neverExpires || false);
      console.log('certificate data is', certificateData);
    }
  }, [certificateId]);

  const formatDate = date => {
    if (!date) return 'DD MON YYYY';
    return moment(date).format('DD/MM/YYYY');
  };

  const handleStartDateChange = (event, selectedDate) => {
    const isSet = event.type === 'set';
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }
    if (isSet && selectedDate) {
      const onlyDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      setStartDate(onlyDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    const isSet = event.type === 'set';
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }
    if (isSet && selectedDate) {
      const onlyDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      setEndDate(onlyDate);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await pick({
        copyTo: 'cachesDirectory',
      });

      if (result && result[0]) {
        const file = result[0];
        console.log('Selected file:', file);

        const fileType = file.type?.toLowerCase() || '';
        const isValidType = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(fileType);

        if (!isValidType) {
          setFileError('Please select only PDF or DOC files');
          return;
        }

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          setFileError('File size should be less than 5MB');
          return;
        }

        // For Android, we need to copy the file to a location we can access
        if (Platform.OS === 'android' && file.uri) {
          try {
            // Create a unique filename in the app's cache directory
            const fileName = `${Date.now()}_${Math.random()
              .toString(36)
              .substring(7)}_${file.name}`;
            const destinationPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

            // Copy the file to our accessible location
            await RNFS.copyFile(file.uri, destinationPath);

            // Update the file object with the new path
            file.uri = destinationPath;
            console.log('File copied to:', destinationPath);
          } catch (copyError) {
            console.error('Error copying file:', copyError);
            setFileError('Error processing the selected file');
            return;
          }
        }

        setCertificateFile(file);
        setFileError('');
      }
    } catch (err) {
      if (!err.isCancel) {
        setFileError('Error picking the document');
        console.log('Document picker error:', err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedProperty) {
      Alert.alert('Error', 'Please select a property');
      return;
    }

    if (!selectedCertificateType) {
      Alert.alert('Error', 'Please select a certificate type');
      return;
    }

    if (!startDate) {
      Alert.alert('Error', 'Please select a start date');
      return;
    }

    if (!neverExpires && !endDate) {
      Alert.alert('Error', 'Please select an end date');
      return;
    }

    if (!certificateFile) {
      Alert.alert('Error', 'Please upload a certificate document');
      return;
    }

    setUploading(true);

    try {
      const certificateData = {
        propertyId: selectedProperty,
        certificateType: selectedCertificateType,
        startDate,
        endDate: neverExpires ? null : endDate,
        neverExpires,
        status,
        certificateFile,
        userId: userData.uid,
      };

      console.log('certificateData', certificateData);
      if (certificateId) {
        await dispatch(
          editCertificateSlice({certificateData, certificateId}),
        ).unwrap();
      } else {
        await dispatch(addCertificateSlice(certificateData)).unwrap();
      }
      dispatch(fetchCertificatesSlice({userId: userData.uid}));
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting certificate:', error);
    } finally {
      setUploading(false);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Select Property</Text>
          <Dropdown
            label="Select Property"
            data={properties.map(property => ({
              label: property.propertyName,
              value: property.id,
            }))}
            value={selectedProperty}
            onSelect={setSelectedProperty}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Type</Text>
          <Dropdown
            label="Certificate Type"
            data={certificateTypes}
            value={selectedCertificateType}
            onSelect={setSelectedCertificateType}
          />
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.dateInput}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.dateField}
              onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.placeholder}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
            {showStartDatePicker &&
              (Platform.OS === 'android' ? (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                />
              ) : (
                <Modal
                  transparent
                  animationType="slide"
                  visible={showStartDatePicker && Platform.OS === 'ios'}
                  onRequestClose={() => setShowStartDatePicker(false)}>
                  <View style={styles.modalContainer}>
                    <DateTimePicker
                      value={startDate || new Date()}
                      mode="date"
                      display="spinner"
                      onChange={(event, date) => {
                        handleStartDateChange(event, date);
                      }}
                      style={{width: '100%'}}
                    />
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={() => setShowStartDatePicker(false)}>
                      <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              ))}
          </View>

          <View style={styles.dateInput}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              style={[
                styles.dateField,
                neverExpires && styles.disabledDateField,
              ]}
              onPress={() => !neverExpires && setShowEndDatePicker(true)}
              disabled={neverExpires}>
              <Text
                style={[
                  styles.placeholder,
                  neverExpires && styles.disabledText,
                ]}>
                {neverExpires ? 'Never Expires' : formatDate(endDate)}
              </Text>
            </TouchableOpacity>
            {showEndDatePicker &&
              !neverExpires &&
              (Platform.OS === 'android' ? (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                />
              ) : (
                <Modal
                  transparent
                  animationType="slide"
                  visible={showEndDatePicker && Platform.OS === 'ios'}
                  onRequestClose={() => setShowEndDatePicker(false)}>
                  <View style={styles.modalContainer}>
                    <DateTimePicker
                      value={endDate || new Date()}
                      mode="date"
                      display="spinner"
                      onChange={(event, date) => {
                        handleEndDateChange(event, date);
                      }}
                      style={{width: '100%'}}
                    />
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={() => setShowEndDatePicker(false)}>
                      <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              ))}
          </View>
        </View>

        <View style={styles.neverExpiresContainer}>
          <Text style={styles.neverExpiresLabel}>Never Expires</Text>
          <Switch
            value={neverExpires}
            onValueChange={setNeverExpires}
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={neverExpires ? '#2563EB' : '#f4f3f4'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Certificate Status</Text>
          <TagInput tags={status} setTags={setStatus} />
        </View>

        <View style={styles.uploadBox}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickDocument}
            activeOpacity={0.7}>
            {certificateFile ? (
              <View style={styles.filePreview}>
                <View style={styles.fileIconContainer}>
                  <View style={styles.fileIcon} />
                </View>
                <Text style={styles.fileName} numberOfLines={1}>
                  {certificateFile.name}
                </Text>
                <Text style={styles.fileSize}>
                  {(certificateFile.size / (1024 * 1024)).toFixed(2)} MB
                </Text>
              </View>
            ) : (
              <Text style={styles.uploadText}>
                <UploadIcon color="#9CA3AF" width={30} height={20} />
                {'\n'}
                <Text style={[styles.uploadText, {fontWeight: '700'}]}>
                  Click to upload or drag and drop
                </Text>
                {'\n'}PDF, DOC up to 5MB
              </Text>
            )}
          </TouchableOpacity>
          {fileError ? <Text style={styles.error}>{fileError}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.addButton, uploading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={uploading}>
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>
              {certificateId ? 'Update Certificate' : 'Add Certificate'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.certificatesSection}>
        <Text style={styles.sectionTitle}>Registered Certificates</Text>
        {certificates.map((cert, index) => (
          <CertificateCard key={index} {...cert} />
        ))}
        {certificates.length === 0 && (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{color: '#6B7280'}}>No registered certificates</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  formContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 5,
    color: '#6B7280',
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
  },
  dateField: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  statusInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  placeholder: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  uploadBox: {
    marginBottom: 16,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    borderStyle: 'dashed',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    height: 120,
    backgroundColor: '#FFFFFF',
  },
  uploadIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  uploadText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  certificatesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  error: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  filePreview: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#9CA3AF',
    borderRadius: 4,
  },
  fileName: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  fileSize: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  doneButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    padding: 10,
  },
  neverExpiresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    width: '50%',
  },
  neverExpiresLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  disabledDateField: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  disabledText: {
    color: '#9CA3AF',
  },
});

export default AddCertificate;
