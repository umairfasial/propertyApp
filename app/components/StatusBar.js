// components/SLAStatusBar.js

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SLAStatusBar = ({label, color, percent}) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barContainer}>
        <View
          style={[styles.bar, {width: `${percent}%`, backgroundColor: color}]}
        />
        <View style={[styles.barBackground]} />
      </View>
      <Text style={styles.percent}>{percent}%</Text>
    </View>
  );
};

export default SLAStatusBar;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    width: '50%',
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#4B5563',
  },
  barContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    marginRight: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 5,
  },
  barBackground: {
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  percent: {
    width: 40,
    textAlign: 'right',
    fontSize: 13,
    color: '#374151',
  },
});
