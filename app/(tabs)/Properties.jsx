import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import PropertyCard from '../components/PropertyCard';
import IssuesIcon from '../assets/icons/issues.svg';
import ClockIcon from '../assets/icons/clock.svg';
import ClipboardCheck from '../assets/icons/clipboard-check.svg';
import Knowledge from '../assets/icons/knowledge.svg';
import DashboardSection from '../components/DashboardSection';
import CertificateIcon from '../assets/icons/certificate.svg';
import FormIcon from '../assets/icons/form.svg';
import MessageIcon from '../assets/icons/message.svg';
import IndentIcon from '../assets/icons/indent.svg';
import MapIcon from '../assets/icons/map.svg';
import ContractPropertyCard from '../components/ContractPropertyCard';
import {useSelector} from 'react-redux';
import PropertyMap from '../components/PropertyMapCard';
import PropertyInfoCard from '../components/PropertyInfoCard';

export default function Properties({navigation}) {
  const {properties} = useSelector(state => state.property);
  const [status, setStatus] = useState('list');
  console.log('properties in properties', properties);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.row}>
          <PropertyCard
            title="Total Properties"
            number="24"
            footerText="Properties"
            footerColor="#6B7280"
            iconColor="#2563EB"
          />
          <PropertyCard
            title="Monthly Revenue"
            number="£42,500"
            footerText="+12%"
            footerColor="#10B981"
            iconColor="#2563EB"
          />
        </View>
        <View style={styles.row}>
          <PropertyCard
            title="Properties with Issues"
            number="3"
            numberColor="#EF4444"
            icon={IssuesIcon}
            footerColor="#6B7280"
            iconColor="#DC2626"
          />
          <PropertyCard
            title="Expiring Certificates"
            number="5"
            numberColor="#F59E0B"
            icon={ClockIcon}
            footerColor="#6B7280"
            iconColor="#F59E0B"
          />
        </View>
        <View>
          <DashboardSection
            title="Quick Actions"
            iconsComponent={true}
            items={[
              {
                icon: (
                  <CertificateIcon width={18} height={18} color="#059669" />
                ),
                iconBackground: '#10B98126',
                label: 'Certificates',
                clicked: () => {
                  navigation.navigate('Certificate');
                },
              },
              {
                icon: <FormIcon width={18} height={18} color="#2563EB" />,
                iconBackground: '#2563EB24',
                label: 'Contract',
                clicked: () => {
                  navigation.navigate('Contract');
                },
              },
              {
                icon: <ClipboardCheck width={18} height={18} color="#8B5CF6" />,
                iconBackground: '#EDE9FE',
                label: 'Inspections',
                clicked: () => {
                  navigation.navigate('Inspection');
                },
              },
              {
                icon: <IssuesIcon width={18} height={18} color="#EF4444" />,
                iconBackground: '#FEE2E2',
                label: 'View Issues',
                clicked: () => {
                  navigation.navigate('KnowledgeAi');
                },
              },
            ]}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contract Reviews</Text>
          <ContractPropertyCard
            title="23 Bridge Street"
            spec="Gas Safety Certificate"
            date="24th March 2025"
            icon1={FormIcon}
            icon2={MessageIcon}
            icon1Color="#EF4444"
            icon2Color="#2563EB"
            iconRow={false}
          />
          <ContractPropertyCard
            title="45 City Road"
            spec="Apartment • 2 bed"
            date="5th June 2025"
            icon1={FormIcon}
            icon2={MessageIcon}
            icon1Color="#EF4444"
            icon2Color="#2563EB"
            iconRow={false}
          />
        </View>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>Properties</Text>
            <View style={styles.iconRow}>
              <View style={status === 'list' && styles.iconContainer}>
                <TouchableOpacity onPress={() => setStatus('list')}>
                  <IndentIcon width={20} height={20} color="#4B5563" />
                </TouchableOpacity>
              </View>
              <View style={status === 'mapView' && styles.iconContainer}>
                <TouchableOpacity onPress={() => setStatus('mapView')}>
                  <MapIcon width={20} height={20} color="#4B5563" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {status === 'list' ? (
            properties.map(property => {
              return (
                <PropertyInfoCard
                  key={property.id}
                  title={property?.propertyName}
                  propertyType={property?.propertyType}
                  currency={property?.currency}
                  income={property?.monthlyIncome}
                  icon1={IssuesIcon}
                  icon2={ClockIcon}
                  icon1Color="#EF4444"
                  icon1Background="#FEE2E2"
                  icon2Color="#F59E0B"
                  icon2Background="#FEF3C7"
                  iconRow={true}
                  onEditClick={() =>
                    navigation.navigate('PropertyOverView', {
                      propertyId: property?.id,
                    })
                  }
                />
              );
            })
          ) : (
            <PropertyMap properties={properties} navigation={navigation} />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafafa',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  card: {},
  cardTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
    marginBottom: 15,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 85,
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
});
