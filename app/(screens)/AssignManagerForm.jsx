import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import PersonRow from '../components/PersonRow';
import BuildingIcon from '../assets/icons/properties.svg';
import SearchIcon from '../assets/icons/search.svg';
import InputField from '../components/ui/InputLabelField';
import {useDispatch, useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import {fetchManagers} from '../redux/slices/auth/authSlice';
import {
  addPropertyManager,
  fetchPropertiesSlice,
} from '../redux/slices/property/propertySlice';
import {ActivityIndicator} from 'react-native';

export default function AssignManager({navigation}) {
  const {properties} = useSelector(state => state.property);
  const {managers, userData} = useSelector(state => state.auth);
  const route = useRoute();
  const dispatch = useDispatch();
  const {propertyId, next} = route.params;
  const selectedProperty = properties.find(
    property => property.id === propertyId,
  );
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(fetchManagers());
  }, [selectedProperty]);

  const handleManagerClick = managerId => {
    setLoading(true);
    console.log('handleManagerClick', managerId);
    dispatch(addPropertyManager({managerId, propertyId})).then(() => {
      setLoading(false);
      dispatch(fetchPropertiesSlice({userId: userData?.uid}));
      if (next) {
        navigation.navigate('AssignTenants', {
          propertyId: propertyId,
          next: true,
        });
      }
    });
  };

  const filteredManagers = managers?.filter(manager =>
    manager.fullName.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <>
      {loading ? (
        <View style={[styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.propertyCard}>
            <BuildingIcon width={24} height={24} />
            <View style={{marginLeft: 12}}>
              <Text style={styles.propertyName}>
                {selectedProperty?.propertyName}
              </Text>
              <Text style={styles.propertyAddress}>
                {selectedProperty?.address}
              </Text>
            </View>
          </View>

          <InputField
            icon={SearchIcon}
            placeholder="Search Property managers...."
            onChangeText={text => setSearchText(text)}
            containerStyle={styles.mainInputContainer}
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />

          <Text style={styles.availableManagersTitle}>Available Managers</Text>
          {filteredManagers?.length > 0 ? (
            filteredManagers.map((manager, index) => (
              <PersonRow
                key={manager.uid}
                name={manager.fullName}
                avatarUri={manager.photoUrl}
                numberManaged={index + 2}
                showAssignButton={true}
                onClick={() => handleManagerClick(manager.uid)}
              />
            ))
          ) : (
            <View style={{padding: 10, alignItems: 'center'}}>
              <Text>No matching manager found</Text>
            </View>
          )}

          <View style={styles.inviteBox}>
            <Text style={styles.inviteTitle}>Invite New Manager</Text>
            <TextInput
              style={styles.emailInput}
              placeholder="Enter email address"
              keyboardType="email-address"
              placeholderTextColor="#ADAEBC"
            />
            <TextInput
              style={styles.emailInput}
              placeholder="Enter Phone Number"
              keyboardType="phone-number"
              placeholderTextColor="#ADAEBC"
            />
            <TouchableOpacity style={styles.sendInvitationButton}>
              <Text style={styles.sendInvitationButtonText}>
                Send Invitation
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fafafa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  propertyName: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#1F2937',
  },
  propertyAddress: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#4B5563',
    marginTop: 4,
  },
  mainInputContainer: {
    marginBottom: 10,
  },
  labelStyle: {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: 14,
    color: '#374151',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
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
  searchInput: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  availableManagersTitle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#6B7280',
    marginBottom: 5,
  },
  inviteBox: {
    marginTop: 20,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  inviteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emailInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  sendInvitationButton: {
    backgroundColor: '#10B981',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sendInvitationButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
