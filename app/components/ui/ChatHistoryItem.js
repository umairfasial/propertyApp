import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

export default function ChatHistoryItem({
  name,
  message,
  time,
  location,
  type,
  onPress,
  isToday,
}) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar} />
        {type === 'critical' && <View style={styles.criticalIndicator} />}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {message}
        </Text>
        {location && (
          <View style={styles.locationContainer}>
            <View style={styles.locationIcon} />
            <Text style={styles.location}>{location}</Text>
          </View>
        )}
        {type === 'inspection' && (
          <View style={styles.tagContainer}>
            <View style={styles.inspectionIcon} />
            <Text style={styles.tagText}>Inspection</Text>
          </View>
        )}
        {type === 'critical' && (
          <View style={[styles.tagContainer, styles.criticalTag]}>
            <Text style={styles.criticalText}>Critical Issue</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  criticalIndicator: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#DC2626',
    borderWidth: 2,
    borderColor: 'white',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  time: {
    fontSize: 14,
    color: '#6B7280',
  },
  message: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginRight: 6,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  inspectionIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#374151',
  },
  criticalTag: {
    backgroundColor: '#FEE2E2',
  },
  criticalText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
});
