import React from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import ComplianceIcon from '../assets/icons/compliance.svg';
import Plus from '../assets/icons/plus.svg';
import ClipboardCheck from '../assets/icons/clipboard-check.svg';
import Knowledge from '../assets/icons/knowledge.svg';
import NotificationCard from '../components/NotificationCard';
import IssueIcon from '../assets/icons/issues.svg';

export default function Notification() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Today</Text>

        <NotificationCard
          icon={ComplianceIcon}
          iconBackground="#DBEAFE"
          title="New Tenant Issue"
          description="Unit 4B tenant reported a leaking faucet in the kitchen."
          time="2h ago"
          actionText="View Issue"
          read={false}
          actionTextColor="#2563EB"
        />

        <NotificationCard
          icon={Plus}
          title="Inspection Due"
          description="Annual inspection for Property 123 Main St is due next week."
          time="5h ago"
          actionText="Schedule Now"
          read={true}
          iconBackground="#EDE9FE"
          actionTextColor="#7C3AED"
        />

        <Text style={styles.sectionTitle}>Yesterday</Text>

        <NotificationCard
          icon={Knowledge}
          title="Missed Chat"
          description="You have 3 unread messages from John Smith."
          time="1d ago"
          actionText="Open Chat"
          read={true}
          iconBackground="#FFEDD5"
          actionTextColor="#EA580C"
        />

        <NotificationCard
          icon={ClipboardCheck}
          title="Contract Review"
          description="New lease agreement ready for your review."
          time="1d ago"
          actionText="Review Contract"
          read={true}
          iconBackground="#D1FAE5"
          actionTextColor="#059669"
        />

        <Text style={styles.sectionTitle}>Earlier</Text>
        <NotificationCard
          icon={IssueIcon}
          title="Maintenance Alerts"
          description="Scheduled maintence for Building."
          time="3d ago"
          actionText="View Report"
          read={true}
          iconBackground="#FEE2E2"
          actionTextColor="#DC2626"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingBottom: 50,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 16,
    fontWeight: '700',
    fontSize: 16,
    color: '#6B7280',
  },
});
