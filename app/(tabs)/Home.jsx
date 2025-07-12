import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import StatCard from '../components/StatCard';

// Import Icons
import PropertiesIcon from '../assets/icons/properties.svg';
import InspectionsIcon from '../assets/icons/inspections.svg';
import IssuesIcon from '../assets/icons/issues.svg';
import ComplianceIcon from '../assets/icons/compliance.svg';
import Plus from '../assets/icons/plus.svg';
import DashboardSection from '../components/DashboardSection';
import ClipboardCheck from '../assets/icons/clipboard-check.svg';
import Knowledge from '../assets/icons/knowledge.svg';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUserSlice} from '../redux/slices/auth/authSlice';

export default function Home({navigation}) {
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.auth);

  const handleLogOut = () => {
    dispatch(logoutUserSlice({uid: userData.uid})).then(() => {
      // navigation.navigate('Login');
    });
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.row}>
          <StatCard
            title="Properties"
            icon={PropertiesIcon}
            number="247"
            footerText="+12% this month"
            footerColor="#10B981"
            iconColor="#2563EB"
          />
          <StatCard
            title="Inspections"
            icon={InspectionsIcon}
            number="32"
            footerText="+5% this month"
            footerColor="#10B981"
            iconColor="#7C3AED"
          />
        </View>
        <View style={styles.row}>
          <StatCard
            title="Issues"
            icon={IssuesIcon}
            number="18"
            footerText="4 urgent"
            footerColor="#EF4444"
            iconColor="#DC2626"
          />
          <StatCard
            title="Compliance"
            icon={ComplianceIcon}
            number="92%"
            footerText="+2% this month"
            footerColor="#10B981"
            iconColor="#059669"
          />
        </View>
        <View style={styles.card}>
          <View>
            <Text style={styles.label}>Subscription</Text>
            <Text style={styles.plan}>Free</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SubscriptionPlan')}>
            <Plus width={14} height={16} color="#fff" />
            <Text style={styles.buttonText}>Upgrade</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dashboardSectionStyle}>
          <DashboardSection
            title="Quick Actions"
            iconsComponent={true}
            items={[
              {
                icon: <Plus width={18} height={18} color="#3B82F6" />,
                iconBackground: '#DBEAFE',
                label: 'Add Property',
                clicked: () => navigation.navigate('PropertyForm'),
              },
              {
                icon: <ClipboardCheck width={18} height={18} color="#8B5CF6" />,
                iconBackground: '#EDE9FE',
                label: 'Inspect',
                clicked: () => navigation.navigate('ScheduleInspection'),
              },
              {
                icon: <IssuesIcon width={18} height={18} color="#EF4444" />,
                iconBackground: '#FEE2E2',
                label: 'Report Issue',
                clicked: () => navigation.navigate('ReportIssue'),
              },
              {
                icon: <Knowledge width={18} height={18} color="#DC2626" />,
                iconBackground: '#FFEDD5',
                label: 'Knowledge',
                clicked: () => navigation.navigate('KnowledgeAi'),
              },
            ]}
          />
        </View>
        <View style={styles.dashboardSectionStyle}>
          <DashboardSection
            title="Property Activity"
            iconsComponent={false}
            items={[
              {
                icon: <PropertiesIcon width={12} height={16} color="#3B82F6" />,
                iconBackground: '#DBEAFE',
                title: 'New property registered',
                subtitle: '123 Main Street, Suite 4B',
                time: '2m ago',
              },
            ]}
          />
        </View>
        <View style={styles.dashboardSectionStyle}>
          <DashboardSection
            title="Inspection Activity"
            iconsComponent={false}
            items={[
              {
                icon: (
                  <InspectionsIcon width={12} height={16} color="#8B5CF6" />
                ),
                iconBackground: '#EDE9FE',
                title: 'Inspection scheduled',
                subtitle: '456 Park Avenue - Annual Check',
                time: '1h ago',
              },
            ]}
          />
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleLogOut}>
          <Text style={styles.verifyButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'Inter',
    lineHeight: 18,
    fontWeight: '300',
    marginBottom: 10,
  },
  plan: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter',
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 5,
    fontFamily: 'Inter',
  },
  verifyButton: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
    marginRight: 10,
  },
});
