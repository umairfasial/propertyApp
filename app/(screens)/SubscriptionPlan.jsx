import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import SubscriptionCard from '../components/ui/SubscriptionCard';

import LandLoardIcon from '../assets/icons/properties.svg';
import ManagerIcon from '../assets/icons/manager.svg';
import PersonIcon from '../assets/icons/person.svg';

export default function SubscriptionPlan() {
  const subscriptionData = [
    {
      title: 'Landlord',
      subtitle: 'Property Owner Access',
      price: '9.99',
      features: [
        'Manage Unlimited Properties, Agents, and Tenants',
        'Manage Reviews, Issues, Inspections, and Maintenance',
        'Communication Tools',
      ],
      buttonText: 'Select Plan',
      buttonStyle: {backgroundColor: '#007AFF'},
      icon: LandLoardIcon,
    },
    {
      title: 'Property Manager',
      subtitle: 'Professional Access',
      price: '9.99',
      features: [
        'Manage Unlimited Properties and Tenants',
        'Manage Reviews, Issues, Inspections and Maintenance',
        'Communication Tools',
      ],
      buttonText: 'Select Plan',
      buttonStyle: {backgroundColor: '#6C5CE7'},
      icon: ManagerIcon,
    },
    {
      title: 'Tenant',
      subtitle: 'Basic Access',
      price: '0',
      features: [
        'View Property and Contract Details',
        'Report and Manage Issues',
        'Inspections and Maintenance',
        'Communication Tools',
      ],
      buttonText: 'Get Started Free',
      buttonStyle: {backgroundColor: '#00B894'},
      icon: PersonIcon,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Select the perfect plan for your property management needs
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {subscriptionData.map((plan, index) => (
          <SubscriptionCard key={index} {...plan} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  cardsContainer: {
    padding: 16,
  },
});
