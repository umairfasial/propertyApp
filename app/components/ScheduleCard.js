import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ScheduleIcon from '../assets/icons/schedule.svg';

const ScheduleCard = ({
  address,
  propertyType,
  time,
  status = 'Today',
  handleNavigation,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigation}>
      <View style={styles.contentContainer}>
        <View style={styles.mainContent}>
          <Text style={styles.address}>{address}</Text>
          <Text style={styles.propertyType}>{propertyType}</Text>
          <View style={styles.timeContainer}>
            <ScheduleIcon width={15} height={15} color="#000000" />

            <Text style={styles.time}>{time}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contentContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainContent: {
    flex: 1,
  },
  address: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  propertyType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
  },
  time: {
    marginLeft: 5,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  statusContainer: {
    marginLeft: 12,
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ScheduleCard;
