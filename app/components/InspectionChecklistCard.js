import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {Star} from 'lucide-react-native';
import {CountryCodes, issueTypes} from '../contants/Constants';
import {Dropdown} from 'react-native-element-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {addIssueThunk} from '../redux/slices/issue/issueSlice';

const MAX_IMAGES = 10;
const MAX_VIDEOS = 2;

const InspectionChecklistCard = ({
  title,
  description,
  options,
  onSkip,
  onDataChange,
  itemId,
  propertyId,
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(0);
  const [issueType, setIssueType] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.auth);
  const {properties} = useSelector(state => state.property);

  useEffect(() => {
    if (!options) {
      setIsComplete(true);
      if (onDataChange) {
        onDataChange(itemId, {isComplete: true, isSkipped: false, data: {}});
      }
      return;
    }

    if (isSkipped) {
      setIsComplete(true);
      if (onDataChange) {
        onDataChange(itemId, {
          isComplete: true,
          isSkipped: true,
          data: {skipped: true},
        });
      }
      return;
    }

    let allEnabledSectionsComplete = true;
    let currentData = {};

    if (options['Add Photo']) {
      if (selectedImages.length === 0) {
        allEnabledSectionsComplete = false;
      } else {
        currentData.images = selectedImages;
      }
    }
    if (options['Record']) {
      if (selectedVideos.length === 0) {
        allEnabledSectionsComplete = false;
      } else {
        currentData.videos = selectedVideos;
      }
    }
    if (options['Add Note']) {
      if (note.trim().length === 0) {
        allEnabledSectionsComplete = false;
      } else {
        currentData.note = note.trim();
      }
    }
    if (options.Rating) {
      if (rating === 0) {
        allEnabledSectionsComplete = false;
      } else {
        currentData.rating = rating;
      }
    }
    if (options['Report Issue']) {
      if (issueType === '') {
        allEnabledSectionsComplete = false;
      } else {
        currentData.issueType = issueType;
      }
    }

    setIsComplete(allEnabledSectionsComplete);

    if (onDataChange) {
      onDataChange(itemId, {
        isComplete: allEnabledSectionsComplete,
        isSkipped: false,
        data: currentData,
      });
    }
  }, [
    options,
    selectedImages,
    selectedVideos,
    note,
    rating,
    issueType,
    isSkipped,
  ]);

  const handleMediaPick = async (type, fromCamera = false) => {
    const mediaOptions = {
      mediaType: type,
      quality: 0.8, // Reduced from 1 to avoid large file issues
      selectionLimit: 0,
      videoQuality: 'medium',
      durationLimit: 60,
      // iOS specific options for better file access
      includeBase64: false,
      includeExtra: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    try {
      let result;
      if (fromCamera) {
        result = await launchCamera(mediaOptions);
      } else {
        result = await launchImageLibrary(mediaOptions);
      }
      if (result.assets) {
        const validAssets = result.assets.filter(asset => {
          if (type === 'video') return asset.duration <= 60;
          return true;
        });
        
        // Format assets with better file info for Firebase upload
        const formattedAssets = validAssets.map((asset, index) => ({
          ...asset,
          fileName: asset.fileName || `inspection_${type}_${Date.now()}_${index}.${type === 'video' ? 'mp4' : 'jpg'}`,
        }));
        
        if (type === 'photo') {
          if (selectedImages.length + formattedAssets.length > MAX_IMAGES) {
            Alert.alert(
              'Limit Exceeded',
              `You can only upload up to ${MAX_IMAGES} images.`,
            );
            return;
          }
          setSelectedImages([...selectedImages, ...formattedAssets]);
        } else {
          if (selectedVideos.length + formattedAssets.length > MAX_VIDEOS) {
            Alert.alert(
              'Limit Exceeded',
              `You can only upload up to ${MAX_VIDEOS} videos.`,
            );
            return;
          }
          setSelectedVideos([...selectedVideos, ...formattedAssets]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Media selection failed.');
    }
  };

  const renderMedia = (mediaArray, removeFn) =>
    mediaArray.map((media, index) => (
      <View key={index} style={styles.mediaContainer}>
        <Image source={{uri: media.uri}} style={styles.mediaPreview} />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFn(index)}>
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    ));

  const removeImage = index =>
    setSelectedImages(images => images.filter((_, i) => i !== index));
  const removeVideo = index =>
    setSelectedVideos(videos => videos.filter((_, i) => i !== index));

  const handleSkipPress = () => {
    setIsSkipped(true);
    if (onSkip) {
      onSkip();
    }
  };

  const handleReportIssue = async () => {
    if (!issueType) {
      Alert.alert('Error', 'Please select an issue type');
      return;
    }
    if (!propertyId) {
      Alert.alert('Error', 'Property ID is missing');
      return;
    }
    const selectedPropertyData = properties?.find(
      property => property.id === propertyId,
    );
    const assignedTo =
      userData?.role === 'tenant'
        ? [
            selectedPropertyData?.managerId,
            selectedPropertyData?.userId,
          ].filter(Boolean)
        : [selectedPropertyData?.tenantId].filter(Boolean);
    
    const finalData = {
      propertyId: propertyId,
      issueType: issueType,
      priority: 'medium', // Default or allow selection if needed
      title: title,
      description: description,
      attachmentFile: selectedImages, // Images are already properly formatted
      reportDate: new Date().toISOString(),
      userId: userData?.uid,
      assignedTo,
      status: 'open',
    };
    try {
      await dispatch(addIssueThunk({finalData})).unwrap();
      Alert.alert('Success', 'Issue reported successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to report issue');
    }
  };

  return (
    <View style={[styles.card, !isComplete && styles.incompleteCard]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{flex: 1}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {!isSkipped && (
          <TouchableOpacity onPress={handleSkipPress}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        )}
        {isSkipped && (
          <View>
            <Text style={styles.skippedText}>Skipped</Text>
          </View>
        )}
      </View>

      {!isSkipped && (
        <>
          {/* Add Image Section */}
          {options && options['Add Photo'] && (
            <>
              <Text style={styles.sectionTitle}>Add Images</Text>
              <View style={styles.mediaGrid}>
                <TouchableOpacity
                  style={styles.addMediaButton}
                  onPress={() => handleMediaPick('photo', false)}>
                  <Text style={{fontSize: 24}}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addMediaButton}
                  onPress={() => handleMediaPick('photo', true)}>
                  <Text style={{fontSize: 18}}>📷</Text>
                </TouchableOpacity>
                {renderMedia(selectedImages, removeImage)}
              </View>
            </>
          )}

          {/* Record Video Section */}
          {options && options['Record'] && (
            <>
              <Text style={styles.sectionTitle}>Record Videos</Text>
              <View style={styles.mediaGrid}>
                <TouchableOpacity
                  style={styles.addMediaButton}
                  onPress={() => handleMediaPick('video')}>
                  <Text style={{fontSize: 24}}>+</Text>
                </TouchableOpacity>
                {renderMedia(selectedVideos, removeVideo)}
              </View>
            </>
          )}

          {/* Add Note Section */}
          {options && options['Add Note'] && (
            <>
              <Text style={styles.sectionTitle}>Add Note</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Add notes..."
                placeholderTextColor="#000"
                multiline
                numberOfLines={4}
                value={note}
                onChangeText={text => setNote(text)}
              />
            </>
          )}

          {/* Rating Section */}
          {options && options.Rating && (
            <>
              <Text style={styles.sectionTitle}>Rating</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(i => (
                  <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Star
                      size={24}
                      color={i <= rating ? '#FFD700' : '#C0C0C0'}
                      fill={i <= rating ? '#FFD700' : 'none'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Report Issue Section */}
          {options && options['Report Issue'] && (
            <View style={styles.reportRow}>
              <View style={styles.pickerContainer}>
                <Dropdown
                  data={issueTypes}
                  labelField="title"
                  valueField="id"
                  value={issueType}
                  onChange={item => setIssueType(item.id)}
                  placeholder="Select Issue Type"
                  style={styles.dropdownPicker}
                  selectedTextStyle={styles.dropdownSelectedText}
                  itemTextStyle={styles.dropdownItemText}
                />
              </View>
              <TouchableOpacity
                style={styles.reportButton}
                onPress={handleReportIssue}>
                <Text style={styles.reportButtonText}>Report Issue</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default InspectionChecklistCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    margin: 12,
  },
  incompleteCard: {
    backgroundColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  skip: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  skippedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addMediaButton: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  textArea: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  pickerContainer: {
    flex: 1,
    marginRight: 8,
  },
  picker: {
    height: 50,
    color: '#000',
  },
  dropdownPicker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dropdownSelectedText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
  reportButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reportButtonText: {
    color: '#FFF',
    fontWeight: '500',
  },
});
