import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect} from 'react';
import InspectionTemplateCard from '../components/ui/InspectionTemplateCard';
import {
  fetchInspectionTemplatesSlice,
  fetchInspectionsByUserIdSlice,
} from '../redux/slices/inspection/inspectionSlice';
import {useDispatch, useSelector} from 'react-redux';

export default function Inspection() {
  const {inspectionTemplates, userInspections, fetchInspectionsLoading} =
    useSelector(state => state.inspection);
  const {userData} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInspectionTemplatesSlice());
    if (userData?.id) {
      dispatch(fetchInspectionsByUserIdSlice(userData.id));
    }
  }, [userData?.id]);

  const handleTemplatePress = templateId => {
    console.log('Template pressed:', templateId);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inspection Templates</Text>
        <Text style={styles.subtitle}>
          Manage and create inspection templates
        </Text>
      </View>

      <View style={styles.content}>
        {inspectionTemplates && inspectionTemplates.length > 0 ? (
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

      <View style={styles.inspectionsSection}>
        <Text style={styles.sectionTitle}>Your Inspections</Text>
        {fetchInspectionsLoading ? (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={styles.loader}
          />
        ) : userInspections && userInspections.length > 0 ? (
          userInspections.map(inspection => (
            <View key={inspection.id} style={styles.inspectionCard}>
              <View style={styles.inspectionHeader}>
                <Text style={styles.inspectionTitle}>
                  Inspection #{inspection.id.slice(-6)}
                </Text>
                <Text style={styles.inspectionDate}>{inspection.date}</Text>
              </View>
              <View style={styles.inspectionDetails}>
                <Text style={styles.inspectionText}>
                  Property: {inspection.property}
                </Text>
                <Text style={styles.inspectionText}>
                  Template: {inspection.template}
                </Text>
                <Text style={styles.inspectionText}>
                  Inspector: {inspection.inspector}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No inspections found</Text>
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
  content: {
    padding: 16,
  },
  inspectionsSection: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  inspectionCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  inspectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inspectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  inspectionDate: {
    color: '#6B7280',
    fontSize: 14,
  },
  inspectionDetails: {
    gap: 8,
  },
  inspectionText: {
    fontSize: 14,
    color: '#374151',
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
