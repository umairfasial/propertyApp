import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import InspectionTemplateCard from '../components/ui/InspectionTemplateCard';
import {fetchInspectionTemplatesSlice} from '../redux/slices/inspection/inspectionSlice';

export default function InspectionTemplatesList({navigation}) {
  const {inspectionTemplates, templateLoading} = useSelector(
    state => state.inspection,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInspectionTemplatesSlice());
  }, []);

  const handleTemplatePress = templateId => {
    // TODO: Navigate to template details or edit page if needed
    // navigation.navigate('InspectionTemplateDetails', { templateId });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inspection Templates</Text>
        <Text style={styles.subtitle}>
          Manage and create inspection templates
        </Text>
        {/* <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddInspectionTemplate')}>
          <Text style={styles.addButtonText}>+ New Template</Text>
        </TouchableOpacity> */}
      </View>
      <View style={styles.content}>
        {templateLoading ? (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={styles.loader}
          />
        ) : inspectionTemplates && inspectionTemplates.length > 0 ? (
          inspectionTemplates.map(template => (
            <InspectionTemplateCard
              key={template.id}
              title={template.name}
              subtitle={template.description}
              itemCount={template.inspectionItems.length}
              onPress={() => handleTemplatePress(template.id)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No templates available yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  addButton: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
});
