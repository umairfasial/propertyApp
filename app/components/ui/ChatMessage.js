import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ChatMessage = ({message, time, sender, isMention, isOwnMessage}) => {
  return (
    <View
      style={[
        styles.container,
        isOwnMessage
          ? styles.ownMessageContainer
          : styles.otherMessageContainer,
      ]}>
      {!isOwnMessage && sender && (
        <View style={styles.messageHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar} />
          </View>
          <Text style={styles.senderName}>{sender}</Text>
        </View>
      )}
      {isMention && (
        <Text style={styles.mentionText}>@Sarah was mentioned</Text>
      )}
      <View
        style={[
          styles.messageBox,
          isOwnMessage ? styles.ownMessageBox : styles.otherMessageBox,
        ]}>
        <Text
          style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
          ]}>
          {message}
        </Text>
      </View>
      <Text
        style={[
          styles.messageTime,
          isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime,
        ]}>
        {time}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  senderName: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  messageBox: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
  },
  ownMessageBox: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4,
  },
  otherMessageBox: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 2,
  },
  ownMessageTime: {
    color: '#6B7280',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#6B7280',
    textAlign: 'left',
  },
  mentionText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
});

export default ChatMessage;
