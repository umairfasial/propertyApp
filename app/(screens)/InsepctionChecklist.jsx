import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from '../assets/icons/clockOutlined.svg';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchInspectionItemsByIdsSlice,
  saveInspectionReportSlice,
  clearInspectionState,
} from '../redux/slices/inspection/inspectionSlice';
import InspectionChecklistCard from '../components/InspectionChecklistCard';

export default function InsepctionChecklist({navigation, route}) {
  const params = route?.params || {};
  const {inspectionId, propertyId, templateId} = params;

  const {
    userInspections,
    selectedTemplate,
    selectedItems,
    loading,
    error,
    successMessage,
  } = useSelector(state => state.inspection);
  const {selectedProperty} = useSelector(state => state.property);
  const {userData} = useSelector(state => state.auth);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [selectProperty, setSelectProperty] = useState(null);
  const [selectTemplate, setSelectTemplate] = useState(null);
  const [checklistItemsData, setChecklistItemsData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (templateId) {
      let inspectionItems = [];
      const template = selectedTemplate?.find(item => item?.id === templateId);
      template?.inspectionItems?.forEach(item => {
        inspectionItems.push(item);
      });
      dispatch(fetchInspectionItemsByIdsSlice(inspectionItems));
    }
  }, [templateId, selectedTemplate]);

  useEffect(() => {
    if (inspectionId && propertyId && templateId) {
      const inspection = userInspections?.find(
        item => item.id === inspectionId,
      );
      const property = selectedProperty?.find(item => item?.id === propertyId);
      const template = selectedTemplate?.find(item => item?.id === templateId);

      setSelectedInspection(inspection || null);
      setSelectProperty(property);
      setSelectTemplate(template);
    }
  }, [
    inspectionId,
    propertyId,
    templateId,
    userInspections,
    selectedProperty,
    selectedTemplate,
  ]);

  const handleItemDataChange = (itemId, data) => {
    setChecklistItemsData(prevData => ({
      ...prevData,
      [itemId]: data,
    }));
  };

  const handleCancel = () => {
    console.log('Cancel button pressed');
    navigation.goBack();
  };

  const handleCompleteInspection = () => {
    console.log('Complete Inspection button pressed');
    console.log('Collected Checklist Data:', checklistItemsData);

    const allRequiredItemsComplete = selectedItems?.every(item => {
      const itemData = checklistItemsData[item.id];
      const isRequired =
        item.inspectionData.options &&
        Object.values(item.inspectionData.options).some(
          option => option === true,
        );

      if (!isRequired) return true;

      return itemData?.isSkipped || itemData?.isComplete;
    });

    if (!allRequiredItemsComplete) {
      Alert.alert(
        'Incomplete Inspection',
        'Please complete all required checklist items or mark them as skipped.',
      );
      return;
    }

    console.log('checklistItemsData', checklistItemsData);

    dispatch(
      saveInspectionReportSlice({
        inspectionId,
        checklistItemsData,
        templateId,
        userId: userData.uid,
        propertyId,
      }),
    ).then(() => {
      Alert.alert('success', 'Inspection Report Submitted Successfully');
      navigation.navigate('PropertyInspection');
    });
  };

  return (
    <View style={styles.mainContainer}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Saving Inspection...</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}>
        <View style={styles.card}>
          <Text style={styles.title}>{selectTemplate?.name}</Text>
          <Text style={styles.subtitle}>{selectProperty?.address}</Text>
          <View style={styles.timeContainer}>
            <Feather name="clock" size={16} color="#333" />
            <Text style={styles.timeText}>
              Started: {selectedInspection?.date}
            </Text>
          </View>
        </View>
        {selectedItems?.map((item, index) => {
          return (
            <InspectionChecklistCard
              key={item.id}
              itemId={item.id}
              title={item.inspectionData.title}
              description={item.inspectionData.description}
              options={item.inspectionData.options}
              onSkip={() => console.log(`Item ${item.id} skipped`)}
              onDataChange={handleItemDataChange}
              propertyId={propertyId}
            />
          );
        })}
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteInspection}
          disabled={loading}>
          <Text style={styles.completeButtonText}>Complete Inspection</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  completeButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#2563EB',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
