import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const PersonRow = ({
  heading,
  name,
  role,
  showAssignButton,
  numberManaged,
  avatarUri,
  onClick,
  onChangeClick,
}) => (
  <View style={styles.container}>
    <View style={styles.personRow}>
      {avatarUri ? (
        <Image source={{uri: avatarUri}} style={styles.avatar} />
      ) : (
        <View style={styles.avatar} />
      )}

      <View style={{flex: 1}}>
        <Text style={styles.personName}>{name}</Text>
        <Text style={styles.personRole}>
          {numberManaged} Properties {role === 'tenant' ? 'Rented' : 'Managed'}
        </Text>
      </View>

      {showAssignButton ? (
        <TouchableOpacity style={styles.buttonStyle} onPress={onClick}>
          <Text style={styles.buttonText}>Assign</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.changeButton} onPress={onChangeClick}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatButton}>
            <View style={styles.chatIconPlaceholder} />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  heading: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 5,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    marginRight: 12,
  },
  personName: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1F2937',
  },
  personRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  buttonStyle: {
    backgroundColor: '#2563EB',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
  },
  buttonContainer: {
    padding: 5,
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeButton: {
    marginRight: 8,
  },
  changeButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  chatButton: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chatIconPlaceholder: {
    width: 16,
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 6,
  },
  chatButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default PersonRow;
