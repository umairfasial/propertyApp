import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import ScheduleIcon from '../../assets/icons/schedule.svg';
import ShareIcon from '../../assets/icons/share.svg';
import Editicon from '../../assets/icons/edit.svg';
import {useSelector} from 'react-redux';
import moment from 'moment';

const CertificateCard = ({
  id,
  endDate,
  status,
  certificateType,
  propertyId,
  navigation,
}) => {
  const {properties} = useSelector(state => state.property);
  const isExpired = status === 'Expired';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View
              style={[
                styles.statusBadge,
                isExpired ? styles.expiredBadge : styles.validBadge,
              ]}>
              <Text
                style={[
                  styles.statusText,
                  isExpired ? styles.expiredText : styles.validText,
                ]}>
                {isExpired ? 'Expired' : 'Active'}
              </Text>
            </View>
            <Text style={styles.title}>{certificateType}</Text>
          </View>
          <ShareIcon style={styles.iconContainer} />
        </View>
        <Text style={styles.address}>
          {properties.find(pro => pro.id === propertyId)?.address}
        </Text>
        <View style={styles.dateContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ScheduleIcon style={[styles.calendarIcon, {marginRight: 8}]} />
            <Text style={styles.date}>
              {isExpired ? 'Expired on ' : 'Valid until '}
              {moment(endDate).format('DD MMMM YYYY')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddCertificate', {certificateId: id})
            }>
            <Editicon style={styles.iconContainer} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  titleContainer: {
    flex: 1,
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  validBadge: {
    backgroundColor: '#E6F7ED',
  },
  expiredBadge: {
    backgroundColor: '#FFE9E9',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  validText: {
    color: '#1D8841',
  },
  expiredText: {
    color: '#D92D20',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#000',
  },
  iconContainer: {
    width: 24,
    height: 24,
    color: '#000',
  },
  address: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#6B7280',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'space-between',
  },
  calendarIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});

export default CertificateCard;
