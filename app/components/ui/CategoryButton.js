import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const CategoryButton = ({title, icon}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.iconContainer} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 100,
    height: 100,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default CategoryButton;
