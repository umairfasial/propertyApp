import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import ChatMessage from '../components/ui/ChatMessage';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef(null);
  const currentUser = 'Sarah'; // This would normally come from your auth context

  const messages = [
    {
      id: '1',
      message:
        'We have a water leak in the upstairs bathroom and it is coming through the ceiling downstairs. It has create damp',
      time: 'Opened 2h ago • 22h remaining',
      isHeader: true,
      status: 'Critical',
    },
    {
      id: '2',
      sender: 'John Smith',
      message: 'Hey @Sarah, could you check the latest inspection report?',
      time: '9:30 AM',
    },
    {
      id: '3',
      sender: 'Sarah',
      message: "Sure, I'll take a look right away!",
      time: '9:32 AM',
    },
    {
      id: '4',
      sender: 'Mike Johnson',
      message:
        '@team Important update: Fire safety inspection scheduled for tomorrow at 10 A.M.',
      time: '9:45 AM',
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage('');
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  // Scroll to bottom when keyboard appears
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      scrollToBottom,
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <View style={styles.innerContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={scrollToBottom}
            keyboardShouldPersistTaps="handled">
            {messages.map(msg => {
              if (msg.isHeader) {
                return (
                  <View key={msg.id} style={styles.headerMessage}>
                    <View style={styles.headerContent}>
                      <Text style={styles.headerText}>{msg.message}</Text>
                      <View style={styles.timeContainer}>
                        <View style={styles.timeIcon} />
                        <Text style={styles.timeText}>{msg.time}</Text>
                      </View>
                    </View>
                    <View style={styles.statusContainer}>
                      <Text style={styles.statusText}>{msg.status}</Text>
                    </View>
                  </View>
                );
              }
              return (
                <ChatMessage
                  key={msg.id}
                  message={msg.message}
                  time={msg.time}
                  sender={msg.sender}
                  isOwnMessage={msg.sender === currentUser}
                />
              );
            })}
          </ScrollView>

          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <View style={styles.attachIcon} />
              <TextInput
                style={styles.input}
                placeholder="Type @ to mention someone..."
                placeholderTextColor="#9CA3AF"
                value={message}
                onChangeText={setMessage}
                multiline
                maxHeight={100}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  message.trim() ? styles.sendButtonActive : null,
                ]}
                onPress={handleSend}>
                <View
                  style={[
                    styles.sendIcon,
                    message.trim() ? styles.sendIconActive : null,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  headerMessage: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    marginBottom: 12,
  },
  headerText: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  attachIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    maxHeight: 100,
    padding: 0,
    textAlignVertical: 'center',
  },
  sendButton: {
    marginLeft: 8,
    padding: 4,
  },
  sendButtonActive: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
  },
  sendIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  sendIconActive: {
    backgroundColor: '#FFFFFF',
  },
});
