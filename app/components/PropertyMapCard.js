import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import PropertyInfoCard from './PropertyInfoCard';
import IssuesIcon from '../assets/icons/issues.svg';
import ClockIcon from '../assets/icons/clock.svg';

const PropertyMap = ({properties, navigation}) => {
  // Filter out properties with valid coordinates
  const propertyCoordinates = properties.filter(p => p.latitude && p.longitude);

  if (propertyCoordinates.length === 0) {
    return <Text>Loading map...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Map with all markers */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: propertyCoordinates[0].latitude,
            longitude: propertyCoordinates[0].longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}>
          {propertyCoordinates.map(property => (
            <Marker
              key={property.id}
              coordinate={{
                latitude: property.latitude,
                longitude: property.longitude,
              }}
              title={property.address}
            />
          ))}
        </MapView>
      </View>

      {/* Property cards below map */}
      {propertyCoordinates.map(property => (
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
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  mapContainer: {
    height: 300,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  title: {fontWeight: 'bold', fontSize: 16, fontFamily: 'Inter'},
  subtitle: {
    color: '#6B7280',
    marginBottom: 8,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {fontSize: 16, fontWeight: '700', fontFamily: 'Inter'},
  iconRow: {flexDirection: 'row', gap: 6},
  warningIcon: {
    width: 10,
    height: 10,
    backgroundColor: 'orange',
    borderRadius: 5,
  },
  statusIcon: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
});

export default PropertyMap;
