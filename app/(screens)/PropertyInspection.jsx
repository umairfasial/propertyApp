import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchInspectionsByUserIdSlice,
  fetchTemplateByTemplateIdSlice,
} from '../redux/slices/inspection/inspectionSlice';
import StatusCard from '../components/StatusCard';
import ClockIcon from '../assets/icons/clockOutlined.svg';
import TempleteIcon from '../assets/icons/template.svg';
import ReportIcon from '../assets/icons/report.svg';
import ScheduleIcon from '../assets/icons/schedule.svg';
import IconButton from '../components/ui/IconButton';
import InspectionRequestCard from '../components/InspectionRequestCard';
import ScheduleCard from '../components/ScheduleCard';
import {fetchPropertiesByPropertiesIdSlice} from '../redux/slices/property/propertySlice';

export default function PropertyInspection({navigation}) {
  const {userInspections, selectedTemplate} = useSelector(
    state => state.inspection,
  );
  const {selectedProperty} = useSelector(state => state.property);
  const {userData} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData?.uid) {
      dispatch(fetchInspectionsByUserIdSlice(userData.uid));
    }
  }, [userData?.uid]);

  useEffect(() => {
    if (userInspections && Array.isArray(userInspections)) {
      let properties = [];
      userInspections.forEach(inspection => {
        console.log('inspection', inspection.property);
        properties.push(inspection.property);
      });
      dispatch(fetchPropertiesByPropertiesIdSlice({properties}));
    }
  }, [userInspections]);

  useEffect(() => {
    if (userInspections && Array.isArray(userInspections)) {
      let templates = [];
      userInspections.forEach(inspection => {
        console.log('inspection', inspection.template);
        templates.push(inspection.template);
      });
      dispatch(fetchTemplateByTemplateIdSlice(templates));
    }
  }, [userInspections]);

  const handleAcceptInspection = () => {
    // Handle accept logic here
    console.log('Inspection accepted');
  };

  const handleDeclineInspection = () => {
    // Handle decline logic here
    console.log('Inspection declined');
  };

  console.log(
    'userInspections',
    userInspections,
    selectedProperty,
    selectedTemplate,
  );

  const handleNavigation = (inspectionId, propertyId, templateId) => {};

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.row}>
          <StatusCard
            cardColor="#DC2626"
            cardTitle="Due Inspections"
            cardNumber="24"
            icon={ClockIcon}
            iconColor="#FFFFFF"
            description="This month"
          />
          <StatusCard
            cardColor="#10B981"
            cardTitle="In Progress"
            cardNumber="28"
            icon={ClockIcon}
            iconColor="#FFFFFF"
            description="4 urgent"
          />
        </View>
        <View style={styles.row}>
          <IconButton
            icon={TempleteIcon}
            title="Templates"
            color="#6B7280"
            iconColor="#fff"
            onClick={() => navigation.navigate('InspectionTemplatesList')}
          />
          <IconButton
            icon={ReportIcon}
            title="Reports"
            color="#10B981"
            iconColor="#fff"
            onClick={() => navigation.navigate('InspectionReport')}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>New Requests</Text>
          </View>
          <IconButton
            icon={ScheduleIcon}
            title="Schedule"
            color="#2563EB"
            iconColor="#fff"
          />
        </View>
        <View style={styles.inspectionCardContainer}>
          <InspectionRequestCard
            urgencyColor="#2563EB"
            status="urgent"
            title="Urgent Inspection Required"
            address="123 Main Street, Unit 4B"
            description="Property manager requested immediate inspection due to reported water damage."
            requestTime="30m ago"
            onAccept={handleAcceptInspection}
            onDecline={handleDeclineInspection}
          />
          <InspectionRequestCard
            urgencyColor="#F59E0B"
            status="high"
            title="Urgent Inspection Required"
            address="123 Main Street, Unit 4B"
            description="Property manager requested immediate inspection due to reported water damage."
            requestTime="30m ago"
            onAccept={handleAcceptInspection}
            onDecline={handleDeclineInspection}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          {userInspections?.map(inspection => {
            return (
              <ScheduleCard
                key={inspection.id}
                address={
                  selectedProperty?.find(
                    property => property.id === inspection.property,
                  )?.address
                }
                propertyType={
                  selectedProperty?.find(
                    property => property.id === inspection.property,
                  )?.propertyType
                }
                time={inspection.date}
                status={inspection.status}
                handleNavigation={() => {
                  navigation.navigate('InsepctionChecklist', {
                    inspectionId: inspection.id,
                    propertyId: inspection.property,
                    templateId: inspection.template,
                  });
                }}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  headingContainer: {
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 10,
    minWidth: 100,
    justifyContent: 'center',
  },
  headingText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 18,
    color: '#000000',
  },
  inspectionCardContainer: {
    paddingHorizontal: 10,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    marginLeft: 16,
  },
});
