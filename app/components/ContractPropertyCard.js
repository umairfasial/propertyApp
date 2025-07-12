import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ContractPropertyCard = ({
  title,
  spec,
  date,
  icon1: Icon1,
  icon2: Icon2,
  icon1Color,
  icon2Color,
  onEditClick,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.spec}>{spec}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.iconsColumn}>
        <TouchableOpacity onPress={onEditClick}>
          <Icon1 width={20} height={20} color={icon1Color} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon2 width={20} height={20} color={icon2Color} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContractPropertyCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
    lineHeight: 16,
    fontFamily: 'Inter',
  },
  spec: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
    fontFamily: 'Inter',
    lineHeight: 14,
  },
  date: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Inter',
    lineHeight: 18,
  },
  iconsColumn: {
    justifyContent: 'space-between',
    height: 86,
    marginLeft: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
    height: 86,
  },
  iconSpacing: {
    marginLeft: 12,
  },
  iconContainer: {
    width: 33,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 5,
  },
});
