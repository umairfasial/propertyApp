import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import React, {useEffect} from 'react';
import ContractCard from '../components/ui/ContractCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  downloadFileSlice,
  fetchContractsWithId,
} from '../redux/slices/property/propertySlice';
import {getReadableFileName} from '../contants/Functions';
import {useNavigation} from '@react-navigation/native';

export default function Contract() {
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.auth);
  const {contracts} = useSelector(state => state.property);
  const navigation = useNavigation();

  useEffect(() => {
    if (userData) {
      dispatch(fetchContractsWithId({id: userData?.uid}));
    }
  }, [userData]);

  console.log('contracts', contracts);

  const handleEdit = contractId => {
    if (!contractId) {
      Alert.alert('Error', 'Invalid contract ID');
      return;
    }

    const contractToEdit = contracts.find(
      contract => contract.id === contractId,
    );

    if (!contractToEdit) {
      Alert.alert('Error', 'Contract not found');
      return;
    }

    navigation.navigate('AddContractForm', {
      contractData: contractToEdit,
      isEdit: true,
    });
  };

  const handleDownload = url => {
    if (!url) {
      Alert.alert('Error', 'No file available to download');
      return;
    }
    dispatch(downloadFileSlice(url));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {contracts.map((contract, index) => (
          <ContractCard
            key={contract.id || index}
            contractTitle={contract.contractTitle}
            contractId={contract.id}
            contractType={contract.contractType}
            startDate={contract.startDate}
            endDate={contract.endDate}
            currency={contract.currency}
            monthlyAmount={contract.contractPrice}
            fileName={getReadableFileName(contract.contractFileUrl)}
            contractFileUrl={contract.contractFileUrl}
            onEdit={() => handleEdit(contract.id)}
            handleDownload={handleDownload}
            propertyId={contract.propertyId}
          />
        ))}
        {contracts.length === 0 && (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{color: '#6B7280'}}>No active contracts</Text>
          </View>
        )}
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
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    padding: 16,
  },
});
