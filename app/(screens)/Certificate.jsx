import React from 'react';
import {ScrollView, View, Text, StyleSheet, TextInput} from 'react-native';
import CertificateCard from '../components/ui/CertificateCard';
import {useSelector} from 'react-redux';
import InputField from '../components/ui/InputLabelField';
import SearchIcon from '../assets/icons/search.svg';

export default function CertificateScreen({navigation}) {
  const {certificates} = useSelector(state => state.property);
  const activeCertificates = certificates.filter(
    cert => cert.status[0] === 'Active',
  );
  const expiredCertificates = certificates.filter(
    cert => cert.status[0] !== 'Active',
  );
  return (
    <ScrollView style={styles.container}>
      <InputField
        icon={SearchIcon}
        placeholder="Search certificates"
        containerStyle={styles.mainInputContainer}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
      />
      <View style={styles.contentCantainer}>
        <>
          {activeCertificates.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Active Certificates</Text>
              {activeCertificates.map((cert, index) => (
                <View style={styles.cardContainer} key={`active-${index}`}>
                  <CertificateCard {...cert} navigation={navigation} />
                </View>
              ))}
            </>
          )}

          {expiredCertificates.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Expired Certificates</Text>
              {expiredCertificates.map((cert, index) => (
                <View style={styles.cardContainer} key={`expired-${index}`}>
                  <CertificateCard {...cert} navigation={navigation} />
                </View>
              ))}
            </>
          )}
        </>

        {certificates.length === 0 && (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{color: '#6B7280'}}>No active certificates</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fafafa',
  },
  cardContainer: {
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 16,
    marginBottom: 10,
    amrginTop: 10,
  },
  mainInputContainer: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: '#000',
  },
  contentCantainer: {
    backgroundColor: '#fafafa',
    paddingTop: 10,
    flex: 1,
  },
});
