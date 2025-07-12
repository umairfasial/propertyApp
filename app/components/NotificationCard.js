import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function NotificationCard({
  icon: Icon,
  title,
  description,
  time,
  actionText,
  read = true,
  iconBackground = '#E6F0FF',
  actionTextColor = '#2563EB',
}) {
  return (
    <View style={[styles.card, !read && styles.unreadCard]}>
      <View style={styles.row}>
        <View style={[styles.iconWrapper, {backgroundColor: iconBackground}]}>
          <Icon width={20} height={20} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.timeDotContainer}>
              <Text style={styles.time}>{time}</Text>
              {!read && <View style={styles.dot} />}
            </View>
          </View>
          <Text style={styles.description}>{description}</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={[styles.actionText, {color: actionTextColor}]}>
              {actionText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    paddingVertical: 25,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  unreadCard: {
    backgroundColor: '#F5FAFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    backgroundColor: '#E6F0FF',
    padding: 10,
    borderRadius: 100,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16,
    fontFamily: 'Inter',
    color: '#111827',
    flex: 1,
  },
  timeDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 6,
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 14,
    fontFamily: 'Inter',
    color: '#6B7280',
    paddingVertical: 10,
  },
  actionText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
    fontFamily: 'Inter',
    color: '#2563EB',
    fontWeight: '500',
  },
});
