import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Linking,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {pick} from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import CheckBox from 'react-native-check-box';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomDropdown from '../components/ui/Dropdown';
import {
  countData,
  CountryCodes,
  countryData,
  currencyData,
  tenancyTypes,
} from '../contants/Constants';
import House from '../assets/icons/home.svg';
import Apartment from '../assets/icons/properties.svg';
import Office from '../assets/icons/office.svg';
import Room from '../assets/icons/roomIcon.svg';
import Retail from '../assets/icons/retailIcon.svg';
import Industrial from '../assets/icons/industry.svg';
import {useDispatch, useSelector} from 'react-redux';
import {
  addPropertySlice,
  editPropertySlice,
} from '../redux/slices/property/propertySlice';
import {useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import UploadIcon from '../assets/icons/upload.svg';

const validationSchema = Yup.object().shape({
  propertyName: Yup.string().required('Property Name is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  postalCode: Yup.string().required('Postal Code is required'),
  monthlyIncome: Yup.string().required('Monthly income is required'),
});

const typeIcons = {
  Room,
  Apartment,
  House,
  Retail,
  Office,
  Industrial,
};

export default function PropertyForm({navigation}) {
  const route = useRoute();
  const {propertyId} = route?.params || '';
  const [step, setStep] = useState('Type');
  const [progress, setProgress] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [reviewDate, setReviewDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tenancyType, setTenancyType] = useState('Rental Contract');
  const [currency, setCurrency] = useState(null);
  const [country, setCountry] = useState(null);
  const {properties} = useSelector(state => state.property);
  const [contractFile, setContractFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [uploading, setUploading] = useState(false);
  const selectedProperty = properties?.find(
    property => property?.id === propertyId,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePickerIos, setShowDatePickerIos] = useState(false);
  const formRef = useRef();

  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.userData);

  useEffect(() => {
    setPropertyType('Room');
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      setPropertyType(selectedProperty.propertyType);
      setReviewDate(new Date(selectedProperty.reviewDate));
      setCountry(selectedProperty.country);
      setTenancyType(selectedProperty.tenancyType);
      setCurrency(selectedProperty.currency);
      setCountry(selectedProperty.country);
      formRef.current.setValues({
        propertyName: selectedProperty?.propertyName || '',
        address: selectedProperty?.address || '',
        city: selectedProperty?.city || '',
        postalCode: selectedProperty?.postalCode || '',
        monthlyIncome: selectedProperty?.monthlyIncome || '',
        empty: selectedProperty?.empty || false,
        ownerOccupied: selectedProperty?.ownerOccupied || false,
        noOfBedrooms: selectedProperty?.noOfBedrooms || '',
        noOfBathrooms: selectedProperty?.noOfBathrooms || '',
        rearGarden: selectedProperty?.rearGarden || false,
        offStreetParking: selectedProperty?.offStreetParking || false,
        unit: selectedProperty?.unit || '',
        floor: selectedProperty?.floor || '',
        building: selectedProperty?.building || '',
      });
    }
  }, [selectedProperty]);

  const formatDate = date => {
    if (!date) return 'DD MON YYYY';
    return date.toLocaleDateString();
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (event.type === 'set' && selectedDate) {
      const onlyDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      setReviewDate(onlyDate);
    }
  };

  // Function to check if Type section is complete
  const isTypeComplete = () => {
    return propertyType !== '';
  };

  // Function to check if Details section is complete
  const isDetailsComplete = values => {
    return (
      values.propertyName !== '' &&
      values.address !== '' &&
      values.city !== '' &&
      values.postalCode !== ''
    );
  };

  // Function to check if Contract section is complete
  const isContractComplete = values => {
    return (
      tenancyType !== '' &&
      reviewDate !== null &&
      currency !== '' &&
      values.monthlyIncome !== ''
    );
  };

  // Update progress based on form completion
  const updateProgress = values => {
    if (isTypeComplete()) {
      if (isDetailsComplete(values)) {
        if (isContractComplete(values)) {
          setProgress(3);
          setStep('Contract');
        } else {
          setProgress(2);
          setStep('Contract');
        }
      } else {
        setProgress(1);
        setStep('Details');
      }
    } else {
      setProgress(0);
      setStep('Type');
    }
  };

  // Separate function to handle form submission
  const handleFormSubmit = async values => {
    if (!userData || !userData.uid) {
      Alert.alert('Error', 'User not authenticated. Please log in again.');
      return;
    }

    if (!propertyType) {
      Alert.alert('Error', 'Please select a property type');
      return;
    }

    if (!reviewDate) {
      Alert.alert('Error', 'Please select a review date');
      return;
    }

    if (!contractFile) {
      Alert.alert('Error', 'Please upload a contract document');
      return;
    }

    const filteredValues = {...values};

    if (propertyType === 'Room' || propertyType === 'Apartment') {
      delete filteredValues.noOfBedrooms;
      delete filteredValues.noOfBathrooms;
      delete filteredValues.rearGarden;
      delete filteredValues.offStreetParking;
      delete filteredValues.unit;
      delete filteredValues.floor;
      delete filteredValues.building;
    } else if (propertyType === 'House') {
      delete filteredValues.unit;
      delete filteredValues.floor;
      delete filteredValues.building;
    } else if (propertyType === 'Retail') {
      delete filteredValues.noOfBedrooms;
      delete filteredValues.noOfBathrooms;
      delete filteredValues.rearGarden;
      delete filteredValues.offStreetParking;
      delete filteredValues.floor;
      delete filteredValues.building;
    } else if (propertyType === 'Office' || propertyType === 'Industrial') {
      delete filteredValues.noOfBedrooms;
      delete filteredValues.noOfBathrooms;
      delete filteredValues.rearGarden;
      delete filteredValues.offStreetParking;
    }

    setIsSubmitting(true);

    try {
      const finalData = {
        ...filteredValues,
        propertyType,
        reviewDate,
        tenancyType,
        currency,
        country,
        contractFile: contractFile,
        userId: userData.uid,
      };
      console.log('finalData', finalData);

      let response;
      if (selectedProperty) {
        response = await dispatch(
          editPropertySlice({finalData, propertyId}),
        ).unwrap();
      } else {
        response = await dispatch(addPropertySlice({finalData})).unwrap();
      }

      navigation.navigate('AssignManager', {
        propertyId: response.id,
        next: true,
      });

      Alert.alert(
        'Success',
        `Property  ${propertyId ? 'Editted' : 'Added'} Successfully`,
      );
    } catch (error) {
      console.error('Error submitting property:', error);
      Alert.alert('Error', 'Failed to add property. Please try again.');
    } finally {
      setIsSubmitting(false);
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

        setContractFile(file);
        setFileError('');
      }
    } catch (err) {
      if (!err.isCancel) {
        setFileError('Error picking the document');
        console.log('Document picker error:', err);
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{flex: 1}}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled">
      <SafeAreaView>
        <View style={styles.container}>
          <View style={[styles.stepIndicatorContainer]}>
            {['Type', 'Details', 'Contract'].map((label, index) => (
              <React.Fragment key={label}>
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.circle,
                      index + 1 <= progress
                        ? styles.circleActive
                        : styles.circleInactive,
                    ]}>
                    <Text
                      style={[
                        styles.circleText,
                        index + 1 <= progress
                          ? styles.circleTextActive
                          : styles.circleTextInactive,
                      ]}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      index + 1 <= progress
                        ? styles.stepLabelActive
                        : styles.stepLabelInactive,
                    ]}>
                    {label}
                  </Text>
                </View>
                {index < 2 && (
                  <View style={styles.progressLineContainer}>
                    <View style={styles.progressLineBackground}>
                      <View
                        style={[
                          styles.progressLineFill,
                          {
                            width:
                              index + 1 < progress
                                ? '100%'
                                : index + 1 === progress
                                ? '50%'
                                : '0%',
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}
              </React.Fragment>
            ))}
          </View>

          <Formik
            innerRef={formRef}
            initialValues={{
              propertyName: '',
              address: '',
              city: '',
              postalCode: '',
              monthlyIncome: '',
              empty: false,
              ownerOccupied: false,
              noOfBedrooms: '',
              noOfBathrooms: '',
              rearGarden: false,
              offStreetParking: false,
              unit: '',
              floor: '',
              building: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => {
              // Update progress whenever form values change
              useEffect(() => {
                updateProgress(values);
              }, [values, propertyType, reviewDate, tenancyType, currency]);

              return (
                <>
                  <View style={styles.miniContainer}>
                    <Text style={styles.label}>Property Type</Text>
                    <View style={styles.typeButtons}>
                      {[
                        'Room',
                        'Apartment',
                        'House',
                        'Retail',
                        'Office',
                        'Industrial',
                      ].map(type => {
                        const IconComponent = typeIcons[type];
                        return (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.typeButton,
                              propertyType === type && styles.typeButtonActive,
                            ]}
                            onPress={() => {
                              setPropertyType(type);
                            }}>
                            <IconComponent
                              width={20}
                              height={20}
                              color={
                                propertyType === type ? '#2563EB' : '#4B5563'
                              }
                            />
                            <Text style={[styles.typeButtonText]}>{type}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Inputs */}
                  <View style={styles.miniContainer}>
                    <Text style={styles.label}>Property Details</Text>
                    <TextInput
                      placeholder="Property Name"
                      value={values.propertyName}
                      onChangeText={handleChange('propertyName')}
                      onBlur={handleBlur('propertyName')}
                      style={styles.input}
                      placeholderTextColor="#000"
                    />
                    {touched.propertyName && errors.propertyName && (
                      <Text style={styles.error}>{errors.propertyName}</Text>
                    )}

                    <TextInput
                      placeholder="Address"
                      value={values.address}
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                      style={styles.input}
                      placeholderTextColor="#000"
                    />

                    <View style={styles.googlePlacesContainer}>
                      <GooglePlacesAutocomplete
                        placeholder="Select a location"
                        placeholderTextColor="black"
                        predefinedPlaces={[]}
                        fetchDetails={true}
                        currentLocationLabel="Current Location"
                        onPress={() => {}}
                        query={{
                          key: process.env.GOOGLE_MAPS_API_KEY,
                          language: 'en',
                        }}
                        textInputProps={{
                          placeholderTextColor: 'black',
                          onFocus: () => {},
                        }}
                        styles={{
                          textInput: {
                            ...styles.googleInput,
                            color: 'black',
                          },
                          container: {
                            flex: 1,
                          },
                          listView: {
                            backgroundColor: 'white',
                            position: 'relative',
                            zIndex: 1000,
                          },
                          description: {
                            color: 'black',
                          },
                        }}
                        keyboardShouldPersistTaps="handled"
                      />
                    </View>

                    {touched.address && errors.address && (
                      <Text style={styles.error}>{errors.address}</Text>
                    )}

                    <View style={styles.row}>
                      <View style={styles.inputHalf}>
                        <TextInput
                          placeholder="City"
                          value={values.city}
                          onChangeText={handleChange('city')}
                          onBlur={handleBlur('city')}
                          style={styles.input}
                          placeholderTextColor="#000"
                        />
                        {touched.city && errors.city && (
                          <Text style={styles.error}>{errors.city}</Text>
                        )}
                      </View>

                      <View style={styles.inputHalf}>
                        <TextInput
                          placeholder="Postal Code"
                          value={values.postalCode}
                          onChangeText={handleChange('postalCode')}
                          onBlur={handleBlur('postalCode')}
                          style={styles.input}
                          placeholderTextColor="#000"
                        />
                        {touched.postalCode && errors.postalCode && (
                          <Text style={styles.error}>{errors.postalCode}</Text>
                        )}
                      </View>
                    </View>

                    <View>
                      <CustomDropdown
                        data={countryData}
                        defaultValue={country}
                        placeholder="Select the country"
                        onSelect={value => {
                          setCountry(value);
                          const currency = currencyData.find(
                            item => item.country === value,
                          ).label;
                          setCurrency(currency);
                        }}
                      />
                    </View>
                  </View>
                  {propertyType !== 'Room' && propertyType !== '' && (
                    <View style={styles.miniContainer}>
                      <Text style={styles.label}>More Details</Text>
                      {propertyType === 'House' ||
                        (propertyType === 'Apartment' && (
                          <View>
                            <View style={{marginBottom: 10}}>
                              <CustomDropdown
                                data={countData}
                                placeholder="Number of Bed Rooms"
                                onSelect={handleChange('noOfBedrooms')}
                              />
                            </View>

                            <View style={{marginBottom: 10}}>
                              <CustomDropdown
                                data={countData}
                                placeholder="Number of Bathrooms"
                                onSelect={handleChange('noOfBathrooms')}
                              />
                            </View>
                            <View style={styles.row}>
                              <View
                                style={[
                                  styles.inputHalf,
                                  styles.checkBoxContainer,
                                ]}>
                                <CheckBox
                                  isChecked={values.rearGarden}
                                  onClick={() =>
                                    setFieldValue(
                                      'rearGarden',
                                      !values.rearGarden,
                                    )
                                  }
                                  checkBoxColor={
                                    values.rearGarden ? '#007bff' : '#ccc'
                                  }
                                  rightTextStyle={{
                                    fontSize: 16,
                                    color: '#333',
                                  }}
                                />
                                <Text>Rear Garden</Text>
                              </View>
                              <View
                                style={[
                                  styles.inputHalf,
                                  styles.checkBoxContainer,
                                ]}>
                                <CheckBox
                                  isChecked={values.offStreetParking}
                                  onClick={() =>
                                    setFieldValue(
                                      'offStreetParking',
                                      !values.offStreetParking,
                                    )
                                  }
                                  checkBoxColor={
                                    values.offStreetParking ? '#007bff' : '#ccc'
                                  }
                                  rightTextStyle={{
                                    fontSize: 16,
                                    color: '#333',
                                  }}
                                />
                                <Text>Off Street Parking</Text>
                              </View>
                            </View>
                          </View>
                        ))}
                      {(propertyType === 'Retail' ||
                        propertyType === 'Office' ||
                        propertyType === 'Industrial') &&
                        (propertyType === 'Retail' ? (
                          <TextInput
                            placeholder="Unit Name or Number"
                            value={values.unit}
                            onChangeText={handleChange('unit')}
                            onBlur={handleBlur('unit')}
                            style={styles.input}
                            placeholderTextColor="#000"
                          />
                        ) : (
                          <View>
                            <TextInput
                              placeholder="Unit Name or Number"
                              value={values.unit}
                              onChangeText={handleChange('unit')}
                              onBlur={handleBlur('unit')}
                              style={styles.input}
                              placeholderTextColor="#000"
                            />
                            <TextInput
                              placeholder="Floor Name or Number"
                              value={values.floor}
                              onChangeText={handleChange('floor')}
                              onBlur={handleBlur('floor')}
                              style={styles.input}
                              placeholderTextColor="#000"
                            />

                            <TextInput
                              placeholder="Building Name or Number"
                              value={values.building}
                              onChangeText={handleChange('building')}
                              onBlur={handleBlur('building')}
                              style={styles.input}
                              placeholderTextColor="#000"
                            />
                          </View>
                        ))}
                    </View>
                  )}

                  {/* Picker Row */}
                  <View style={styles.miniContainer}>
                    <View style={[styles.row, {marginVertical: 10}]}>
                      <View
                        style={[styles.inputHalf, styles.checkBoxContainer]}>
                        <CheckBox
                          isChecked={values.empty}
                          onClick={() => {
                            setFieldValue('empty', !values.empty);
                            if (!values.empty)
                              setFieldValue('ownerOccupied', false); // Uncheck other
                          }}
                          checkBoxColor={values.empty ? '#007bff' : '#ccc'}
                          rightTextStyle={{fontSize: 16, color: '#333'}}
                          disabled={values.ownerOccupied} // Disable if other is selected
                        />
                        <Text>Empty property</Text>
                      </View>

                      <View
                        style={[
                          styles.inputHalf,
                          styles.checkBoxContainer,
                          {paddingRight: 10},
                        ]}>
                        <CheckBox
                          isChecked={values.ownerOccupied}
                          onClick={() => {
                            setFieldValue(
                              'ownerOccupied',
                              !values.ownerOccupied,
                            );
                            if (!values.ownerOccupied)
                              setFieldValue('empty', false); // Uncheck other
                          }}
                          checkBoxColor={
                            values.ownerOccupied ? '#007bff' : '#ccc'
                          }
                          rightTextStyle={{fontSize: 16, color: '#333'}}
                          disabled={values.empty} // Disable if other is selected
                        />
                        <Text>Owner Occupied property</Text>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.inputHalf}>
                        <Text style={styles.inputLabel}>Tenancy Type</Text>
                        <CustomDropdown
                          data={tenancyTypes}
                          defaultValue={tenancyType}
                          onSelect={value => setTenancyType(value)}
                        />
                      </View>
                      <View style={styles.inputHalf}>
                        <Text style={styles.inputLabel}>
                          Tenancy Review Date
                        </Text>
                        <TouchableOpacity
                          style={styles.datePicker}
                          onPress={() => {
                            Platform.OS === 'android'
                              ? setShowDatePicker(true)
                              : setShowDatePickerIos(true);
                          }}>
                          <Text style={styles.dateText}>
                            {formatDate(reviewDate)}
                          </Text>
                        </TouchableOpacity>
                        {(showDatePicker || showDatePickerIos) &&
                          (Platform.OS === 'android' ? (
                            <DateTimePicker
                              value={reviewDate || new Date()}
                              mode="date"
                              display="default"
                              onChange={handleDateChange}
                            />
                          ) : (
                            <Modal
                              transparent={true}
                              animationType="slide"
                              visible={showDatePickerIos}
                              onRequestClose={() =>
                                setShowDatePickerIos(false)
                              }>
                              <View style={styles.modalBackground}>
                                <View style={styles.modalContainer}>
                                  <DateTimePicker
                                    value={reviewDate || new Date()}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, selectedDate) => {
                                      if (selectedDate)
                                        setReviewDate(selectedDate);
                                    }}
                                    style={{width: '100%'}}
                                  />
                                  <TouchableOpacity
                                    style={styles.doneButton}
                                    onPress={() => setShowDatePickerIos(false)}>
                                    <Text style={styles.doneText}>Done</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </Modal>
                          ))}
                      </View>
                    </View>

                    <View style={styles.row}>
                      <View style={styles.inputHalf}>
                        <Text style={styles.inputLabel}>Currency</Text>
                        <CustomDropdown
                          data={currencyData}
                          defaultValue={currency}
                          onSelect={value => setCurrency(value)}
                        />
                      </View>

                      <View style={styles.inputHalf}>
                        <Text style={styles.inputLabel}>
                          Monthly Income inc. Rent
                        </Text>
                        <TextInput
                          placeholder="0.00"
                          value={values.monthlyIncome}
                          onChangeText={handleChange('monthlyIncome')}
                          onBlur={handleBlur('monthlyIncome')}
                          keyboardType="numeric"
                          style={styles.input}
                          placeholderTextColor="#000"
                        />
                        {touched.monthlyIncome && errors.monthlyIncome && (
                          <Text style={styles.error}>
                            {errors.monthlyIncome}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  <View style={styles.uploadBox}>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={pickDocument}
                      activeOpacity={0.7}>
                      {contractFile ? (
                        <View style={styles.filePreview}>
                          <View style={styles.fileIconContainer}>
                            <View style={styles.fileIcon} />
                          </View>
                          <Text style={styles.fileName} numberOfLines={1}>
                            {contractFile.name}
                          </Text>
                          <Text style={styles.fileSize}>
                            {(contractFile.size / (1024 * 1024)).toFixed(2)} MB
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.uploadText}>
                          <UploadIcon color="#9CA3AF" width={30} height={20} />
                          {'\n'}
                          <Text
                            style={[styles.uploadText, {fontWeight: '700'}]}>
                            Click to upload or drag and drop
                          </Text>
                          {'\n'}PDF, DOC up to 5MB
                        </Text>
                      )}
                    </TouchableOpacity>
                    {fileError ? (
                      <Text style={styles.error}>{fileError}</Text>
                    ) : null}
                  </View>

                  {/* Submit */}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      isSubmitting && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}>
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                        {propertyId
                          ? 'Edit Property Details'
                          : 'Add Property Details'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              );
            }}
          </Formik>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  miniContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  stepItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  circleActive: {
    backgroundColor: '#2563EB',
  },
  circleInactive: {
    backgroundColor: '#E5E7EB',
  },
  circleText: {
    fontWeight: 'bold',
  },
  circleTextActive: {
    color: '#FFFFFF',
  },
  circleTextInactive: {
    color: '#9CA3AF',
  },
  stepLabel: {
    marginTop: 4,
    fontSize: 12,
  },
  stepLabelActive: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  stepLabelInactive: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#007bff',
  },
  typeButtonText: {
    color: '#1F2937',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 500,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputHalf: {
    width: '48%',
  },
  googleInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: 'black',
  },
  inputLabel: {
    marginBottom: 5,
    color: '#6B7280',
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 12,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    padding: 12,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    borderStyle: 'dashed',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    height: 150,
    backgroundColor: '#FFFFFF',
  },

  uploadText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  progressLineContainer: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  progressLineBackground: {
    height: 4,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressLineFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: '#2563EB',
    transition: 'width 0.3s ease',
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
  submitButtonDisabled: {
    opacity: 0.7,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  doneButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    padding: 10,
  },
  doneText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  googlePlacesContainer: {
    marginBottom: 10,
    zIndex: 999,
  },
});
