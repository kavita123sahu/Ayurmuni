import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Fonts } from "../../common/Fonts";

/* ================= FILTER BUTTON (INSIDE SAME FILE) ================= */

type FilterButtonProps = {
  title: string;
  filterType: string;
  isActive: boolean;
  onPress: (type: string) => void;
};

const FilterButton: React.FC<FilterButtonProps> = ({
  title,
  filterType,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(filterType)}
      style={[
        styles.filterButton,
        isActive && styles.activeFilterButton,
      ]}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.filterText,
          isActive && styles.activeFilterText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

/* ================= MAIN COMPONENT ================= */

type Props = {
  onViewAllPress?: () => void;
};

const AllCentera: React.FC<Props> = ({ onViewAllPress }) => {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <View style={styles.section}>

      {/* ---------- HEADER ---------- */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Centers</Text>

        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- FILTERS ---------- */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
        contentContainerStyle={styles.filterContentContainer}
      >
        <FilterButton
          title="All Centers"
          filterType="all"
          isActive={activeFilter === "all"}
          onPress={setActiveFilter}
        />

        <FilterButton
          title="Rating 4.0+"
          filterType="rating"
          isActive={activeFilter === "rating"}
          onPress={setActiveFilter}
        />

        <FilterButton
          title="Nearest"
          filterType="nearest"
          isActive={activeFilter === "nearest"}
          onPress={setActiveFilter}
        />

        <FilterButton
          title="Great Offers"
          filterType="offers"
          isActive={activeFilter === "offers"}
          onPress={setActiveFilter}
        />

        <FilterButton
          title="Previously Ordered"
          filterType="ordered"
          isActive={activeFilter === "ordered"}
          onPress={setActiveFilter}
        />
      </ScrollView>
    </View>
  );
};

export default AllCentera;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginTop: 32,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.PoppinsMedium,
    color: "#111827",
  },

  viewAllText: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    color: "#2563EB",
  },

  filterScrollView: {
    marginHorizontal: -16,
  },

  filterContentContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  activeFilterButton: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  filterText: {
    fontSize: 13,
    fontFamily: Fonts.PoppinsMedium,
    color: "#374151",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },
});
