import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const InputField = ({
  label,
  icon: IconComponent,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  containerStyle,
  labelStyle,
  inputContainerStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
}) => {
  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <View style={inputContainerStyle}>
        {IconComponent && <IconComponent width={16} height={16} />}
        <TextInput
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor="#ADAEBC"
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={value}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
        />
      </View>
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};

export default InputField;
