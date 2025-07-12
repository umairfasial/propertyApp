import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import PropertyIcon from '../assets/icons/properties.svg';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchInspectionTemplatesSlice,
  scheduleInspectionSlice,
  fetchInspectionsByUserIdSlice,
} from '../redux/slices/inspection/inspectionSlice';

const property = [
  {label: '123 Main Street', value: '123', type: 'Commercial Property'},
  {label: '456 Oak Avenue', value: '456', type: 'Residential Property'},
];

const templates = [
  {
    label: 'Commercial Space',
    value: 'commercial',
    description: 'Office inspection template',
  },
  {
    label: 'Residential Space',
    value: 'residential',
    description: 'Home inspection template',
  },
];

const inspectors = [
  {label: 'John Smith - Inspector', value: 'John Smith'},
  {label: 'Emily Davis - Inspector', value: 'Emily Davis'},
];

const ScheduleInspection = ({navigation}) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedInspector, setSelectedInspector] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const {properties} = useSelector(state => state.property);

  const dispatch = useDispatch();
  const {
    inspectionTemplates,
    scheduleLoading,
    successMessage,
    error,
    userInspections,
    fetchInspectionsLoading,
  } = useSelector(state => state.inspection);
  const {userData} = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchInspectionTemplatesSlice());
    if (userData?.uid) {
      dispatch(fetchInspectionsByUserIdSlice(userData.uid));
    }
  }, [userData?.uid]);

  const mappedTemplates = inspectionTemplates.map(template => ({
    label: template.name,
    value: template.id,
    description: template.description,
  }));

  const mappedProperties = properties.map(item => ({
    label: item.propertyName,
    value: item.id,
    type: item.propertyType,
  }));

  useEffect(() => {
    if (mappedProperties.length > 0) {
      setSelectedProperty(mappedProperties[0]);
    }
    if (inspectionTemplates.length > 0) {
      setSelectedTemplate(mappedTemplates[0]);
    }
  }, [properties, inspectionTemplates]);

  console.log('properties', properties);

  const formatDate = date => {
    if (!date) return 'DD MMM YYYY';
    return moment(date).format('DD MMM YYYY');
  };

  const handleDateChange = (event, selectedDate) => {
    const isSet = event.type === 'set';
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (isSet && selectedDate) {
      const onlyDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      setSelectedDate(onlyDate);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProperty) {
      Alert.alert('Validation Error', 'Please select a property.');
      return;
    }
    if (!selectedTemplate) {
      Alert.alert('Validation Error', 'Please select an inspection template.');
      return;
    }
    if (!selectedInspector) {
      Alert.alert('Validation Error', 'Please assign an inspector.');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Validation Error', 'Please select a date.');
      return;
    }

    const finalData = {
      property: selectedProperty.value,
      template: selectedTemplate.value,
      inspector: selectedInspector.value,
      date: moment(selectedDate).format('DD MMM YYYY'),
      userId: userData?.uid,
    };

    console.log('finalData', finalData);

    try {
      const result = await dispatch(
        scheduleInspectionSlice(finalData),
      ).unwrap();
      if (result.success) {
        Alert.alert('Success', 'Inspection scheduled successfully');
        navigation.navigate('PropertyInspection');

        dispatch(fetchInspectionsByUserIdSlice(userData.uid));
      } else {
        Alert.alert('Error', result.error || 'Failed to schedule inspection');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to schedule inspection');
    }
  };

  const renderInspectionItem = ({item}) => (
    <View style={styles.inspectionItem}>
      <View style={styles.inspectionHeader}>
        <Text style={styles.inspectionTitle}>
          Inspection #{item.id.slice(-6)}
        </Text>
        <Text style={styles.inspectionDate}>{item.date}</Text>
      </View>
      <View style={styles.inspectionDetails}>
        <Text style={styles.inspectionProperty}>Property: {item.property}</Text>
        <Text style={styles.inspectionTemplate}>Template: {item.template}</Text>
        <Text style={styles.inspectionInspector}>
          Inspector: {item.inspector}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.propertyContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.label}>Select Property</Text>
          <Dropdown
            data={mappedProperties}
            value={null}
            labelField="label"
            onChange={item => setSelectedProperty(item)}
            style={{
              width: '50%',
              height: 40,
              borderRadius: 8,
              zIndex: 10,
            }}
            selectedTextStyle={{
              fontFamily: 'Inter',
              fontSize: 14,
              color: '#fff',
            }}
            itemTextStyle={{
              fontFamily: 'Inter',
              fontSize: 14,
              color: '#000',
              width: 400,
            }}
          />
        </View>
        {selectedProperty && (
          <View style={styles.selectedCard}>
            <View style={styles.iconContainer}>
              <PropertyIcon width={20} height={20} />
            </View>
            <View>
              <Text style={styles.infoTitle}>{selectedProperty.label}</Text>
              <Text style={styles.infoSubtitle}>{selectedProperty.type}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Inspection Template</Text>
        <View
          style={{
            backgroundColor: '#F9FAFB',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
          }}>
          <View>
            <Text style={styles.title}>{selectedTemplate?.label}</Text>
            <Text style={styles.description}>
              {selectedTemplate?.description}
            </Text>
          </View>

          <Dropdown
            data={mappedTemplates}
            labelField="label"
            onChange={item => setSelectedTemplate(item)}
            style={{
              width: '50%',
              height: 40,
              borderRadius: 8,
            }}
            selectedTextStyle={{
              color: 'transparent',
            }}
            placeholder="Select Template"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date & Time</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.selectDate}>
              {selectedDate ? formatDate(selectedDate) : 'Select Date'}{' '}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.dateInput}>
            {showDatePicker &&
              (Platform.OS === 'android' ? (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    handleDateChange(event, date);
                  }}
                />
              ) : (
                <Modal
                  transparent
                  animationType="slide"
                  visible={showDatePicker && Platform.OS === 'ios'}
                  onRequestClose={() => setShowDatePicker(false)}>
                  <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                      <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display="spinner"
                        onChange={(event, date) => {
                          handleDateChange(event, date);
                        }}
                        style={{width: '100%'}}
                      />
                      <TouchableOpacity
                        style={styles.doneButton}
                        onPress={() => setShowDatePicker(false)}>
                        <Text style={styles.doneText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              ))}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.label}>Assign Inspector</Text>
          <Dropdown
            data={inspectors}
            labelField="label"
            valueField="value"
            value={selectedInspector?.value}
            onChange={item => setSelectedInspector(item)}
            placeholder="Inspector"
            style={{
              width: '50%',
              height: 40,
              borderRadius: 8,
            }}
            selectedTextStyle={{
              color: '#000',
            }}
            renderLeftIcon={() => (
              <Image
                source={{uri: 'https://i.pravatar.cc/100'}}
                style={styles.avatar}
              />
            )}
          />
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.scheduleBtn}
          onPress={() => navigation.navigate('PropertyInspection')}>
          <Text style={styles.btnText}>Schedule Inspection</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.inspectNowBtn,
            scheduleLoading && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={scheduleLoading}>
          {scheduleLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Inspect Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  propertyContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 5,
    paddingBottom: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  iconContainer: {
    padding: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginRight: 8,
    marginTop: 4,
  },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',

    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  infoSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },

  dropdown: {
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  infoCard: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  infoSubtitle: {
    color: 'gray',
    fontFamily: 'Inter',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  cardTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  description: {
    color: 'gray',
    marginTop: 4,
    fontFamily: 'Inter',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  selectDate: {
    color: '#007AFF',
    fontFamily: 'Inter',
  },
  selectedDate: {
    color: 'gray',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  scheduleBtn: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  inspectNowBtn: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
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
  statusInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  dateField: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    justifyContent: 'center',
    left: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  inspectionsList: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Inter',
  },
  inspectionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  inspectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inspectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  inspectionDate: {
    color: '#666',
    fontFamily: 'Inter',
  },
  inspectionDetails: {
    gap: 5,
  },
  inspectionProperty: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter',
  },
  inspectionTemplate: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter',
  },
  inspectionInspector: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontFamily: 'Inter',
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
});

export default ScheduleInspection;
