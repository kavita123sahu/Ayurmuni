import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';


interface WellOrder {
  id: string;
  centerName: string;
  checkIn: string;
  checkOut: string;
  dates: string;
  guests: number;
  program: string;
  features: string[];
  nights: string;
  totalAmount: string;
  status: 'active' | 'previous';
}


interface WellnessCardProps {
  WellnessOrder: WellOrder;
}

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Text key={i} style={styles.star}>★</Text>);
  }
  if (hasHalfStar) {
    stars.push(<Text key="half" style={styles.star}>☆</Text>);
  }
  return stars;
};



const WellnessOrder: React.FC<WellnessCardProps> = ({
  WellnessOrder
}) => (
  <View style={styles.orderCard}>
    <View style={styles.orderHeader}>
      <View style={styles.starsContainer}>
        {renderStars(4)}
      </View>
      <Text style={styles.orderCenterName}>{WellnessOrder.centerName}</Text>
    </View>

    <View style={styles.orderDetails}>
      <Text style={styles.orderDetailText}>Check-In: {WellnessOrder.checkIn} • Check-Out: {WellnessOrder.checkOut}</Text>

      <View style={styles.orderDateGuests}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateIcon}>📅</Text>
          <Text style={styles.dateText}>{WellnessOrder.dates}</Text>
        </View>
        <View style={styles.guestsContainer}>
          <Text style={styles.guestIcon}>👥</Text>
          <Text style={styles.guestText}>{WellnessOrder.guests} Guests</Text>
        </View>
      </View>

      <Text style={styles.programName}>{WellnessOrder.program}</Text>

      <View style={styles.programDetails}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80x60/4CAF50/FFFFFF?text=Yoga' }}
          style={styles.programImage}
        />
        <View style={styles.programInfo}>
          {WellnessOrder.features.map((feature, index) => (
            <Text key={index} style={styles.programFeature}>• {feature}</Text>
          ))}
          <Text style={styles.programNights}>Nights: {WellnessOrder.nights}</Text>
        </View>
      </View>

      <Text style={styles.totalAmount}>Total Amount to be paid: {WellnessOrder.totalAmount}</Text>

      <View style={styles.orderButtons}>
        {WellnessOrder.status === 'active' ? (
          <>
            <TouchableOpacity style={styles.viewInvoiceButton}>
              <Text style={styles.viewInvoiceText}>View Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.viewInvoiceButton}>
              <Text style={styles.viewInvoiceText}>View Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookAgainButton}>
              <Text style={styles.bookAgainText}>Book Again</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  </View>
);




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  doctorExperience: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  doctorInterest: {
    fontSize: 12,
    color: '#888',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingBox: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  ratingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ratingLabel: {
    fontSize: 12,
    color: '#666',
  },
  consultationFee: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  nextAvailable: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  bookButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    color: 'black',
    fontSize: 16,
    marginRight: 2,
  },
  orderCenterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDetails: {
    marginTop: 8,
  },
  orderDetailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  orderDateGuests: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  guestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  guestIcon: {
    marginRight: 4,
  },
  guestText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  programName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  programDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  programImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  programInfo: {
    flex: 1,
  },
  programFeature: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  programNights: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  orderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  viewInvoiceButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewInvoiceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  bookAgainButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookAgainText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  recordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  recordsIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  recordIcon: {
    fontSize: 24,
  },
  recordsSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  recordsSubTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addRecordsButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addRecordsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  previousOrdersText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  productCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productRatingText: {
    fontSize: 8,
    color: '#666',
    marginLeft: 2,
  },
  productQuantity: {
    fontSize: 8,
    color: '#888',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 4,
  },
  productOriginalPrice: {
    fontSize: 10,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  productDiscount: {
    fontSize: 8,
    color: '#f44336',
    fontWeight: '500',
  },
  healthBanner: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  healthBannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  healthIcons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  healthIcon: {
    fontSize: 24,
  },
});

export default WellnessOrder;