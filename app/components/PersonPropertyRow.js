import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MessageIcon from '../assets/icons/message.svg';
import React from 'react';

const PersonPropertyRow = ({
  heading,
  name,
  role,
  showAssignButton,
  avatarUri,
  onClick,
  onChangeClick,
}) => (
  <View>
    <Text style={styles.heading}>{heading}</Text>
    <View style={styles.personRow}>
      {avatarUri ? (
        <Image source={{uri: avatarUri}} style={styles.avatar} />
      ) : (
        <View style={styles.avatar} />
      )}
      <View style={{flex: 1}}>
        <Text style={styles.personName}>{name}</Text>
        <Text style={styles.personRole}>{role}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.changeButton} onPress={onChangeClick}>
          <Text style={styles.changeButtonText}>Change</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton}>
          <MessageIcon style={styles.chatIconPlaceholder} />
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  heading: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#6B7280',
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
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Inter',
  },
  personRole: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#6B7280',
  },
  buttonContainer: {
    padding: 5,
    gap: 5,
    alignItems: 'flex-end',
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
    width: 80,
    height: 56,
    justifyContent: 'center',
  },
  chatIconPlaceholder: {
    width: 20,
    height: 20,
    color: '#2563EB',
  },
  chatButtonText: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#4B5563',
    fontWeight: '500',
  },
});

export default PersonPropertyRow;
