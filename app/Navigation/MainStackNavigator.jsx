import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TabsNavigator } from "./TabsNavigator";
import Notification from "../(screens)/Notification";
import Certificate from "../(screens)/Certificate";
import PropertyForm from "../(screens)/PropertyForm";
import PropertyInspection from "../(screens)/PropertyInspection";
import ReportIssue from "../(screens)/ReportIssue";
import KnowledgeAi from "../(screens)/KnowledgeAi";
import SubscriptionPlan from "../(screens)/SubscriptionPlan";
import { Text, TouchableOpacity, View } from "react-native";
import AddCertificate from "../(screens)/AddCertificate";

import Plus from "../assets/icons/plus.svg";
import Contract from "../(screens)/Contract";
import Inspection from "../(screens)/Inspection";
import ChatPage from "../(screens)/ChatPage";
import ReportChat from "../(screens)/ReportChat";
import ChatHistory from "../(screens)/ChatHistory";
import AddContract from "../(screens)/AddContract";
import AssignManager from "../(screens)/AssignManagerForm";
import PropertyOverView from "../(screens)/PropertyOverView";
import AssignTenants from "../(screens)/AssignTenant";
import AddContractForm from "../(screens)/AddContractForm";
import AddLandLoard from "../(screens)/AddLandLoard";
import AddInspectionTemplate from "../(screens)/AddInspectionTemplate";
import AddInspectionItem from "../(screens)/AddInspectionItem";
import NewInspectionData from "../(screens)/NewInspectionData";
import ScheduleInspection from "../(screens)/ScheduleInspection";
import InsepctionChecklist from "../(screens)/InsepctionChecklist";
import InspectionReport from "../(screens)/InspectionReport";
import InspectionTemplatesList from "../(screens)/InspectionTemplatesList";
import InspectionReportDetails from "../(screens)/InspectionReportDetails";

const Stack = createNativeStackNavigator();

