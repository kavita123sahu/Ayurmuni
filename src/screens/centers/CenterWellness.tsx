import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  StatusBar,
  StyleSheet,
} from 'react-native';
import SearchSection from '../../component/SearchSection';
import SearchBar from '../../component/SearchBar';
import { Ionicons } from '../../common/Vector';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import { NavigationProp } from '@react-navigation/native';
import { flagshipCenters } from '../../common/datafile';
import CustomStarRating from '../../component/CustomStarRating';
import { useSelector } from 'react-redux';
import WellnessDetoxCard from './WellnessDetoxCard';
import AllCentera from './AllCentera';

const { width } = Dimensions.get('window');


interface Center {
  id: number;
  name: string;
  location: string;
  price: string;
  rating: number;
  image: string;
  featured?: boolean;
}

interface FilterButtonProps {
  title: string;
  filterType: string;
  onPress?: () => void;
};


interface AppState {
  selectedCenter: Center | null;
  currentFlow: 'centers' | 'detail';
}

interface CenterProps {
  navigation: NavigationProp<any>;
}
const CenterWellness: React.FC<CenterProps> = ({ navigation }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [addressType, setAddressType] = useState('Trending');


  const handleSearch = (text: string) => {
    console.log('Searching for:', text);
  };

  const handleVoicePress = () => {
    console.log('Voice search pressed');
  };
  const [state, setState] = useState<AppState>({
    selectedCenter: null,
    currentFlow: 'centers',

  });

  interface DetoxCenter {
    id: string;
    name: string;
    location: string;
    startingPrice: number;
    rating: number;
    reviews: number;
    image: string;
  }

  interface WellnessCardProps {
    center: DetoxCenter;
    isLarge: Boolean
  }




  const handleBackToCenters = () => {
    setState({
      selectedCenter: null,
      currentFlow: 'centers',

    });
  };


  const allCenters = [
    {
      id: 1,
      name: 'Peaceful Mind Detox Center',
      location: 'Gurgaon, Haryana',
      area: 'Sector 45',
      price: 50000,
      rating: 4.7,
      reviews: 1200,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500',
      orders: 150
    },
    {
      id: 2,
      name: 'Serenity Wellness Retreat',
      location: 'Delhi NCR',
      area: 'Vasant Kunj',
      price: 75000,
      rating: 4.9,
      reviews: 2100,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500',
      orders: 320
    },
    {
      id: 3,
      name: 'Nature Cure Center',
      location: 'Rohtak, Haryana',
      area: 'Model Town',
      price: 35000,
      rating: 4.2,
      reviews: 450,
      image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=500',
      orders: 80
    },
    {
      id: 4,
      name: 'Holistic Healing Hub',
      location: 'Faridabad, Haryana',
      area: 'Sector 15',
      price: 60000,
      rating: 4.5,
      reviews: 890,
      image: 'https://images.unsplash.com/photo-1545289414-1c3d2141487c?w=500',
      orders: 200
    },
    {
      id: 5,
      name: 'Tranquil Waters Detox',
      location: 'Gurgaon, Haryana',
      area: 'DLF Phase 3',
      price: 90000,
      rating: 4.8,
      reviews: 1800,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
      orders: 410
    },
    {
      id: 6,
      name: 'Green Valley Wellness',
      location: 'Panipat, Haryana',
      area: 'GT Road',
      price: 40000,
      rating: 4.0,
      reviews: 320,
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500',
      orders: 95
    }
  ];

  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredCenters, setFilteredCenters] = useState(allCenters);

  // Filter functions
  const applyFilter = (filterType: any) => {
    setActiveFilter(filterType);
    let sorted = [...allCenters];

    switch (filterType) {
      case 'rating':
        sorted = sorted.filter(center => center.rating >= 4.0)
          .sort((a, b) => b.rating - a.rating);
        break;
      case 'nearest':
        sorted = sorted.filter(center => center.location.includes('Haryana'))
          .sort((a, b) => a.price - b.price);
        break;
      case 'offers':
        sorted = sorted.filter(center => center.price < 60000)
          .sort((a, b) => a.price - b.price);
        break;
      case 'ordered':
        sorted = sorted.sort((a, b) => b.orders - a.orders);
        break;
      default:
        sorted = allCenters;
    }

    setFilteredCenters(sorted);
  };

  const FilterButton: React.FC<FilterButtonProps> = ({ title, filterType, onPress }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filterType && styles.filterButtonActive
      ]}
      onPress={() => applyFilter(filterType)}
    >
      <Text style={[
        styles.filterButtonText,
        activeFilter === filterType && styles.filterButtonTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );


 


  const CentersView = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryColor} />
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.heroSection}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=300&fit=crop" }}
            style={styles.heroImage}
          />

          <View style={styles.heroOverlay}>

            <SearchBar placeholder="Search for Destinations"
              onSearch={handleSearch}
              onVoicePress={handleVoicePress}
              value={searchQuery}
              type='wellness'
              showVoiceIcon={false}
              onChangeText={setSearchQuery} />

            <Text style={styles.heroTitle}>Detox. Reconnect. Thrive.</Text>
            <Text style={styles.heroSubtitle}>
              Find your inner peace and restore your natural balance at premier wellness destinations.
            </Text>
          </View>
        </View>

        <View style={styles.searchWrapper}>
          <SearchSection voice="true" placeholder />
        </View>


        <View style={styles.TypeContainer}>

          <TouchableOpacity
            style={[
              styles.addressTypeButton,
              addressType === 'Trending' && styles.activeAddressType,
            ]}

            onPress={() => setAddressType('Trending')}
          >

            <Text
              style={[
                styles.addressTypeText,
                addressType === 'Trending' && styles.activeAddressTypeText,
              ]}
            >
              Trending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addressTypeButton,
              addressType === 'Top Detox Centers' && styles.activeAddressType,
            ]}
            onPress={() => setAddressType('Top Detox Centers')}
          >

            <Text
              style={[
                styles.addressTypeText,
                addressType === 'Top Detox Centers' && styles.activeAddressTypeText,
              ]}
            >
              Top Detox Centers
            </Text>
          </TouchableOpacity>

        </View>

        <View style={styles.section}>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {flagshipCenters.map(center => (

              <WellnessDetoxCard  key={center.id} center={center} isLarge={false} />))
            }
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.bannerContainer} onPress={() => navigation.navigate('CenterDetail')}>
          <Image source={require('../../assets/images/Physicaltherapy.png')} style={{ height: 150, width: '100%', borderRadius: 16, }} resizeMode='contain' />
        </TouchableOpacity>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flagship Detox Centers</Text>
          <View style={styles.centersGrid}>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {flagshipCenters.map(center => (
                <WellnessDetoxCard key={center.id} center={center} isLarge={false} />))
              }
            </ScrollView>
          </View>
        </View>

        {/* All Centers */}
        <AllCentera/>

      </ScrollView>
    </SafeAreaView>
  );



  return (
    <View style={styles.appContainer}>
      {/* {state.currentFlow === 'centers' ? */}
      <CentersView />
      {/* : <DetailView />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  heroSection: { height: 250, position: 'relative' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 15 },
  heroTitle: { fontSize: 28, fontFamily: Fonts.PoppinsSemiBold, color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  heroSubtitle: { fontSize: 16, color: '#FFFFFF', textAlign: 'center', opacity: 0.9, lineHeight: 22 },

  searchWrapper: { paddingHorizontal: 15, marginTop: -30, zIndex: 10 },
  bannerContainer: { paddingHorizontal: 15, marginBottom: 10, marginTop: 10 },
  TypeContainer: { paddingHorizontal: 15, marginBottom: 10, justifyContent: 'space-between', marginTop: 10, width: '100%', flexDirection: 'row' },
  searchIcon: { fontSize: 18, marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#374151' },
  searchButton: { backgroundColor: Colors.primaryColor, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  searchButtonText: { color: '#FFFFFF', fontFamily: Fonts.PoppinsMedium, fontSize: 14 },
  section: { paddingHorizontal: 16, marginTop: 32 },
  sectionTitle: { fontSize: 20, fontFamily: Fonts.PoppinsMedium, color: '#111827', marginBottom: 16 },
  horizontalScroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAllText: { color: Colors.primaryColor, fontSize: 14, fontFamily: Fonts.PoppinsMedium },
  centerCard: { backgroundColor: '#FFFFFF', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, overflow: 'hidden', marginBottom: 16 },
  featuredCard: { flex: 1, marginRight: 12 },
  imageContainer: { height: 120, position: 'relative' },
  featuredImageContainer: { height: 180 },
  centerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heartButton: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  heartIcon: { fontSize: 16, color: '#6B7280' },
  featuredBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  featuredText: { color: '#FFFFFF', fontSize: 10, fontFamily: Fonts.PoppinsMedium },
  cardContent: { padding: 16 },
  centerName: { fontSize: 16, fontFamily: Fonts.PoppinsMedium, color: '#111827', marginBottom: 4 },
  // locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationIcon: { fontSize: 12, marginRight: 4 },
  // locationText: { fontSize: 14, color: '#6B7280' },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#1E1E1E33',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 10,
  },
  ratingPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  // excellentText: { fontSize: 14, color: '#333', marginRight: 8 },
  // reviewsText: { fontSize: 12, color: '#666' },
  // shareButton: { padding: 8 },
  excellentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginRight: 8,
  },
  reviewsText: {
    fontSize: 14,
    color: '#666',
  },
  shareButton: {
    padding: 4,
  },
  starIcon: { fontSize: 14, marginRight: 4 },
  ratingText: { fontSize: 14, color: '#6B7280' },
  priceText: { fontSize: 16, fontFamily: Fonts.PoppinsMedium, color: Colors.primaryColor },
  // Grids
  topCentersGrid: { flexDirection: 'row', marginBottom: 16 },
  rightColumn: { flex: 1 },
  centersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  // Physical Therapy Card
  therapyCard: { backgroundColor: '#F3E8FF', borderRadius: 12, padding: 20, flexDirection: 'row', alignItems: 'center' },
  therapyContent: { flex: 1 },
  therapyTitle: { fontSize: 20, fontFamily: Fonts.PoppinsSemiBold, color: '#111827', marginBottom: 8 },
  therapySubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  therapyButton: { backgroundColor: '#7C3AED', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start' },
  therapyButtonText: { color: '#FFFFFF', fontFamily: Fonts.PoppinsMedium, fontSize: 14 },
  therapyIcon: { width: 60, height: 60, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginLeft: 16 },
  therapyIconText: { fontSize: 30 },
  // All Centers Card
  allCentersCard: { backgroundColor: '#FFFFFF', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, overflow: 'hidden' },
  allCentersImage: { width: '100%', height: 180, resizeMode: 'cover' },
  allCentersContent: { padding: 16 },
  allCentersTitle: { fontSize: 16, fontFamily: Fonts.PoppinsMedium, color: '#111827', marginBottom: 4 },
  allCentersSubtitle: { fontSize: 14, color: '#6B7280' },
  // Detail View
  detailHeader: { backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { padding: 8, marginRight: 12 },
  backIcon: { fontSize: 20, color: '#374151' },
  detailHeaderTitle: { fontSize: 18, fontFamily: Fonts.PoppinsMedium, color: '#111827' },
  detailHeroContainer: { height: 200, position: 'relative' },
  detailHeroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  detailHeartButton: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.9)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  detailContent: { padding: 16 },
  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  detailCenterName: { fontSize: 20, fontFamily: Fonts.PoppinsSemiBold, color: '#111827', marginBottom: 8 },
  detailLocationText: { fontSize: 16, color: '#6B7280', flex: 1 },
  chevronIcon: { fontSize: 16, color: '#9CA3AF' },
  // Dates Section
  datesSection: { marginTop: 24, marginBottom: 20 },
  subsectionTitle: { fontSize: 16, fontFamily: Fonts.PoppinsMedium, color: '#111827', marginBottom: 12 },
  checkInOutRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  checkLabel: { fontSize: 14, color: '#6B7280' },
  checkTime: { fontWeight: '500', color: '#111827' },
  datesRow: { flexDirection: 'row', alignItems: 'center' },
  dateTag: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  dateTagText: { color: '#065F46', fontSize: 12, fontFamily: Fonts.PoppinsMedium },
  guestsContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  guestsIcon: { fontSize: 14, marginRight: 4 },
  guestsText: { fontSize: 14, color: '#6B7280' },
  // Offer Card
  offerCard: { backgroundColor: '#FEF3CD', borderWidth: 1, borderColor: '#F59E0B', borderRadius: 8, padding: 12, marginBottom: 20 },
  offerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  offerDot: { width: 8, height: 8, backgroundColor: '#F59E0B', borderRadius: 4, marginRight: 8 },
  offerTitle: { fontSize: 14, fontFamily: Fonts.PoppinsMedium, color: '#92400E' },
  offerText: { fontSize: 12, color: '#92400E', lineHeight: 16, },
  aboutSection: { marginBottom: 20 },
  aboutText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  amenitiesSection: { marginBottom: 20 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  amenityItem: { width: '30%', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 8 },
  amenityIcon: { width: 24, height: 24, backgroundColor: '#D1D5DB', borderRadius: 12, marginBottom: 4 },
  amenityText: { fontSize: 12, color: '#6B7280' },
  moreAmenitiesText: { color: Colors.primaryColor, fontSize: 14, fontFamily: Fonts.PoppinsMedium },
  // Photos Section
  photosSection: { marginBottom: 20 },
  photosGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  photoItem: { width: '30%', aspectRatio: 1, backgroundColor: '#F3F4F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  detoxCard: { backgroundColor: '#fff', borderRadius: 14, marginRight: 16, width: width / 2.3, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  largeCard: { width: '100%', marginTop: 16 },
  cardImage: { width: '100%', height: 120, resizeMode: 'cover', borderRadius: 15 },

  // ratingBadge: { position: 'absolute', top: 90, left: 8, backgroundColor: '#1E1E1E33', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },

  star: { marginRight: 1 },
  largeCenterName: { fontSize: 18 },
  location: { fontSize: 14, color: '#666', marginBottom: 8 },
  price: { fontSize: 14, color: '#333', fontWeight: '500' },
  ratingSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  cameraIcon: { fontSize: 20 },
  // Similar Section
  similarSection: { marginBottom: 20 },
  similarPlaceholder: { paddingVertical: 32, alignItems: 'center' },
  similarPlaceholderText: { fontSize: 14, color: '#9CA3AF' },
  // Fixed Bottom
  fixedBottom: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  finalPrice: { fontSize: 18, fontFamily: Fonts.PoppinsSemiBold, color: '#111827' },
  priceUnit: { fontSize: 14, color: '#6B7280', marginLeft: 4 },
  bookButton: { backgroundColor: Colors.primaryColor, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  bookButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: Fonts.PoppinsMedium },
  addressTypeContainer: { flexDirection: 'row', marginBottom: 16 },
  addressTypeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 6, width: '48%', borderWidth: 1, borderColor: '#e0e0e0' },
  activeAddressType: { borderColor: Colors.secondaryColor },
  addressTypeIcon: { marginRight: 6 },
  addressTypeText: { color: Colors.textColor, fontSize: 12, fontFamily: Fonts.PoppinsMedium },
  activeAddressTypeText: { color: Colors.secondaryColor, fontSize: 12, fontFamily: Fonts.PoppinsMedium },
  defaultAddressContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  defaultAddressTextContainer: { flex: 1 },
  defaultAddressLabel: { fontSize: 14, fontWeight: '500', color: '#333' },
  defaultAddressSubLabel: { fontSize: 12, color: '#777', marginTop: 2 },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterScrollView: {
    paddingHorizontal: 10,
  },
  filterContentContainer: {
    alignItems: 'center',
    paddingVertical: 5,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },

  mainCardsContainer: {
    padding: 16,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },

  mainImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },



  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  excellentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },

  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },

});
export default CenterWellness;