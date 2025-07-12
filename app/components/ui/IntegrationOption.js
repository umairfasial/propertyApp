import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import RightIconHead from '../../assets/icons/rightIconHead.svg';

const IntegrationOption = ({icon: IconComponent, title, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Left Icon */}
      {IconComponent && (
        <IconComponent style={styles.icon} width={20} height={20} />
      )}

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right Arrow */}
      <RightIconHead width={10} height={16} />
    </TouchableOpacity>
  );
};

export default IntegrationOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter',
    lineHeight: 16,
    color: '#000',
  },
});
