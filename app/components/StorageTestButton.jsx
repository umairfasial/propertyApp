import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { runStorageTests } from '../../testUpload';

const StorageTestButton = () => {
  const handleTestUpload = async () => {
    try {
      console.log('🧪 Starting Storage Tests...');
      Alert.alert('Testing', 'Running Firebase Storage tests with SDK v22.4.0... Check console for results.');
      
      await runStorageTests();
      
      Alert.alert('Tests Complete', 'Check the console/debugger for detailed test results.');
    } catch (error) {
      console.error('Test execution failed:', error);
      Alert.alert('Test Failed', `Error: ${error.message}`);
    }
  };

  return (
    <TouchableOpacity style={styles.testButton} onPress={handleTestUpload}>
      <Text style={styles.testButtonText}>🧪 Test Firebase Storage v22.4.0</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  testButton: {
    backgroundColor: '#DC2626',
    padding: 14,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B91C1C',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default StorageTestButton; 