import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import PersonRow from "../components/PersonRow"; // adjust the path if needed
import BuildingIcon from "../assets/icons/properties.svg";
import SearchIcon from "../assets/icons/search.svg";
import InputField from "../components/ui/InputLabelField";
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import {
  fetchLandLoard,
  fetchManagers,
  fetchTenants,
} from "../redux/slices/auth/authSlice";
import { addPropertyTenant } from "../redux/slices/property/propertySlice";
import { ActivityIndicator } from "react-native";
import CheckBox from "react-native-check-box";
import { Dropdown } from "react-native-element-dropdown";
import MailIcon from "../assets/icons/email.svg";
import PhoneIcon from "../assets/icons/phone.svg";
import PlaneIcon from "../assets/icons/plane.svg";
import PropertiesIcon from "../assets/icons/properties.svg";

export default function AddLandLoard({ navigation }) {
  const { properties } = useSelector((state) => state.property);
  const { landloards } = useSelector((state) => state.auth);
  const route = useRoute();
  const dispatch = useDispatch();
  const { propertyId, next } = route.params;
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sendViaBoth, setSendViaBoth] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(fetchLandLoard());
  }, [selectedProperty]);
  useEffect(() => {
    if (propertyId) {
      setSelectedProperty(propertyId);
    }
  }, [propertyId]);

  const handleManagerClick = (tenantId) => {
    setLoading(true);
    console.log("handleManagerClick", tenantId);
    dispatch(addPropertyTenant({ tenantId, propertyId })).then(() => {
      setLoading(false);
      if (next) {
        navigation.navigate("Properties");
      }
    });
  };

  const filteredLandlords = landloards?.filter((landloard) =>
    landloard.fullName.toLowerCase().includes(searchText.toLowerCase())
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
            <Dropdown
              style={styles.dropdown}
              data={properties.map((property) => ({
                label: property.propertyName,
                value: property.id,
              }))}
              labelField="label"
              valueField="value"
              placeholder="Select Property"
              value={selectedProperty}
              onChange={(item) => {
                setSelectedProperty(item.value);
              }}
              renderLeftIcon={() => (
                <PropertiesIcon
                  width={15}
                  height={15}
                  color="#2563EB"
                  style={{ marginRight: 8 }}
                />
              )}
            />
          </View>

          <InputField
            icon={SearchIcon}
            placeholder="Search landloards...."
            onChangeText={(text) => setSearchText(text)}
            containerStyle={styles.mainInputContainer}
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />

          <Text style={styles.availableManagersTitle}>Available Landloard</Text>
          {filteredLandlords?.length > 0 ? (
            filteredLandlords?.map((landloard) => (
              <View style={{ padding: 10 }}>
                <PersonRow
                  key={landloard.uid}
                  name={landloard.fullName}
                  avatarUri={landloard.photoUrl}
                  showAssignButton={true}
                  onClick={() => handleManagerClick(landloard.uid)}
                />
              </View>
            ))
          ) : (
            <View
              style={[
                styles.labelStyle,
                {
                  flex: 1,
                  padding: 10,
                  alignItems: "center",
                },
              ]}
            >
              <Text>No Landloard Found</Text>
            </View>
          )}

          <View style={styles.card}>
            <View style={styles.inputContainers}>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                keyboardType="email-address"
                placeholderTextColor="#ADAEBC"
                value={email}
                onChangeText={setEmail}
              />
              <MailIcon style={styles.iconPlaceholder} />
            </View>

            <View style={styles.inputContainers}>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor="#ADAEBC"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <PhoneIcon style={styles.iconPlaceholder} />
            </View>

            <View style={styles.checkboxContainer}>
              <CheckBox
                value={sendViaBoth}
                isChecked={sendViaBoth}
                onClick={() => {
                  setSendViaBoth(!sendViaBoth);
                }}
                checkBoxColor={sendViaBoth ? "#007bff" : "#ccc"}
              />
              <Text style={styles.checkboxLabel}>
                Send invitation via both email & SMS
              </Text>
            </View>

            <TouchableOpacity style={styles.sendButton}>
              <PlaneIcon style={styles.sendIconPlaceholder} />
              <Text style={styles.sendButtonText}>Send Invitation</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  propertyCard: {
    backgroundColor: "#ffff",
    padding: 16,
    marginBottom: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  propertyAddress: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  mainInputContainer: {
    marginBottom: 10,
    paddingHorizontal: 16,
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
    marginLeft: 20,
    color: "#000",
    marginLeft: 5,
  },
  searchInput: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  availableManagersTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  inviteBox: {
    marginTop: 24,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
  },
  inviteTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
  },
  emailInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  sendInvitationButton: {
    backgroundColor: "#10B981",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  sendInvitationButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 15,
  },
  inputContainers: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#ffff",
  },

  iconPlaceholder: {
    width: 20,
    height: 20,
    color: "#9CA3AF",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "#4B5563",
    fontSize: 14,
    fontFamily: "Inter",
  },
  sendButton: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIconPlaceholder: {
    width: 16,
    height: 16,
    color: "#fff",
    marginRight: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
