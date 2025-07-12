import React from 'react';
import {View, Text} from 'react-native';

export default function PropertyCard({
  title,
  icon: Icon,
  number,
  numberColor,
  footerText,
  footerColor,
  iconColor,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.footerContainer}>
        <Text style={[styles.number, {color: numberColor}]}>{number}</Text>
        {Icon ? (
          <Icon width={20} height={20} color={iconColor} />
        ) : (
          <Text style={[styles.footer, {color: footerColor}]}>
            {footerText}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  number: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  footer: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 5,
  },
};
