import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Fonts } from "../../common/Fonts";

/* ================= FILTER BUTTON ================= */

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

  const centers = [
    {
      id: 1,
      image: require("./../../assets/images/Centers1.png"),
      rating: "4.7",
      reviews: "1k Ratings",
      name: "Detox Center Name",
      address: "Address | Area Name",
      city: "City Name",
      price: "₹ 50,000",
    },
    {
      id: 2,
      image: require("./../../assets/images/Centers2.png"),
      rating: "4.7",
      reviews: "1k Ratings",
      name: "Detox Center Name",
      address: "Address | Area Name",
      city: "City Name",
      price: "₹ 50,000",
    },
  ];

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
        <FilterButton title="All Centers" filterType="all" isActive={activeFilter === "all"} onPress={setActiveFilter} />
        <FilterButton title="Rating 4.0+" filterType="rating" isActive={activeFilter === "rating"} onPress={setActiveFilter} />
        <FilterButton title="Nearest" filterType="nearest" isActive={activeFilter === "nearest"} onPress={setActiveFilter} />
        <FilterButton title="Great Offers" filterType="offers" isActive={activeFilter === "offers"} onPress={setActiveFilter} />
        <FilterButton title="Previously Ordered" filterType="ordered" isActive={activeFilter === "ordered"} onPress={setActiveFilter} />
      </ScrollView>

      {/* ---------- CENTER CARDS ---------- */}
      <View style={styles.cardList}>
        {centers.map((item) => (
          <View key={item.id} style={styles.card}>

            {/* IMAGE */}
            <Image source={item.image} style={styles.cardImage} />

            {/* CONTENT */}
            <View style={styles.cardContent}>

              {/* RATING + SHARE ROW */}
              <View style={styles.topRow}>
                <View style={styles.ratingRow}>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>★ {item.rating}</Text>
                  </View>
                  <Text style={styles.reviewText}>
                    Excellent ({item.reviews})
                  </Text>
                </View>

                {/* SHARE BUTTON (RIGHT SIDE) */}
                <TouchableOpacity style={styles.shareButton}>
                  <Image
                    source={require("./../../assets/images/shareCenter.png")}
                    style={styles.shareImage}
                  />
                </TouchableOpacity>
              </View>

              {/* NAME */}
              <Text style={styles.centerName}>{item.name}</Text>

              {/* ADDRESS */}
              <Text style={styles.addressText}>
                {item.address} | {item.city}
              </Text>

              {/* PRICE */}
              <View style={styles.priceRow}>
                <Text style={styles.startFrom}>Starts Form:</Text>
                <Text style={styles.priceText}>{item.price}</Text>
              </View>

            </View>
          </View>
        ))}
      </View>

    </View>
  );
};

export default AllCentera;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
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
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },

  filterText: {
    fontSize: 13,
    fontFamily: Fonts.PoppinsMedium,
    color: "#374151",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  /* ---------- CARD ---------- */

  cardList: {
    marginTop: 16,
    gap: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
  },

  cardImage: {
    width: "100%",
    height: 210,
  },

  cardContent: {
    padding: 14,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  ratingBadge: {
    backgroundColor: "#FACC15",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  ratingText: {
    fontSize: 12,
    fontFamily: Fonts.PoppinsMedium,
    color: "#f6f6f8ff",
  },

  reviewText: {
    fontSize: 12,
    fontFamily: Fonts.PoppinsRegular,
    color: "#374151",
  },

  shareButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  shareImage: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },

  centerName: {
    fontSize: 15,
    fontFamily: Fonts.PoppinsMedium,
    color: "#111827",
    marginBottom: 4,
  },

  addressText: {
    fontSize: 13,
    fontFamily: Fonts.PoppinsRegular,
    color: "#6B7280",
    marginBottom: 10,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  startFrom: {
    fontSize: 13,
    fontFamily: Fonts.PoppinsRegular,
    color: "#6B7280",
  },

  priceText: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
    color: "#111827",
  },
});

