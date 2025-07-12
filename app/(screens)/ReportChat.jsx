import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';

export default function ReportChat() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    'Harassment',
    'Spam',
    'Hate Speech',
    'Inappropriate Content',
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <View style={styles.avatar} />
            <View style={styles.userTextInfo}>
              <Text style={styles.userName}>John Smith</Text>
              <Text style={styles.userTime}>Today at 2:30 PM</Text>
            </View>
          </View>
          <Text style={styles.originalMessage}>
            Original message content here
          </Text>
        </View>

        {/* Category Selection */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Select category of abuse</Text>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected,
                index === categories.length - 1 && styles.lastCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected,
                ]}>
                {category}
              </Text>
              {selectedCategory === category && (
                <View style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Description Input */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Describe the issue</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Please provide additional details about the issue"
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            selectedCategory && description
              ? styles.submitButtonActive
              : styles.submitButtonDisabled,
          ]}
          disabled={!selectedCategory || !description}>
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  userSection: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  userTextInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  userTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  originalMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  categorySection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  lastCategoryButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryButtonSelected: {
    backgroundColor: '#F3F4F6',
  },
  categoryText: {
    fontSize: 16,
    color: '#111827',
  },
  categoryTextSelected: {
    color: '#2563EB',
    fontWeight: '500',
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
  },
  descriptionSection: {
    padding: 16,
  },
  descriptionInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    height: 120,
    fontSize: 14,
    color: '#111827',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonActive: {
    backgroundColor: '#DC2626',
  },
  submitButtonDisabled: {
    backgroundColor: '#eaaa9d',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
