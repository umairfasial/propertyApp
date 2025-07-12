import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {priorityColors} from '../contants/Constants';
import ClockIcon from '../assets/icons/clockOutlined.svg';

const InspectionRequestCard = ({
  urgencyColor = '#DC2626',
  status = 'urgent',
  title = 'Urgent Inspection Required',
  address,
  description,
  requestTime,
  onAccept,
  onDecline,
}) => {
  return (
    <View style={[styles.container, {borderLeftColor: urgencyColor}]}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.address}>{address}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: priorityColors[status].backgroundColor},
            ]}>
            <Text
              style={[
                styles.statusText,
                {color: priorityColors[status].textColor},
              ]}>
              {status}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <ClockIcon width={15} height={15} color="#000000" />
            <Text style={styles.timeText}>Requested {requestTime}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
    borderLeftWidth: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  declineButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  acceptButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
  },
  declineText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default InspectionRequestCard;
