import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
  Dimensions,
  PermissionsAndroid,
  Share,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

const {width} = Dimensions.get('window');

export default function InspectionReportDetails({route, navigation}) {
  const {report, template, property, inspectionDetails, items, reportData} = route.params;
  const [downloading, setDownloading] = useState(false);

  // Helper function to request storage permission on Android
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to storage to save PDF files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS doesn't need this permission
  };

  // Helper function to render images from reportData
  const renderImages = (itemData) => {
    if (!itemData || !itemData.images || !Array.isArray(itemData.images)) {
      return null;
    }

    return (
      <View style={styles.imagesContainer}>
        <Text style={styles.imagesTitle}>Images:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.imagesRow}>
            {itemData.images.map((imageUri, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.imageWrapper}
                onPress={() => {
                  // TODO: Open image in full screen
                  Alert.alert('Image', `Image ${index + 1}`);
                }}
              >
                <Image source={{uri: imageUri}} style={styles.itemImage} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  // Helper function to render inspection items with their data
  const renderInspectionItems = () => {
    if (!items || items.length === 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inspection Items</Text>
          <Text style={styles.noDataText}>No inspection items found</Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inspection Items ({items.length})</Text>
        {items.map((item, index) => {
          const itemData = reportData ? reportData[item.id] : null;
          
          return (
            <View key={item.id} style={styles.itemCard}>
              <Text style={styles.itemTitle}>
                {item.name || item.title || `Item ${index + 1}`}
              </Text>
              
              {item.description && (
                <Text style={styles.itemDescription}>{item.description}</Text>
              )}

              {itemData && (
                <View style={styles.itemDataContainer}>
                  {itemData.status && (
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Status:</Text>
                      <View style={[styles.statusBadge, getItemStatusStyle(itemData.status)]}>
                        <Text style={styles.statusText}>{itemData.status}</Text>
                      </View>
                    </View>
                  )}

                  {itemData.notes && (
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Notes:</Text>
                      <Text style={styles.dataValue}>{itemData.notes}</Text>
                    </View>
                  )}

                  {itemData.rating && (
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Rating:</Text>
                      <Text style={styles.dataValue}>{itemData.rating}/5</Text>
                    </View>
                  )}

                  {itemData.condition && (
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Condition:</Text>
                      <Text style={styles.dataValue}>{itemData.condition}</Text>
                    </View>
                  )}

                  {renderImages(itemData)}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  // Helper function to get status badge style
  const getItemStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pass':
      case 'good':
      case 'excellent':
        return {backgroundColor: '#D1FAE5'};
      case 'fail':
      case 'poor':
      case 'critical':
        return {backgroundColor: '#FEE2E2'};
      case 'warning':
      case 'fair':
        return {backgroundColor: '#FEF3C7'};
      default:
        return {backgroundColor: '#F3F4F6'};
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    
    try {
      // Request storage permission first
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Storage permission is required to save PDF files.');
        setDownloading(false);
        return;
      }

      // Create more comprehensive HTML content
      const itemsHtml = items?.map(item => {
        const itemData = reportData ? reportData[item.id] : null;
        return `
          <div style="margin-bottom: 20px; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; page-break-inside: avoid;">
            <h3 style="color: #111827; margin-bottom: 10px; font-size: 18px;">${item.name || item.title || 'Unnamed Item'}</h3>
            ${item.description ? `<p style="color: #6B7280; margin-bottom: 10px;"><strong>Description:</strong> ${item.description}</p>` : ''}
            ${itemData?.status ? `<p style="margin-bottom: 8px;"><strong>Status:</strong> <span style="background-color: #e5e7eb; padding: 4px 8px; border-radius: 4px;">${itemData.status}</span></p>` : ''}
            ${itemData?.notes ? `<p style="margin-bottom: 8px;"><strong>Notes:</strong> ${itemData.notes}</p>` : ''}
            ${itemData?.rating ? `<p style="margin-bottom: 8px;"><strong>Rating:</strong> ${itemData.rating}/5</p>` : ''}
            ${itemData?.condition ? `<p style="margin-bottom: 8px;"><strong>Condition:</strong> ${itemData.condition}</p>` : ''}
          </div>
        `;
      }).join('') || '<p>No items found</p>';

      const currentDate = new Date().toLocaleDateString();
      const reportDate = report.date || report.timestampFormatted || new Date(report.timestamp?.seconds * 1000).toLocaleDateString();

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Inspection Report - ${report.id}</title>
            <style>
              body { 
                font-family: 'Helvetica', Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                color: #333;
                line-height: 1.6;
              }
              .header { 
                background: linear-gradient(135deg, #2563EB, #1d4ed8);
                color: white;
                padding: 30px 20px;
                border-radius: 8px;
                margin-bottom: 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0 0 10px 0;
                font-size: 28px;
                font-weight: bold;
              }
              .header p {
                margin: 5px 0;
                opacity: 0.9;
              }
              .section { 
                margin-bottom: 25px; 
                page-break-inside: avoid;
              }
              .section h2 {
                color: #2563EB;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 10px;
                margin-bottom: 15px;
                font-size: 20px;
              }
              .property-info { 
                background-color: #f8f9fa; 
                padding: 20px; 
                border-radius: 8px;
                border-left: 4px solid #2563EB;
              }
              .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 15px;
              }
              .info-item {
                background: white;
                padding: 15px;
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .info-label {
                font-weight: bold;
                color: #6B7280;
                font-size: 12px;
                text-transform: uppercase;
                margin-bottom: 5px;
              }
              .info-value {
                color: #111827;
                font-size: 16px;
                font-weight: 600;
              }
              .items-grid {
                display: grid;
                gap: 15px;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6B7280;
                font-size: 12px;
              }
              @media print {
                .page-break { page-break-before: always; }
                body { font-size: 12px; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Inspection Report</h1>
              <p>Report ID: ${report.id}</p>
              <p>Generated on: ${currentDate}</p>
            </div>
            
            <div class="section property-info">
              <h2>Property Information</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Property Name</div>
                  <div class="info-value">${property?.name || property?.address || 'Unknown Property'}</div>
                </div>
                ${property?.address ? `
                <div class="info-item">
                  <div class="info-label">Address</div>
                  <div class="info-value">${property.address}</div>
                </div>` : ''}
                ${property?.type ? `
                <div class="info-item">
                  <div class="info-label">Property Type</div>
                  <div class="info-value">${property.type}</div>
                </div>` : ''}
              </div>
            </div>

            <div class="section">
              <h2>Inspection Details</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Inspection Date</div>
                  <div class="info-value">${reportDate}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Status</div>
                  <div class="info-value">${report.status || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Template</div>
                  <div class="info-value">${template?.name || template?.title || 'No Template'}</div>
                </div>
                ${inspectionDetails?.inspector ? `
                <div class="info-item">
                  <div class="info-label">Inspector</div>
                  <div class="info-value">${inspectionDetails.inspector}</div>
                </div>` : ''}
              </div>
            </div>

            <div class="section page-break">
              <h2>Inspection Items (${items?.length || 0})</h2>
              <div class="items-grid">
                ${itemsHtml}
              </div>
            </div>

            <div class="footer">
              <p>This report was generated automatically by Capital Prop Inspection System</p>
              <p>Report generated on ${currentDate} at ${new Date().toLocaleTimeString()}</p>
            </div>
          </body>
        </html>
      `;

      // Determine the best directory for saving
      let directory;
      if (Platform.OS === 'ios') {
        directory = RNFS.DocumentDirectoryPath;
      } else {
        // For Android, use the Downloads directory
        directory = `${RNFS.ExternalStorageDirectoryPath}/Download`;
      }

      const fileName = `inspection_report_${report.id}_${Date.now()}.pdf`;
      const filePath = `${directory}/${fileName}`;

      const options = {
        html: htmlContent,
        fileName: fileName,
        directory: Platform.OS === 'ios' ? 'Documents' : 'Download',
        width: 612,
        height: 792,
        padding: 24,
        bgColor: '#FFFFFF',
      };

      console.log('Generating PDF with options:', options);

      const file = await RNHTMLtoPDF.convert(options);
      console.log('PDF generated:', file);

      if (file.filePath) {
        // Show success message with options
        Alert.alert(
          'PDF Generated Successfully!',
          `Report saved as: ${fileName}`,
          [
            {text: 'OK'},
            {
              text: 'Open PDF',
              onPress: async () => {
                try {
                  const supported = await Linking.canOpenURL(file.filePath);
                  if (supported) {
                    await Linking.openURL(file.filePath);
                  } else {
                    Alert.alert('Error', 'Cannot open PDF file');
                  }
                } catch (error) {
                  console.error('Error opening PDF:', error);
                  Alert.alert('Error', 'Failed to open PDF file');
                }
              }
            },
            {
              text: 'Share',
              onPress: async () => {
                try {
                  await Share.share({
                    url: file.filePath,
                    title: `Inspection Report - ${report.id}`,
                    message: `Inspection report for ${property?.name || 'property'} - ${reportDate}`,
                  });
                } catch (error) {
                  console.error('Error sharing PDF:', error);
                  Alert.alert('Error', 'Failed to share PDF file');
                }
              }
            }
          ]
        );
      } else {
        throw new Error('PDF generation failed - no file path returned');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert(
        'PDF Generation Failed', 
        `Error: ${error.message || 'Unknown error occurred'}\n\nPlease try again or contact support if the problem persists.`
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Inspection Report</Text>
        <Text style={styles.reportId}>ID: {report.id}</Text>
      </View>

      {/* Property Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Property Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Property:</Text>
          <Text style={styles.value}>
            {property?.name || property?.address || report.propertyName || 'Unknown Property'}
          </Text>
        </View>
        {property?.address && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{property.address}</Text>
          </View>
        )}
        {property?.type && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{property.type}</Text>
          </View>
        )}
      </View>

      {/* Inspection Details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Inspection Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {report.date || report.timestampFormatted || new Date(report.timestamp?.seconds * 1000).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status:</Text>
          <View style={[styles.statusBadge, getItemStatusStyle(report.status)]}>
            <Text style={styles.statusText}>{report.status || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Template:</Text>
          <Text style={styles.value}>
            {template?.name || template?.title || 'No Template'}
          </Text>
        </View>
        {inspectionDetails?.inspector && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Inspector:</Text>
            <Text style={styles.value}>{inspectionDetails.inspector}</Text>
          </View>
        )}
      </View>

      {/* Inspection Items */}
      {renderInspectionItems()}

      {/* Download Button */}
      <TouchableOpacity
        style={[styles.downloadButton, downloading && styles.downloadButtonDisabled]}
        onPress={handleDownloadPDF}
        disabled={downloading}>
        {downloading ? (
          <View style={styles.downloadingContainer}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={[styles.downloadButtonText, {marginLeft: 10}]}>Generating PDF...</Text>
          </View>
        ) : (
          <Text style={styles.downloadButtonText}>📄 Download PDF Report</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#2563EB',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  reportId: {
    fontSize: 14,
    color: '#E0EDFF',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    minWidth: 80,
    marginRight: 8,
  },
  value: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    flex: 1,
  },
  itemCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  itemDataContainer: {
    marginTop: 8,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  dataLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    minWidth: 70,
    marginRight: 8,
  },
  dataValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  imagesContainer: {
    marginTop: 12,
  },
  imagesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  imageWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  noDataText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  downloadButton: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  downloadButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  downloadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
