import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

const IconButton = ({
  icon: Icon,
  title,
  color = '#E5E7EB',
  iconColor = '#374151',
  onClick,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: color}]}
      activeOpacity={0.8}
      onPress={onClick}>
      <View style={styles.contentContainer}>
        {Icon && <Icon style={[styles.icon, {color: iconColor}]} />}
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minWidth: 100,
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#fff',
  },
});

export default IconButton;
