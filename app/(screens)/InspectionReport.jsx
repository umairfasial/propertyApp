import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import InputField from "../components/ui/InputLabelField";
import CustomDropdown from "../components/ui/Dropdown";
import { useNavigation } from "@react-navigation/native";

import SearchIcon from "../assets/icons/search.svg";
import ChatIcon from "../assets/icons/msg.svg";
import DownloadIcon from "../assets/icons/pdf_download.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchInspectionReportWithUserId,
  fetchTemplateByTemplateIdSlice,
  fetchInspectionDetailsByIds,
  fetchInspectionItemsByIdsSlice,
} from "../redux/slices/inspection/inspectionSlice";
import { fetchPropertiesByPropertiesIdSlice } from "../redux/slices/property/propertySlice";

const propertyData = [
  { label: "Property 1", value: "1" },
  { label: "Property 2", value: "2" },
  { label: "Property 3", value: "3" },
  { label: "Property 4", value: "4" },
  { label: "Property 5", value: "5" },
];

const templateData = [
  { label: "Template A", value: "a" },
  { label: "Template B", value: "b" },
  { label: "Template C", value: "c" },
];

const statusData = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
];

export default function InspectionReport() {
  const { userData } = useSelector((state) => state.auth);
  const {
    inspectionReports,
    selectedTemplate,
    selectedInspections,
    selectedItems,
    loading,
  } = useSelector((state) => state.inspection);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState("");
  const [selectProperty, setselectProperty] = useState(null);
  const [selectTemplate, setselectTemplate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const { selectedProperty } = useSelector((state) => state.property);

  useEffect(() => {
    if (userData?.uid) {
      dispatch(fetchInspectionReportWithUserId(userData.uid));
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (inspectionReports && Array.isArray(inspectionReports)) {
      let properties = [];
      inspectionReports.forEach((report) => {
        console.log("inspection", report.property);
        properties.push(report.propertyId);
      });
      dispatch(fetchPropertiesByPropertiesIdSlice({ properties }));
    }
  }, [inspectionReports]);

  useEffect(() => {
    if (inspectionReports && Array.isArray(inspectionReports)) {
      let templates = [];
      inspectionReports.forEach((inspection) => {
        console.log("inspection", inspection.templateId);
        templates.push(inspection.templateId);
      });
      dispatch(fetchTemplateByTemplateIdSlice(templates));
    }
  }, [inspectionReports]);

  useEffect(() => {
    if (inspectionReports && Array.isArray(inspectionReports)) {
      let inspectionIds = [];
      inspectionReports.forEach((report) => {
        if (report.inspectionId) {
          inspectionIds.push(report.inspectionId);
        }
      });
      if (inspectionIds.length > 0) {
        dispatch(fetchInspectionDetailsByIds(inspectionIds));
      }
    }
  }, [inspectionReports, dispatch]);

  useEffect(() => {
    if (inspectionReports && Array.isArray(inspectionReports)) {
      const inspectionitems = new Set();

      inspectionReports.forEach((report) => {
        Object.keys(report.reportData).forEach((id) => {
          inspectionitems.add(id);
        });
      });

      console.log("inspectionitems", inspectionitems);

      if (inspectionitems.size > 0) {
        dispatch(fetchInspectionItemsByIdsSlice(Array.from(inspectionitems)));
      }
    }
  }, [inspectionReports]);

  console.log(
    "inspectionReports, selectedTemplate, selectedInspections, selectedItems",
    inspectionReports,
    selectedTemplate,
    selectedInspections,
    selectedProperty,
    selectedItems
  );

  const renderReportItem = ({ item }) => {
    // Find the template for this inspection
    const template = selectedTemplate?.find((t) => t.id === item.templateId);

    // Find the property for this inspection
    const property = selectedProperty?.find((p) => p.id === item.propertyId);

    // Find the inspection details for this inspection
    const inspectionDetails = selectedInspections?.find(
      (i) => i.id === item.inspectionId
    );

    // Find the item IDs for this inspection (from reportData keys)
    const itemIds = item.reportData ? Object.keys(item.reportData) : [];
    // Find the item objects for this inspection
    const items = selectedItems?.filter((i) => itemIds.includes(i.id)) || [];

    // Get additional template items if template has inspection items
    let templateItems = [];
    if (template && template.inspectionItems) {
      templateItems =
        selectedItems?.filter((i) => template.inspectionItems.includes(i.id)) ||
        [];
    }

    // Combine all relevant items
    const allItems = [...items, ...templateItems].filter(
      (item, index, self) => index === self.findIndex((i) => i.id === item.id)
    );

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("InspectionReportDetails", {
            report: item,
            template: template,
            property: property,
            inspectionDetails: inspectionDetails,
            items: allItems,
            reportData: item.reportData,
          })
        }
      >
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportTitle}>
              {item.title ||
                item.inspectionType ||
                template?.name ||
                "Inspection Report"}
            </Text>
            {inspectionDetails?.status && (
              <View
                style={[styles.statusBadge, getStatusBadgeStyle(inspectionDetails?.status)]}
              >
                <Text style={styles.statusBadgeText}>
                  {capitalizeStatus(inspectionDetails?.status)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.reportSubtitle}>
            {property?.name ||
              property?.address ||
              item.propertyName ||
              item.property ||
              "Property Not Found"}
          </Text>
          <Text style={styles.reportDate}>
            {item.date ||
              item.timestampFormatted ||
              new Date(item.timestamp?.seconds * 1000).toLocaleDateString()}
          </Text>
          <Text style={styles.reportTemplate}>
            Template: {template?.name || template?.title || "No Template"}
          </Text>
          <Text style={styles.reportItemsCount}>
            Items: {allItems.length} inspection items
          </Text>
          <View style={styles.reportActionsRow}>
            <TouchableOpacity
              style={styles.pdfButton}
              onPress={() => handlePdfDownload(item)}
            >
              <DownloadIcon width={18} height={18} />

              <Text style={styles.pdfText}>PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => handleChat(item)}
            >
              <ChatIcon width={20} height={20} />

              <Text style={styles.chatText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Helper to capitalize status
  function capitalizeStatus(status) {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  // Helper to get badge style by status
  function getStatusBadgeStyle(status) {
    switch ((status || "").toLowerCase()) {
      case "generated":
        return { backgroundColor: "#E0EDFF" };
      case "new":
        return { backgroundColor: "#D1FAE5" };
      case "scheduled":
        return { backgroundColor: "#F3F4F6" };
      default:
        return { backgroundColor: "#E5E7EB" };
    }
  }

  // Dummy handlers for PDF and Chat
  function handlePdfDownload(item) {
    // TODO: implement actual PDF download logic
    alert("Download PDF for " + (item.title || item.inspectionType));
  }
  function handleChat(item) {
    // TODO: implement actual chat navigation
    alert("Open chat for " + (item.title || item.inspectionType));
  }

  return (
    <View style={styles.container}>
      <InputField
        icon={SearchIcon}
        placeholder="Search reports...."
        onChangeText={(text) => setSearchText(text)}
        containerStyle={styles.mainInputContainer}
        labelStyle={styles.labelStyle}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
      />
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
        >
          <CustomDropdown
            data={propertyData}
            placeholder="All Properties"
            value={selectProperty}
            onSelect={setselectProperty}
            containerStyle={styles.dropdownContainer}
            dropdownStyle={styles.dropdownStyle}
            height={30}
          />
          <CustomDropdown
            data={templateData}
            placeholder="All Templates"
            value={selectTemplate}
            onSelect={setselectTemplate}
            containerStyle={styles.dropdownContainer}
            dropdownStyle={styles.dropdownStyle}
            height={30}
          />
          <CustomDropdown
            data={statusData}
            placeholder="All Status"
            value={selectedStatus}
            onSelect={setSelectedStatus}
            containerStyle={styles.dropdownContainer}
            dropdownStyle={styles.dropdownStyle}
            height={30}
          />
        </ScrollView>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={inspectionReports || []}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id}
          style={styles.flatListStyle}
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: "#888",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  filterContainer: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownContainer: {
    marginRight: 10,
    minWidth: 120,
  },
  dropdownStyle: {
    height: 30,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButton: { display: "none" },
  filterButtonText: { display: "none" },
  dropdownIcon: { display: "none" },
  mainInputContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 0,
  },
  labelStyle: {
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 14,
    color: "#374151",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  inputIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: "#000",
  },
  flatListStyle: {
    flex: 1,
  },
  flatListContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  reportCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  reportSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  reportTemplate: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
    fontWeight: "500",
  },
  reportItemsCount: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  reportActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  pdfButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pdfText: {
    color: "#2563EB",
    fontWeight: "600",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  chatButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderColor:'#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    width: 80,
    height:66
  },
  chatText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 14,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  filterScrollView: {
    flexDirection: "row",
    gap: 10,
  },
});
