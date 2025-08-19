import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../components/ui/Dropdown";
import { fetchTenants } from "../redux/slices/auth/authSlice";
import {
  addContractSlice,
  editContractSlice,
  fetchContractsWithId,
} from "../redux/slices/property/propertySlice";
import DateTimePicker from "@react-native-community/datetimepicker";
import { pick } from "@react-native-documents/picker";
import RNFS from "react-native-fs";
import { currencyData, tenancyTypes } from "../contants/Constants";
import UploadIcon from "../assets/icons/upload.svg";

export default function AddContractForm({ navigation, route }) {
  const { contractData, isEdit } = route.params || {};
  const { properties } = useSelector((state) => state.property);
  const { userData } = useSelector((state) => state.auth);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [contractPrice, setContractPrice] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedContractType, setSelectedContractType] = useState(null);
  const [contractTitle, setContractTitle] = useState("");
  const [currency, setCurrency] = useState(null);
  const [contractFile, setContractFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { tenants } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTenants());
  }, []);

  useEffect(() => {
    if (isEdit && contractData) {
      setContractTitle(contractData.contractTitle);
      setSelectedProperty(contractData.propertyId);
      setSelectedTenant(contractData.tenantId);
      setContractPrice(contractData.contractPrice);
      setSelectedContractType(contractData.contractType);
      setCurrency(contractData.currency);
      setStartDate(new Date(contractData.startDate));
      setEndDate(new Date(contractData.endDate));
    }
  }, [isEdit, contractData]);

  useEffect(() => {
    if (selectedProperty) {
      const selectedPropertyData = properties.find(
        (property) => property.id === selectedProperty
      );
      if (selectedPropertyData) {
        setSelectedTenant(selectedPropertyData?.tenantId);
        setCurrency(selectedPropertyData?.currency);
        setContractPrice(selectedPropertyData?.monthlyIncome);
        setSelectedContractType(selectedPropertyData?.tenancyType);
      }
    }
  }, [selectedProperty]);

  const handleStartDateChange = (event, selectedDate) => {
    const isSet = event.type === "set";
    if (Platform.OS === "android") {
      setShowStartDatePicker(false);
    }
    if (isSet && selectedDate) {
      const onlyDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setStartDate(onlyDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    const isSet = event.type === "set";
    if (Platform.OS === "android") {
      setShowEndDatePicker(false);
    }
    if (isSet && selectedDate) {
      const onlyDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setEndDate(onlyDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return "DD MON YYYY";
    return date.toLocaleDateString();
  };

  const pickDocument = async () => {
    try {
      const result = await pick({
        copyTo: "cachesDirectory",
      });

      if (result && result[0]) {
        const file = result[0];
        console.log("Selected file:", file);

        const fileType = file.type?.toLowerCase() || "";
        const isValidType = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(fileType);

        if (!isValidType) {
          setFileError("Please select only PDF or DOC files");
          return;
        }

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          setFileError("File size should be less than 5MB");
          return;
        }

        // For Android, we need to copy the file to a location we can access
        if (Platform.OS === "android" && file.uri) {
          try {
            // Create a unique filename in the app's cache directory
            const fileName = `${Date.now()}_${Math.random()
              .toString(36)
              .substring(7)}_${file.name}`;
            const destinationPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

            // Copy the file to our accessible location
            await RNFS.copyFile(file.uri, destinationPath);

            file.uri = destinationPath;
            console.log("File copied to:", destinationPath);
          } catch (copyError) {
            console.error("Error copying file:", copyError);
            setFileError("Error processing the selected file");
            return;
          }
        }

        setContractFile(file);
        setFileError("");
      }
    } catch (err) {
      if (!err.isCancel) {
        setFileError("Error picking the document");
        console.log("Document picker error:", err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!contractTitle) {
      Alert.alert("Error", "Please add a contract title");
      return;
    }

    if (!selectedProperty) {
      Alert.alert("Error", "Please select a property");
      return;
    }

    if (!selectedTenant) {
      Alert.alert("Error", "Please select a tenant ");
      return;
    }

    if (!startDate) {
      Alert.alert("Error", "Please select a start date");
      return;
    }

    if (!endDate) {
      Alert.alert("Error", "Please select an end date");
      return;
    }

    if (!isEdit && !contractFile) {
      Alert.alert("Error", "Please upload a contract document");
      return;
    }

    if (!currency) {
      Alert.alert("Error", "Please Add currency");
      return;
    }

    if (!contractPrice) {
      Alert.alert("Error", "Please Add contract price");
      return;
    }
    if (!selectedContractType) {
      Alert.alert("Error", "Please Add contract type");
      return;
    }

    setUploading(true);

    try {
      const contractData = {
        contractTitle,
        propertyId: selectedProperty,
        tenantId: selectedTenant,
        startDate,
        endDate,
        contractFile: isEdit ? null : contractFile, // Only send file if not editing
        owner: userData.uid,
        contractPrice,
        currency,
        contractType: selectedContractType,
      };

      if (isEdit) {
        await dispatch(
          editContractSlice({
            contractData,
            contractId: route.params.contractData.id,
          })
        ).unwrap();
      } else {
        await dispatch(addContractSlice(contractData)).unwrap();
      }

      dispatch(fetchContractsWithId({ id: userData?.uid }));
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting contract:", error);
      Alert.alert(
        "Error",
        `Failed to ${isEdit ? "update" : "add"} contract. Please try again.`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Contract Title</Text>
          <TextInput
            style={styles.statusInput}
            placeholder="Enter the title of the contract"
            placeholderTextColor="#000"
            value={contractTitle}
            onChangeText={(text) => setContractTitle(text)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Select Property</Text>
          <Dropdown
            label="Select Property"
            data={properties?.map((property) => ({
              label: property.propertyName,
              value: property.id,
            }))}
            value={selectedProperty}
            onSelect={setSelectedProperty}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Select Tenant</Text>
          <Dropdown
            label="Select Property"
            data={tenants?.map((tenant) => ({
              label: tenant.fullName,
              value: tenant.id,
            }))}
            value={selectedTenant}
            onSelect={setSelectedTenant}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Contract Type</Text>
          <Dropdown
            label="Select Contract Type"
            data={tenancyTypes}
            value={selectedContractType}
            onSelect={setSelectedContractType}
          />
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.dateInput}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.dateField}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.placeholder}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
            {showStartDatePicker &&
              (Platform.OS === "android" ? (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                />
              ) : (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleStartDateChange}
                  style={{ width: "100%" }}
                />
              ))}
          </View>
          <View style={styles.dateInput}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              style={styles.dateField}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.placeholder}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
            {showEndDatePicker &&
              (Platform.OS === "android" ? (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                />
              ) : (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleEndDateChange}
                  style={{ width: "100%" }}
                />
              ))}
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Currency</Text>
          <Dropdown
            data={currencyData}
            defaultValue="$"
            onSelect={(val) => setCurrency(val)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Add Contract Amount</Text>
          <TextInput
            style={styles.statusInput}
            placeholder="Enter total amount for the contract"
            placeholderTextColor="#000"
            value={contractPrice}
            onChangeText={(text) => setContractPrice(text)}
          />
        </View>

        <View style={styles.uploadBox}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickDocument}
            activeOpacity={0.7}
          >
            {contractFile ? (
              <View style={styles.filePreview}>
                <View style={styles.fileIconContainer}>
                  <View style={styles.fileIcon} />
                </View>
                <Text style={styles.fileName} numberOfLines={1}>
                  {contractFile.name}
                </Text>
                <Text style={styles.fileSize}>
                  {(contractFile.size / (1024 * 1024)).toFixed(2)} MB
                </Text>
              </View>
            ) : (
              <Text style={styles.uploadText}>
                <UploadIcon color="#9CA3AF" width={30} height={20} />
                {"\n"}
                <Text style={[styles.uploadText, { fontWeight: "700" }]}>
                  Click to upload or drag and drop
                </Text>
                {"\n"}PDF, DOC up to 5MB
              </Text>
            )}
          </TouchableOpacity>
          {fileError ? <Text style={styles.error}>{fileError}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.addButton, uploading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>
              {isEdit ? "Update Contract" : "Add Contract"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  formContainer: {
    padding: 16,
    backgroundColor: "white",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 5,
    color: "#6B7280",
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 12,
  },
  dateContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
  },
  dateField: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  statusInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  placeholder: {
    color: "#A0AEC0",
    fontSize: 14,
  },
  uploadBox: {
    marginBottom: 16,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    borderStyle: "dashed",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    height: 150,
    backgroundColor: "#FFFFFF",
  },
  uploadIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
  },
  uploadText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
