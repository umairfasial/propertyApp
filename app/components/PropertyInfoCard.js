import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const PropertyInfoCard = ({
  title,
  spec,
  date,
  propertyType,
  currency,
  income,
  icon1: Icon1,
  icon2: Icon2,
  icon1Color,
  icon1Background,
  icon2Background,
  icon2Color,
  iconRow,
  onEditClick,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onEditClick}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.spec}>{propertyType}</Text>
        <Text style={styles.date}>
          {currency}
          {income} /month
        </Text>
      </View>
      <View style={iconRow ? styles.iconsRow : styles.iconsColumn}>
        <View
          style={[styles.iconContainer, {backgroundColor: icon1Background}]}>
          <Icon1 width={15} height={15} color={icon1Color} />
        </View>

        <View
          style={[styles.iconContainer, {backgroundColor: icon2Background}]}>
          <Icon2 width={15} height={15} color={icon2Color} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyInfoCard;

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
  iconContainer: {
    borderRadius: 50,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: 12,
  },
});
