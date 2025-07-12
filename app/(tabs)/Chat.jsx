import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PropertiesIcon from '../assets/icons/properties.svg';
import InspectionIcon from '../assets/icons/inspections.svg';
import ChatCard from '../components/ChatCard';

export default function Chat({navigation}) {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.chatContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.chatTitle}>Property Chats</Text>
          </View>
          <ChatCard
            icon={PropertiesIcon}
            iconColor="#2563EB"
            iconBackground="#DBEAFE"
            heading="New property registered"
            time="2m ago"
            description="123 Main Street, Suite 4B"
            onClick={() => navigation.navigate('ChatPage')}
          />
          <ChatCard
            icon={PropertiesIcon}
            iconColor="#2563EB"
            iconBackground="#DBEAFE"
            heading="New property registered"
            time="2m ago"
            description="123 Main Street, Suite 4B"
          />
        </View>

        <View style={styles.chatContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.chatTitle}>Inspection Chats</Text>
          </View>
          <ChatCard
            icon={InspectionIcon}
            iconColor="#7C3AED"
            iconBackground="#EDE9FE"
            heading="New property registered"
            time="2m ago"
            description="123 Main Street, Suite 4B"
          />
          <ChatCard
            icon={InspectionIcon}
            iconColor="#7C3AED"
            iconBackground="#EDE9FE"
            heading="New property registered"
            time="2m ago"
            description="123 Main Street, Suite 4B"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  chatContainer: {
    paddingVertical: 15,
    backgroundColor: '#ffff',
    borderRadius: 10,
    marginBottom: 15,
  },
  headerContainer: {
    borderBottomWidth: 2,
    borderColor: '#F3F4F6',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  chatTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    lineHeight: 18,
    fontWeight: 700,
  },
});
