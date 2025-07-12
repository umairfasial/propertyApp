// components/StatusCard.js

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function StatusCard({
  cardColor,
  cardTitle,
  cardNumber,
  icon: Icon,
  iconColor,
  description,
}) {
  return (
    <View
      style={[styles.card, {backgroundColor: cardColor ? cardColor : '#fff'}]}>
      <View style={styles.iconTitleContainer}>
        <Text style={styles.title}>{cardTitle}</Text>
        {Icon && <Icon width={15} height={15} color={iconColor} />}
      </View>
      <Text style={styles.number}>{cardNumber}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minWidth: 100,
    minHeight: 112,
  },
  iconTitleContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 10,
  },
});
