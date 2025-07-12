import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function CertificateCard({
  status,
  title,
  address,
  validUntil,
  calendarIcon: CalendarIcon,
  shareIcon: ShareIcon,
  editIcon: EditIcon,
  statusColor,
  statusTextColor,
  isExpired = false,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.statusTag, {backgroundColor: statusColor}]}>
          <Text style={[styles.statusText, {color: statusTextColor}]}>
            {status}
          </Text>
        </View>
        <TouchableOpacity>
          <ShareIcon width={18} height={18} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.address}>{address}</Text>

      <View style={styles.footerRow}>
        <CalendarIcon width={14} height={14} />
        <Text style={[styles.dateText, isExpired && {color: '#B91C1C'}]}>
          {isExpired ? 'Expired on' : 'Valid until'} {validUntil}
        </Text>
        <TouchableOpacity style={{marginLeft: 'auto'}}>
          <EditIcon width={18} height={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#374151',
  },
});
