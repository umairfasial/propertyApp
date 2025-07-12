import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

const CustomDropdown = ({
  data,
  onSelect,
  value,
  defaultValue,
  error,
  placeholder = 'Select',
  height = 50,
}) => {
  const selectedValue = value ?? defaultValue ?? null;

  const handleSelect = value => {
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      <Dropdown
        style={[
          styles.dropdown,
          height ? {height: height} : null,
          error ? styles.errorBorder : null,
        ]}
        data={data}
        labelField="label"
        valueField="value"
        value={selectedValue}
        placeholder={placeholder}
        onChange={item => handleSelect(item.value)}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  container: {
    minWidth: 80,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
