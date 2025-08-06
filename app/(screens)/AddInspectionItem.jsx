import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import InspectionItemCard from "../components/InspectionItemCard";
import SearchIcon from "../assets/icons/search.svg";
import InputField from "../components/ui/InputLabelField";
import { useDispatch, useSelector } from "react-redux";
import { fetchInspectionItems } from "../redux/slices/inspection/inspectionSlice";

const filters = ["All Items", "Exterior", "Interior", "Systems", "Safety"];

export default function AddInspectionItem({ navigation, route }) {
  const [selectedFilter, setSelectedFilter] = useState("All Items");
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { inspectionItems } = useSelector((state) => state.inspection);
  const dispatch = useDispatch();
  const { alreadySelected } = route.params || {};

  useEffect(() => {
    if (alreadySelected) {
      setSelectedItems(alreadySelected);
    }
  }, [alreadySelected]);

  useEffect(() => {
    dispatch(fetchInspectionItems());
  }, []);

  const toggleItemSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleAddItems = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to add.");
      return;
    }
    console.log("Selected Items:", selectedItems);
    navigation.navigate("AddInspectionTemplate", {
      selectedItems: selectedItems,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <InputField
          icon={SearchIcon}
          placeholder="Search Inspection items"
          onChangeText={(text) => setSearchText(text)}
          containerStyle={styles.mainInputContainer}
          labelStyle={styles.labelStyle}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.selectedFilter,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.selectedFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.listContainer}>
          {inspectionItems && inspectionItems.length > 0 ? (
            inspectionItems
              .filter(
                (item) =>
                  selectedFilter === "All Items" ||
                  item.inspectionData?.type === selectedFilter
              )
              .map((item) => {
                const options = item.inspectionData?.options || {};
                const fields = Object.entries(options).map(
                  ([label, value]) => ({
                    label,
                    value,
                  })
                );

                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => toggleItemSelection(item.id)}
                    activeOpacity={0.8}
                    style={{
                      borderWidth: selectedItems.includes(item.id) ? 2 : 0,
                      borderColor: "#2563EB",
                      borderRadius: 12,
                      marginBottom: 10,
                    }}
                  >
                    <InspectionItemCard
                      title={item.inspectionData?.title || ""}
                      description={item.inspectionData?.description || ""}
                      tags={item.tags}
                      isSelected={selectedItems.includes(item.id)}
                      fields={fields}
                    />
                  </TouchableOpacity>
                );
              })
          ) : (
            <Text style={{ textAlign: "center", color: "gray", marginTop: 16 }}>
              No inspection items yet.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddItems}>
          <Text style={styles.addButtonText}>
            Add Selected Items ({selectedItems.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 15,
  },
  filterScroll: {
    marginTop: 10,
    paddingRight: 30,
    paddingLeft: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedFilter: {
    backgroundColor: "#E0ECFF",
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  filterText: {
    color: "#333",
  },
  selectedFilterText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  addButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  mainInputContainer: {
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  labelStyle: {
    fontFamily: "Inter",
    fontWeight: "500",
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
  input: {
    flex: 1,
    height: 50,
    marginLeft: 5,
    color: "#000",
  },
});
