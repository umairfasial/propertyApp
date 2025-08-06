import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import InspectionItemCard from '../components/InspectionItemCard';
import PlusIcon from '../assets/icons/plus.svg';
import {useDispatch, useSelector} from 'react-redux';
import {
  addInspectionTemplateSlice,
  fetchInspectionItems,
} from '../redux/slices/inspection/inspectionSlice';

export default function AddInspectionTemplate({navigation, route}) {
  const {inspectionItems, templateLoading} = useSelector(
    state => state.inspection,
  );
  const [selectedInspectionItem, setSelectedInspectionItem] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const dispatch = useDispatch();
  const {selectedItems} = route.params || {};

  useEffect(() => {
    if (selectedItems && inspectionItems.length > 0) {
      const newFilteredItems = inspectionItems.filter(item =>
        selectedItems.includes(item.id),
      );

      setSelectedInspectionItem(prevItems => {
        const existingIds = new Set(prevItems?.map(i => i.id) || []);
        const newUniqueItems = newFilteredItems.filter(
          item => !existingIds.has(item.id),
        );
        return [...(prevItems || []), ...newUniqueItems];
      });
    }
  }, [selectedItems, inspectionItems]);

  const handleSubmit = () => {
    if (!selectedInspectionItem || selectedInspectionItem.length === 0) {
      alert('Please select at least one inspection item.');
      return;
    }
    if (!templateName.trim()) {
      alert('Please Enter the template name.');
      return;
    }

    const inspectionTemplate = {
      name: templateName,
      description: templateDescription,
      inspectionItems: selectedInspectionItem.map(item => item.id),
    };
    dispatch(addInspectionTemplateSlice({inspectionTemplate}))
      .then(() => {
        navigation.goBack();
      })
      .catch(error => {
        console.error('Error saving inspection template:', error);
        alert('Failed to save inspection template. Please try again.');
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput
            placeholder="Inspection template name"
            placeholderTextColor="#ADAEBC"
            style={styles.input}
            onChangeText={text => setTemplateName(text)}
            value={templateName}
          />
          <TextInput
            placeholder="Inspection template description."
            style={[styles.input, styles.textArea]}
            multiline
            placeholderTextColor="#ADAEBC"
            numberOfLines={4}
            onChangeText={text => setTemplateDescription(text)}
            value={templateDescription}
          />

          <View style={styles.headerRow}>
            <Text style={styles.heading}>Inspection Items</Text>
            <TouchableOpacity
              onPress={() => {
                if (
                  selectedInspectionItem &&
                  selectedInspectionItem.length > 0
                ) {
                  navigation.navigate('AddInspectionItem', {
                    alreadySelected: selectedInspectionItem.map(
                      item => item.id,
                    ),
                  });
                } else {
                  navigation.navigate('AddInspectionItem');
                }
              }}>
              <PlusIcon style={styles.placeholderIcon} />
            </TouchableOpacity>
          </View>

          
          {selectedInspectionItem && selectedInspectionItem.length > 0 ? (
            selectedInspectionItem.map((item, index) => {
              const options = item.inspectionData?.options || {};
              const fields = Object.entries(options).map(([label, value]) => ({
                label,
                value,
              }));

              return (
                <View style={{marginBottom: 16}} key={item.id || index}>
                  <InspectionItemCard
                    title={item.inspectionData?.title || ''}
                    description={item.inspectionData?.description || ''}
                    fields={fields}
                  />
                </View>
              );
            })
          ) : (
            <Text style={{textAlign: 'center', color: 'gray', marginTop: 20}}>
              No item selected yet.
            </Text>
          )}
        </ScrollView>

        {/* Fixed Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          {templateLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveText}>+ Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeholderIcon: {
    width: 24,
    height: 24,
    color: '#2563EB',
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: '#2979FF',
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 16,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
