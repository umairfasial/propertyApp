import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import StatusCard from '../components/StatusCard';
import StatusBar from '../components/StatusBar';
import FilterIcon from '../assets/icons/filter.svg';
import SortIcon from '../assets/icons/sort.svg';
import TemperatureScale from '../assets/icons/temperatureScale.svg';
import TapIocn from '../assets/icons/tapIcon.svg';
import SLAStatusBar from '../components/StatusBar';
import IssueCard from '../components/IssueCard';
import {useSelector} from 'react-redux';
import {issueTypes, priorities} from '../contants/Constants';

export default function Inspections() {
  const {issues} = useSelector(state => state.issue);

  return (
    <ScrollView>
      <View style={styles.row}>
        <StatusCard
          cardColor="#DC2626"
          cardTitle="Open Issues"
          cardNumber="24"
        />
        <StatusCard
          cardColor="#F59E0B"
          cardTitle="In Progress"
          cardNumber="12"
        />
        <StatusCard cardColor="#10B981" cardTitle="Resolved" cardNumber="156" />
      </View>
      <View style={styles.StatusContainer}>
        <Text style={styles.StatusHeader}>SLA Status</Text>
        <SLAStatusBar label="Critical (24h)" color="#EF4444" percent={92} />
        <SLAStatusBar label="High (48h)" color="#F59E0B" percent={88} />
        <SLAStatusBar label="Medium (7d)" color="#FCD34D" percent={95} />
      </View>
      <View style={[styles.row, {paddingHorizontal: 15}]}>
        <Text style={styles.cardTitle}>Active Issues</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconContainer}>
            <FilterIcon width={20} height={20} color="#4B5563" />
            <Text>Filter</Text>
          </View>
          <View style={styles.iconContainer}>
            <SortIcon width={20} height={20} color="#4B5563" />
            <Text>Sort</Text>
          </View>
        </View>
      </View>
      {console.log('issues',issues)}
      {issues?.length > 0 ? (
        issues.map(issue => {
          return (
            <IssueCard
              key={issue.id}
              icon={
                issueTypes.find(issueType => issueType?.id === issue?.issueType)
                  .icon
              }
              iconTitle={
                issueTypes.find(issueType => issueType?.id === issue?.issueType)
                  .title
              }
              title={issue?.title}
              priority={
                priorities.find(priority => priority?.id === issue?.priority)
                  .title
              }
              priorityTextColor={
                priorities.find(priority => priority?.id === issue?.priority)
                  .color
              }
              openSince={issue?.reportDate}
              assignee={issue?.assignedTo[0]}
              status={issue?.status}
              onStatusChange={newStatus =>
                console.log('Status changed to:', newStatus)
              }
            />
          );
        })
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No issues yet</Text>
        </View>
      )}

      {/* <IssueCard
        icon={TapIocn}
        iconColor="#3B82F6"
        iconTitle="Plumbing"
        title="Water Leak in Kitchen"
        priority="Urgent"
        openSince="2h ago"
        remainingTime="22h"
        assignee="Property: Sunset Apartments #204"
        status="inProgress"
        onStatusChange={newStatus =>
          console.log('Status changed to:', newStatus)
        }
      /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  StatusContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 2,
  },
  StatusHeader: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '700',
    marginBottom: 10,
    fontFamily: 'Inter',
  },
  cardTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
    marginBottom: 15,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 100,
    marginRight: 50,
  },
  iconContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    gap: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
});
