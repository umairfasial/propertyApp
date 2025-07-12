import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import InspectionItemComponent from '../components/InspectionItemComponent';
import RatingIcon from '../assets/icons/starIcon.svg';
import PhotoIcon from '../assets/icons/camera.svg';
import NoteIcon from '../assets/icons/noteIcon.svg';
import VideoIcon from '../assets/icons/videoCamera.svg';
import ReportIcon from '../assets/icons/issues.svg';
import {useDispatch, useSelector} from 'react-redux';
import {
  addInspectionItemSlice,
  fetchInspectionItems,
} from '../redux/slices/inspection/inspectionSlice';

const filters = ['Exterior', 'Interior', 'Systems', 'Safety'];

const toggleOptions = [
  {label: 'Rating', icon: RatingIcon},
  {label: 'Add Photo', icon: PhotoIcon},
  {label: 'Add Note', icon: NoteIcon},
  {label: 'Record', icon: VideoIcon},
  {label: 'Report Issue', isWarning: true, icon: ReportIcon},
];

export default function NewInspectionData({navigation}) {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.inspection);
  const [selectedFilter, setSelectedFilter] = useState('All Items');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [switchStates, setSwitchStates] = useState(
    toggleOptions.reduce((acc, item) => {
      acc[item.label] = false;
      return acc;
    }, {}),
  );

  const toggleSwitch = label => {
    setSwitchStates(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleSubmit = () => {
    const inspectionData = {
      type: selectedFilter,
      title,
      description,
      options: switchStates,
    };

    dispatch(addInspectionItemSlice({inspectionData})).then(() => {
      navigation.goBack();
      dispatch(fetchInspectionItems());
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={{padding: 16, paddingBottom: 100}}>
        <Text style={styles.heading}>Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.selectedFilter,
              ]}
              onPress={() => setSelectedFilter(filter)}>
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.selectedFilterText,
                ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Title Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Inspection item title"
          placeholderTextColor="#ADAEBC"
          value={title}
          onChangeText={setTitle}
        />

        {/* Description Input */}
        <TextInput
          style={[styles.textInput, {height: 80, textAlignVertical: 'top'}]}
          placeholder="Inspection item description."
          placeholderTextColor="#ADAEBC"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Switches Section */}
        <View style={styles.switchContainer}>
          {toggleOptions.map(option => (
            <View key={option.label} style={styles.switchRow}>
              <InspectionItemComponent
                title={option.label}
                icon={option.icon}
                isWarning={option.isWarning}
              />

              <Switch
                value={switchStates[option.label]}
                onValueChange={() => toggleSwitch(option.label)}
                thumbColor="#f4f3f4"
                trackColor={{false: '#BEBEBE', true: '#007bff'}}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>+ Add Inspection Item</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
    marginBottom: 10,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedFilter: {
    backgroundColor: '#E0ECFF',
    borderColor: '#2563EB',
  },
  filterText: {
    color: '#333',
  },
  selectedFilterText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  switchContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#D1D5DB',
    borderRadius: 6,
    marginRight: 12,
  },
  warningIcon: {
    backgroundColor: '#FCA5A5',
  },
  labelText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  warningLabel: {
    color: '#DC2626',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  addButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
