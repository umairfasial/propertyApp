import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function InspectionItemComponent({
  title,
  icon: Icon,
  isWarning,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, isWarning && {backgroundColor: '#FEF2F2'}]}>
      {Icon ? (
        <Icon style={styles.iconPlaceholder} />
      ) : (
        <View style={styles.iconPlaceholder} />
      )}

      <Text style={[styles.buttonText, isWarning && {color: '#DC2626'}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  iconPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  buttonText: {
    fontSize: 13,
  },
});