export function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        options={{ headerShown: false }}
        component={TabsNavigator}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Notifications
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="Certificate"
        component={Certificate}
        options={({ navigation }) => ({
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Certificates
              </Text>
            </View>
          ),
          headerBackTitleVisible: false,

          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("AddCertificate")}
              style={{
                backgroundColor: "#2563eb",
                width: 160,
                height: 40,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                borderRadius: 6,
              }}
            >
              <Plus
                width={14}
                height={16}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: "white",
                  fontFamily: "Inter",
                }}
              >
                Add Certificate
              </Text>
            </TouchableOpacity>
          ),
          headerRightContainerStyle: {
            marginRight: 8,
          },
        })}
      />

      <Stack.Screen
        name="PropertyForm"
        component={PropertyForm}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20, fontWeight: "700" }}>
                Property Details
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="PropertyInspection"
        component={PropertyInspection}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Property Inspection
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="InsepctionChecklist"
        component={InsepctionChecklist}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Inspection Checklist
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="AddInspectionTemplate"
        component={AddInspectionTemplate}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                New Inspection Template
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="AddInspectionItem"
        component={AddInspectionItem}
        options={({ navigation }) => ({
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Add Inspection Item
              </Text>
            </View>
          ),
          headerBackTitleVisible: false,

          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("NewInspectionData")}
            >
              <Text
                style={{
                  color: "#2563EB",
                  fontFamily: "Inter",
                  fontWeight: "600",
                  marginRight: 0,
                }}
              >
                Add New Item
              </Text>
            </TouchableOpacity>
          ),

          headerRightContainerStyle: {
            marginRight: 0,
          },
          headerLeftContainerStyle: {
            marginLeft: 0,
          },
        })}
      />

      <Stack.Screen
        name="NewInspectionData"
        component={NewInspectionData}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                New Inspection Item
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="InspectionReport"
        component={InspectionReport}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Inspection Reports
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="InspectionReportDetails"
        component={InspectionReportDetails}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Inspection Report
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="ReportIssue"
        component={ReportIssue}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Report an Issue
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="KnowledgeAi"
        component={KnowledgeAi}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Knowledge AI
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="SubscriptionPlan"
        component={SubscriptionPlan}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Subscription Plans
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="AddCertificate"
        component={AddCertificate}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Property Certificates
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="AddContract"
        component={AddContract}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Contract
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="Contract"
        component={Contract}
        options={({ navigation }) => ({
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Contracts
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AddContractForm");
              }}
              style={{
                width: 140,
                height: 40,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "flex-end",
                borderRadius: 6,
              }}
            >
              <Plus
                width={20}
                height={20}
                color="#000"
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerRightContainerStyle: {
            paddingRight: 16,
          },
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        })}
      />

      <Stack.Screen
        name="Inspection"
        component={Inspection}
        options={({ navigation }) => ({
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Inspection Templates
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AddInspectionTemplate");
              }}
              style={{
                backgroundColor: "#2563eb",
                width: 80,
                height: 40,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                borderRadius: 6,
              }}
            >
              <Plus
                width={14}
                height={16}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: "white", fontWeight: "bold" }}>Add</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: "left", // Keep this to ensure headerTitle is left aligned
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerRightContainerStyle: {
            paddingRight: 16,
          },
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        })}
      />

      <Stack.Screen
        name="ScheduleInspection"
        component={ScheduleInspection}
        options={({ navigation }) => ({
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Schedule Inspection
              </Text>
            </View>
          ),
        })}
      />

      <Stack.Screen
        name="ChatPage"
        component={ChatPage}
        options={({ route, navigation }) => ({
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "black" }}>
                {route.params?.title || "Chat"}
              </Text>
            </View>
          ),
          headerTitleAlign: "left", // Ensure headerTitle is left aligned
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerBackTitleVisible: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ReportChat");
              }}
              style={{
                marginRight: 0,
                backgroundColor: "#DC2626",
                paddingHorizontal: 16,
                height: 36,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "white", fontWeight: "500", fontSize: 14 }}>
                Report
              </Text>
            </TouchableOpacity>
          ),
          headerRightContainerStyle: {
            paddingRight: 16,
          },
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        })}
      />

      <Stack.Screen
        name="ReportChat"
        component={ReportChat}
        options={() => ({
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "black" }}>
                Report Chat
              </Text>
            </View>
          ),
          headerTitleAlign: "left", // Ensure headerTitle is left aligned
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerBackTitleVisible: false,
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        })}
      />

      <Stack.Screen
        name="ChatHistory"
        component={ChatHistory}
        options={() => ({
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "black" }}>
                Chat History
              </Text>
            </View>
          ),
          headerTitleAlign: "left", // Ensure headerTitle is left aligned
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerBackTitleVisible: false,
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        })}
      />

      <Stack.Screen
        name="PropertyOverView"
        component={PropertyOverView}
        options={() => ({
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "black" }}>
                Property Overview
              </Text>
            </View>
          ),
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        })}
      />
      <Stack.Screen
        name="AssignManager"
        component={AssignManager}
        options={({ navigation, route }) => {
          const { propertyId, next } = route.params;
          return {
            headerTitle: () => (
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "700", color: "black" }}
                >
                  Assign Property Manager
                </Text>
              </View>
            ),
            headerBackTitleVisible: false,
            headerLeft: () => null,
            headerBackButtonMenuEnabled: false,
            headerBackVisible: !!!next,
            headerRight: () =>
              next && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AssignTenants", {
                      propertyId,
                      next: true,
                    })
                  }
                >
                  <Text
                    style={{ color: "#007AFF", fontSize: 16, marginRight: 16 }}
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
              ),
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerLeftContainerStyle: {
              paddingLeft: 16,
            },
          };
        }}
      />

      <Stack.Screen
        name="AssignTenants"
        component={AssignTenants}
        options={({ navigation, route }) => {
          const { propertyId, next } = route.params;
          return {
            headerTitle: () => (
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "700", color: "black" }}
                >
                  Invite Tenants
                </Text>
              </View>
            ),
            headerLeft: () => null,
            headerBackButtonMenuEnabled: false,
            headerBackVisible: !!!next,
            headerBackTitleVisible: false,
            headerRight: () =>
              next && (
                <TouchableOpacity
                  onPress={() =>
                    propertyId && navigation.navigate("Properties")
                  }
                  style={{
                    marginRight: 16,
                  }}
                >
                  <Text
                    style={{
                      color: "#007AFF",
                      fontSize: 16,
                    }}
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
              ),
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerLeftContainerStyle: {
              paddingLeft: 16,
            },
          };
        }}
      />

      <Stack.Screen
        name="AddLandLoard"
        component={AddLandLoard}
        options={() => {
          return {
            headerTitle: () => (
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "700", color: "black" }}
                >
                  Assign Landloard
                </Text>
              </View>
            ),
            headerLeft: () => null,
            headerBackButtonMenuEnabled: false,
            headerBackVisible: true,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerLeftContainerStyle: {
              paddingLeft: 16,
            },
          };
        }}
      />

      <Stack.Screen
        name="AddContractForm"
        component={AddContractForm}
        options={() => ({
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "black" }}>
                Add Contract Form
              </Text>
            </View>
          ),
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        })}
      />

      <Stack.Screen
        name="InspectionTemplatesList"
        component={InspectionTemplatesList}
        options={({ navigation }) => ({
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
              >
                Inspection Templates
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AddInspectionTemplate");
              }}
              style={{
                backgroundColor: "#2563eb",
                width: 80,
                height: 40,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                borderRadius: 6,
              }}
            >
              <Plus
                width={14}
                height={16}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: "white", fontWeight: "bold" }}>Add</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: "left", // Keep this to ensure headerTitle is left aligned
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerRightContainerStyle: {
            paddingRight: 16,
          },
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        })}
      />
    </Stack.Navigator>
  );
}
