import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Picker,
} from 'react-native';
import MessageIcon from '../assets/icons/message.svg';
import ClockOutlined from '../assets/icons/clockOutlined.svg';
import CustomDropdown from './ui/Dropdown';
import {IssueStatus, priorityColors} from '../contants/Constants';

const IssueCard = ({
  icon,
  iconTitle,
  title,
  priority,
  openSince,
  assignee,
  status,
  onStatusChange,
  priorityTextColor,
}) => {
  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          {icon}
          <Text style={styles.iconTitle}>{iconTitle}</Text>
        </View>
        <View
          style={[styles.priorityBadge, {backgroundColor: priorityTextColor}]}>
          <Text style={[styles.priorityText]}>{priority}</Text>
        </View>
      </View>

      {/* Title + Chat */}
      <View style={[styles.rowBetween, {marginTop: 10}]}>
        <Text style={styles.issueTitle}>{title}</Text>
        <TouchableOpacity style={styles.chatButton}>
          <MessageIcon width={20} height={20} color="#2563eb" />
          <Text style={styles.chatText}>Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Time Info */}
      <View style={[styles.row, {marginBottom: 10}]}>
        <ClockOutlined width={20} height={20} color="#6b7280" />
        <Text style={styles.timeText}>Opened {openSince}</Text>
        <Text style={styles.dot}>•</Text>
      </View>

      {/* Assignee and Status */}
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Image
            source={{uri: 'https://randomuser.me/api/portraits/men/32.jpg'}} // can be passed in future
            style={styles.avatar}
          />
          <Text style={styles.assignee}>{assignee}</Text>
        </View>

        <View style={styles.statusPickerContainer}>
          <CustomDropdown
            data={IssueStatus}
            defaultValue={status}
            onSelect={onStatusChange}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconTitle: {
    marginLeft: 8,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16,
    fontFamily: 'Inter',
    color: '#000000',
  },
  priorityBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#fff',
  },
  issueTitle: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16,
    fontFamily: 'Inter',
    color: '#000000',
  },
  chatButton: {
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  chatText: {
    marginLeft: 4,
    color: '#4B5563',
    fontSize: 13,
  },
  timeText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#4B5563',
  },
  dot: {
    marginHorizontal: 6,
    fontSize: 12,
    color: '#9ca3af',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  assignee: {
    fontSize: 14,
    color: '##4B5563',
    fontFamily: 'Inter',
    width: '60%',
  },
  statusPickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    width: 100,
  },
  picker: {
    height: 32,
    width: '100%',
  },
});

export default IssueCard;
