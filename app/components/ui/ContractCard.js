import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PdfIcon from '../../assets/icons/pdf.svg';
import DownloadIcon from '../../assets/icons/download.svg';
import ThreeDotMenuIcon from '../../assets/icons/threeDotsmenu.svg';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPropertyByPropertyIdSlice} from '../../redux/slices/property/propertySlice';

const ContractCard = ({
  contractTitle,
  contractId,
  contractType,
  startDate,
  endDate,
  currency,
  monthlyAmount,
  fileName,
  propertyId,
  onEdit,
  handleDownload,
  contractFileUrl,
}) => {
  const {downloading} = useSelector(state => state.property);
  const dispatch = useDispatch();
  const [propertyData, setPropertyData] = useState(null);
  const handleEditPress = () => {
    if (typeof onEdit === 'function' && contractId) {
      onEdit(contractId);
    }
  };

  const handleDownloadPress = () => {
    if (typeof handleDownload === 'function' && contractFileUrl) {
      handleDownload(contractFileUrl);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('calling with propertyId', propertyId);

        const result = await dispatch(
          fetchPropertyByPropertyIdSlice({propertyId}),
        ).unwrap();

        console.log('Fetched Property:', result); // You get the data directly here
        setPropertyData(result);

        // You can also set this to local state if needed
        // setProperty(result);
      } catch (err) {
        console.error('Error fetching property:', err);
      }
    };

    if (propertyId) {
      fetchData();
    }
  }, [propertyId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>{contractTitle}</Text>
          <Text style={styles.contractId}>Contract #{contractId}</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <ThreeDotMenuIcon style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Property name</Text>
          <Text style={styles.value}>{propertyData?.propertyName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Property Type</Text>
          <Text style={styles.value}>{propertyData?.propertyType}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Contract Type</Text>
          <Text style={styles.value}>{contractType}</Text>
        </View>
        {startDate && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Start Date</Text>
            <Text style={styles.value}>{startDate}</Text>
          </View>
        )}

        {endDate && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>End Date</Text>
            <Text style={styles.value}>{endDate}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.label}>Currency</Text>
          <Text style={styles.value}>{currency}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Monthly Amount</Text>
          <Text style={styles.value}>
            {currency}
            {monthlyAmount}
          </Text>
        </View>

        <View style={styles.fileRow}>
          <View style={styles.fileInfo}>
            <PdfIcon style={styles.fileIcon} />
            <Text style={styles.fileName}>{fileName}</Text>
          </View>
          <TouchableOpacity onPress={handleDownloadPress}>
            <DownloadIcon style={styles.downloadIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
        <Text style={styles.editButtonText}>Edit Contract</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#000',
  },
  contractId: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  menuButton: {
    padding: 4,
  },
  menuIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  value: {
    fontSize: 14,
    color: '#000',
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#F9FAFB',
    padding: 10,
    paddingVertical: 15,
    borderRadius: 10,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  fileIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginRight: 8,
  },
  fileName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  downloadIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  editButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ContractCard;
