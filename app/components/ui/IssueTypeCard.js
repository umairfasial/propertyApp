import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const IssueTypeCard = ({title, subtitle, onPress, isSelected, icon}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selected]}
      onPress={onPress}>
      {icon}
      {!icon && <View style={styles.iconContainer} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },

  textContainer: {
    gap: 4,
    marginTop: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default IssueTypeCard;
