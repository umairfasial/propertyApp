import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import IssuesIcon from "../assets/icons/issues.svg";
import ClipboardCheck from "../assets/icons/clipboard-check.svg";
import ClockIcon from "../assets/icons/clock.svg";
import DeleteIcon from "../assets/icons/bin.svg";
import DashboardSection from "../components/DashboardSection";
import CertificateIcon from "../assets/icons/certificate.svg";
import FormIcon from "../assets/icons/form.svg";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
// import PersonPropertyRole from '../components/PersonPropertyRole';
import { fetchManagers, fetchTenants } from "../redux/slices/auth/authSlice";
import {
  deletePropertySlice,
  fetchPropertiesSlice,
} from "../redux/slices/property/propertySlice";
import StorageTestButton from "../components/StorageTestButton";

const PropertyOverView = ({ navigation }) => {
  const [coordinates, setCoordinates] = useState(null);
  const { userData, tenants, managers } = useSelector((state) => state.auth);
  const { properties } = useSelector((state) => state.property);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const route = useRoute();
  const dispatch = useDispatch();
  const { propertyId } = route.params;
  const selectedProperty = properties?.find(
    (property) => property.id === propertyId
  );

  useEffect(() => {
    dispatch(fetchTenants());
    dispatch(fetchManagers());
    dispatch(fetchPropertiesSlice({ userId: userData.uid }));
  }, [userData]);

  return (
    <ScrollView style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        {selectedProperty?.longitude && selectedProperty?.latitude ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedProperty?.latitude,
              longitude: selectedProperty?.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: selectedProperty?.latitude,
                longitude: selectedProperty?.longitude,
              }}
              title={selectedProperty?.address}
            />
          </MapView>
        ) : (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ alignSelf: "center" }}
          />
        )}
      </View>

      {/* Property Info */}
      <View style={styles.propertyInfo}>
        <Text style={styles.address}>{selectedProperty?.propertyName}</Text>
        <Text style={styles.subAddress}>{selectedProperty?.address}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Monthly Income</Text>
            <Text style={styles.value}>
              {selectedProperty?.currency} {selectedProperty?.monthlyIncome}
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Rent Review Date</Text>
            <Text style={styles.dateValue}>
              {moment(selectedProperty?.reviewDate).format("Do MMMM YYYY")}
            </Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.issueBadge}>
            <IssuesIcon width={12} height={12} color="#DC2626" />
            <Text style={styles.badgeIssueText}>2 Issues</Text>
          </View>
          <View style={styles.inspectionBadge}>
            <ClockIcon width={12} height={12} color="#D97706" />
            <Text style={styles.badgeInspectionText}>Inspection Due</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <View style={styles.actionsRow}>
          <DashboardSection
            title="Quick Actions"
            iconsComponent={true}
            items={[
              {
                icon: (
                  <CertificateIcon width={18} height={18} color="#059669" />
                ),
                iconBackground: "#10B98126",
                label: "Certificates",
                clicked: () => {
                  navigation.navigate("Certificate");
                },
              },
              {
                icon: <FormIcon width={18} height={18} color="#2563EB" />,
                iconBackground: "#2563EB24",
                label: "Contract",
                clicked: () => {
                  navigation.navigate("Contract");
                },
              },
              {
                icon: <ClipboardCheck width={18} height={18} color="#8B5CF6" />,
                iconBackground: "#EDE9FE",
                label: "Inspections",
                clicked: () => {
                  navigation.navigate("Inspection");
                },
              },
              {
                icon: <IssuesIcon width={18} height={18} color="#EF4444" />,
                iconBackground: "#FEE2E2",
                label: "View Issues",
                clicked: () => {
                  navigation.navigate("KnowledgeAi");
                },
              },
            ]}
          />
        </View>
      </View>

      {/* Storage Test Button - Testing Firebase SDK v22.4.0 */}
      <StorageTestButton />

      {/* People Section */}
      <View style={styles.peopleSection}>
        {/* Landlord */}
        {/* 
        <PersonPropertyRole
          heading="Landlord"
          name={
            selectedProperty?.userId === userData?.uid && userData?.fullName
          }
          role="Landlord"
          onChangeClick={() =>
            navigation.navigate('AddLandLoard', {
              propertyId: selectedProperty?.id,
            })
          }
          avatarUri={
            selectedProperty?.userId === userData?.uid && userData?.photoUrl
          }
        />

        <PersonPropertyRole
          heading="Manager"
          name={
            selectedProperty?.managerId &&
            managers?.find(man => man.uid === selectedProperty.managerId)
              ?.fullName
          }
          role="Property Manager"
          onChangeClick={() =>
            navigation.navigate('AssignManager', {
              propertyId: selectedProperty?.id,
            })
          }
          avatarUri={
            selectedProperty?.managerId &&
            managers?.find(man => man.uid === selectedProperty.managerId)
              ?.photoUrl
          }
        />
        <PersonPropertyRole
          heading="Current Tenant"
          name={
            selectedProperty?.tenantId &&
            tenants?.find(tan => tan.uid === selectedProperty?.tenantId)
              .fullName
          }
          role={`Since ${selectedProperty?.currentTenant?.startDate}`}
          onChangeClick={() =>
            navigation.navigate('AssignTenants', {
              propertyId: selectedProperty?.id,
            })
          }
          avatarUri={
            selectedProperty?.tenantId &&
            tenants?.find(tan => tan.uid === selectedProperty?.tenantId)
              ?.photoUrl
          }
        /> */}
      </View>

      {/* Edit & Remove Buttons */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("PropertyForm", { propertyId })}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.removeButton} onPress={handleDelete}>
        <DeleteIcon style={styles.deleteIconStyle} />
        {deleteLoader ? (
          <ActivityIndicator color="red" size="small" />
        ) : (
          <Text style={styles.removeButtonText}>Remove Property</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

// Reusable Person Row

const styles = StyleSheet.create({
  mapContainer: {
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 16,
  },
  propertyInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  address: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    fontFamily: "Inter",
    marginBottom: 5,
  },
  subAddress: {
    fontSize: 14,
    fontFamily: "Inter",
    color: "#4B5563",
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  infoBlock: {},
  label: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "#6B7280",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    marginTop: 4,
    color: "#111827",
  },
  dateValue: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "600",
    marginTop: 4,
    color: "#D97706",
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  issueBadge: {
    flexDirection: "row",
    backgroundColor: "#FECACA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
    gap: 4,
  },
  inspectionBadge: {
    flexDirection: "row",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  badgeIssueText: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "#DC2626",
    marginLeft: 4,
  },
  badgeInspectionText: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "#D97706",
    marginLeft: 4,
  },
  quickActions: {
    backgroundColor: "#F9FAFB",
    marginVertical: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1F2937",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 50,
    height: 50,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  peopleSection: {
    paddingHorizontal: 10,
    paddingTop: 8,
    gap: 10,
  },

  addButton: {
    height: 40,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },

  changeText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#3B82F6",
    padding: 14,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  removeButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  deleteIconStyle: {
    width: 15,
    height: 15,
    color: "#EF4444",
    marginRight: 8,
  },
  removeButtonText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default PropertyOverView;
