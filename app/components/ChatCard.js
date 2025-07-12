import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ChatCard = ({
  icon: Icon,
  iconColor = '#ffffff',
  iconBackground = '#3B82F6', // Tailwind's blue-500
  heading,
  time,
  description,
  onClick,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onClick}>
      <View style={[styles.iconWrapper, {backgroundColor: iconBackground}]}>
        <Icon color={iconColor} width={20} height={20} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.headingRow}>
          <Text style={styles.heading}>{heading}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  heading: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 14,
    fontFamily: 'Inter',
    color: '#1F2937',
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: 12,
    color: '#9CA3AF',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: '#6B7280',
  },
});

export default ChatCard;
