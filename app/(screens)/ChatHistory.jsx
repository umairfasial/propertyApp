import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import ChatHistoryItem from '../components/ui/ChatHistoryItem';

export default function ChatHistory({navigation}) {
  const [selectedCategory, setSelectedCategory] = useState('All Messages');

  const categories = ['All Messages', 'Properties', 'Issues', 'Inspections'];

  const chatData = {
    today: [
      {
        id: '1',
        name: 'John Smith',
        message: 'Plumbing issue resolved',
        time: '10:30 AM',
        location: '123 Main St',
        type: 'normal',
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        message: 'Inspection scheduled for next week',
        time: '9:15 AM',
        type: 'inspection',
      },
    ],
    yesterday: [
      {
        id: '3',
        name: 'Mike Wilson',
        message: 'New issue reported: Electrical fault',
        time: 'Yesterday',
        type: 'critical',
      },
    ],
  };

  const handleChatPress = chat => {
    navigation.navigate('ChatPage', {
      title: chat.name,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatList}>
        {/* Categories Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Chat List */}

        {/* Today Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          {chatData.today.map(chat => (
            <ChatHistoryItem
              key={chat.id}
              {...chat}
              onPress={() => handleChatPress(chat)}
              isToday
            />
          ))}
        </View>

        {/* Yesterday Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yesterday</Text>
          {chatData.yesterday.map(chat => (
            <ChatHistoryItem
              key={chat.id}
              {...chat}
              onPress={() => handleChatPress(chat)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  chatList: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
