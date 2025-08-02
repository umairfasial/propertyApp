import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import IssueTypeCard from "../components/ui/IssueTypeCard";
import PriorityOption from "../components/ui/PriorityOption";
import CustomDropdown from "../components/ui/Dropdown";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { addIssueThunk } from "../redux/slices/issue/issueSlice";
import { useNavigation } from "@react-navigation/native";

import PlusIcon from "../assets/icons/plus.svg";
import { issueTypes, priorities, UserRoles } from "../contants/Constants";

export default function ReportIssue() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedIssueType, setSelectedIssueType] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [issueTitle, setIssueTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaError, setMediaError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { properties } = useSelector((state) => state.property);
  const { userData } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.issue);

  const handleMediaPick = async (fromCamera = false) => {
    const options = {
      mediaType: "mixed",
      quality: 0.8, // Reduced from 1 to avoid large file issues
      selectionLimit: 0,
      videoQuality: "medium",
      durationLimit: 60,
      // iOS specific options for better file access
      includeBase64: false,
      includeExtra: true,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    try {
      let result;
      if (fromCamera) {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }
      if (result.assets) {
        // Check for videos that exceed duration limit
        const invalidVideos = result.assets.filter(
          (asset) => asset.type?.startsWith("video/") && asset.duration > 60
        );
        if (invalidVideos.length > 0) {
          Alert.alert(
            "Invalid Video Duration",
            "Videos must be 60 seconds or less. Please select shorter videos.",
            [{ text: "OK" }]
          );
          return;
        }

        // Format assets with better file info for Firebase upload
        const formattedAssets = result.assets.map((asset, index) => ({
          ...asset,
          fileName:
            asset.fileName ||
            `issue_media_${Date.now()}_${index}.${
              asset.type?.includes("video") ? "mp4" : "jpg"
            }`,
        }));

        setMediaError("");
        setSelectedMedia((prevMedia) => [...prevMedia, ...formattedAssets]);
      }
    } catch (error) {
      console.log("Media picker error:", error);
      setMediaError("Failed to load media. Please try again.");
    }
  };

  const removeMedia = (index) => {
    setSelectedMedia((prevMedia) =>
      prevMedia.filter((_, mediaIndex) => mediaIndex !== index)
    );
  };

  const renderMediaPreview = (media, index) => {
    const isVideo = media.type?.startsWith("video/");

    return (
      <View key={index} style={styles.mediaContainer}>
        {isVideo ? (
          <View style={styles.videoContainer}>
            <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
            <View style={styles.videoOverlay}>
              <Text style={styles.videoDuration}>
                {Math.round(media.duration)}s
              </Text>
            </View>
          </View>
        ) : (
          <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
        )}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeMedia(index)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getAssignMemberNames = () => {
    const selectedPropertyData = properties?.find(
      (property) => property.id === selectedProperty
    );
    if (!selectedPropertyData) return [];

    if (userData?.role === "tenant") {
      return [
        selectedPropertyData.managerName,
        selectedPropertyData.userName,
      ].filter(Boolean);
    } else {
      return [selectedPropertyData.tenantName].filter(Boolean);
    }
  };
  useEffect(() => {}, []);
  const names = getAssignMemberNames();
  console.log("Assigned Member Names:", names);
  const getAssignMemberId = () => {
    const selectedPropertyData = properties?.find(
      (property) => property.id === selectedProperty
    );

    if (!selectedPropertyData) return [];

    if (userData?.role === "tenant") {
      return [
        selectedPropertyData.managerId,
        selectedPropertyData.userId,
      ].filter(Boolean);
    } else {
      return [selectedPropertyData.tenantId].filter(Boolean);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const finalData = {
        propertyId: selectedProperty,
        issueType: selectedIssueType,
        priority: selectedPriority,
        title: issueTitle,
        description: description,
        attachmentFile: selectedMedia,
        reportDate: new Date().toISOString(),
        userId: userData?.uid,
        assignedTo: getAssignMemberId(),
        status: "open",
      };

      await dispatch(addIssueThunk({ finalData }))
        .unwrap()
        .then(() => {
          setSelectedIssueType("");
          setSelectedProperty("");
          setSelectedPriority("");
          setSelectedMedia([]);
        });
      Alert.alert("Success", "Issue reported successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to report issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Property</Text>
        <CustomDropdown
          data={properties.map((property) => ({
            label: property.propertyName,
            value: property.id,
          }))}
          value={selectedProperty}
          onSelect={(value) => setSelectedProperty(value)}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Issue Type</Text>
        <View style={styles.issueTypesGrid}>
          {issueTypes.map((type) => (
            <IssueTypeCard
              key={type.id}
              title={type.title}
              subtitle={type.subtitle}
              icon={type.icon}
              isSelected={selectedIssueType === type.id}
              onPress={() => setSelectedIssueType(type.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Priority</Text>
        {priorities.map((priority) => (
          <PriorityOption
            key={priority.id}
            title={priority.title}
            description={priority.description}
            color={priority.color}
            isSelected={selectedPriority === priority.id}
            onPress={() => setSelectedPriority(priority.id)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Issue Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Brief description of the issue"
          placeholderTextColor="#ADAEBC"
          value={issueTitle}
          onChangeText={setIssueTitle}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Detailed description of the issue"
          placeholderTextColor="#ADAEBC"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Photos/Videos</Text>
        <View style={styles.mediaGrid}>
          <TouchableOpacity
            style={styles.addMediaButton}
            onPress={() => handleMediaPick(false)}
          >
            <PlusIcon style={styles.addIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addMediaButton}
            onPress={() => handleMediaPick(true)}
          >
            <Text style={{ fontSize: 18 }}>📷</Text>
          </TouchableOpacity>
          {selectedMedia.map((media, index) =>
            renderMediaPreview(media, index)
          )}
        </View>
        {mediaError ? <Text style={styles.errorText}>{mediaError}</Text> : null}
        <Text style={styles.mediaHint}>Videos must be 60 seconds or less</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting || loading}
      >
        {isSubmitting || loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Issue</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 12,
  },
  issueTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  mediaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  addMediaButton: {
    width: 80,
    height: 80,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    width: 30,
    height: 30,
    borderRadius: 12,
  },
  mediaContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  mediaPreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  videoOverlay: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 4,
    borderRadius: 4,
  },
  videoDuration: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 8,
  },
  mediaHint: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#93C5FD",
    opacity: 0.7,
  },
});
