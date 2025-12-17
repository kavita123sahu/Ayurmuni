
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../component/Header';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../common/Colors';

interface OrderItem {
  id: string;
  name: string;
  rating: number;
  image: string;
}

interface OrderDetailsProps {
  orderStatus: 'delivered' | 'shipped' | 'processing';
  orderNumber: string;
  orderDate: string;
  deliveryDate: string;
  items: OrderItem[];
  deliveryAddress: string;
  billingInfo: {
    itemTotal: number;
    deliveryCharges: number;
    platformFee: number;
    grandTotal: number;
  };
}

const OrderDetailsScreen = () => {

  const dataObject ={
  
  orderStatus :'delivered',
  orderNumber : '#12345780',
  orderDate : 'April 1st, 2025',
  deliveryDate : '4th April',
  items : [
    {
      id: '1',
      name: 'Siddha Cure Diabetes Go Sugar...',
      rating: 4.5,
      image: 'https://via.placeholder.com/60x60/4CAF50/white?text=Med'
    }
  ],

  deliveryAddress : '3rd Floor, Tower 3A, Sec 76A, DLF Corporate Greens, Dhartul Expressway, Gurugram, Haryana 122004, IN',
  billingInfo : {
    itemTotal: 735,
    deliveryCharges: 0,
    platformFee: 5,
    grandTotal: 740
  }

}

  const getStatusIcon = () => {
    switch (dataObject?.orderStatus) {
      case 'delivered':
        return <Icon name="check-circle" size={24} color="white" />;
      case 'shipped':
        return <View style={styles.loadingIcon} />;
      default:
        return <View style={styles.pendingIcon} />;
    }
  };


  const getStatusText = () => {
    switch (dataObject?.orderStatus) {
      case 'delivered':
        return 'Delivered Successfully';
      case 'shipped':
        return 'Order Shipped';
      default:
        return 'Processing';
    }
  };

  const getStatusSubtext = () => {
    switch (dataObject?.orderStatus) {
      case 'delivered':
        return `Delivered on ${dataObject?.deliveryDate}`;
      case 'shipped':
        return `Expected Delivery on ${dataObject?.deliveryDate}`;
      default:
        return 'Order is being processed';
    }
  };

  const renderProgressBar = () => {
    const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
    const currentStep = dataObject?.orderStatus === 'shipped' ? 3 : dataObject?.orderStatus === 'delivered' ? 2 : 1;

    return (
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.progressStep}>
            <View style={[
              styles.progressDot,
              index <= currentStep ? styles.progressDotActive : styles.progressDotInactive
            ]} />

            {index < steps.length - 1 && (
              <View style={[
                styles.progressLine,
                index < currentStep ? styles.progressLineActive : styles.progressLineInactive
              ]} />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (

    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        <Header title='Order Details' Is_Tab={false} />

        <View style={styles.orderCard}>
          <View style={styles.statusIcon}>
            {getStatusIcon()}
          </View>
          <Text style={styles.statusTitle}>{getStatusText()}</Text>
          <View style={styles.statusCard}>
            <Text style={styles.statusSubtitle}>{getStatusSubtext()}</Text>

            {renderProgressBar()}

            {/* <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.viewInvoiceBtn}>
              <Text style={styles.viewInvoiceText}>View Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reorderBtn}>
              <Text style={styles.reorderText}>
                {orderStatus === 'delivered' ? 'Reorder' : 'Cancel Order'}
              </Text>
            </TouchableOpacity>
          </View> */}

            <View style={styles.actionButtons}>

              <LinearGradient style={styles.invoiceButton} colors={[Colors.primaryColor, Colors.secondaryColor]}>
                <TouchableOpacity style={styles.fullAreaButton}>
                  <Text style={styles.invoiceButtonText}>View Invoice</Text>
                </TouchableOpacity>
              </LinearGradient>

              <View style={styles.buttonDivider} />

              <LinearGradient
                colors={[Colors.secondaryColor, Colors.primaryColor]}
                style={[styles.actionButton]}
              >
                <TouchableOpacity
                  // onPress={() => showReorder ? "again" : CancleOrder(order.id)}
                  style={styles.fullAreaButton}
                >
                  <Text style={[styles.actionButtonText]}>

                    {dataObject?.orderStatus === 'delivered' ? 'Reorder' : 'Cancel Order'}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>



          {/* Items Ordered */}
          <View style={styles.statusCard}>
            <Text style={styles.sectionTitle}>Items Ordered</Text>
            {dataObject?.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.ratingRow}>
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="star"
                        size={12}
                        color={i < Math.floor(item.rating) ? "#4CAF50" : "#E0E0E0"}
                      />
                    ))}
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.sectionTitle}>Billing Summary</Text>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Item total Price</Text>
              <Text style={styles.billingValue}>Total price</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>₹{dataObject?.billingInfo.itemTotal}</Text>
              <Text style={styles.billingValue}>₹{dataObject?.billingInfo.itemTotal}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Delivery charges</Text>
              <Text style={styles.billingValue}>Delivery price</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Platform Fee</Text>
              <Text style={styles.billingValue}>Platform price</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>₹{dataObject?.billingInfo.deliveryCharges}</Text>
              <Text style={styles.billingValue}>₹{dataObject?.billingInfo.platformFee}</Text>
            </View>
            <View style={[styles.billingRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalLabel}>Grand Total Price</Text>
            </View>
            <View style={[styles.billingRow, styles.totalRow]}>
              <Text style={styles.totalValue}>₹{dataObject?.billingInfo.grandTotal}</Text>
              <Text style={styles.totalValue}>₹{dataObject?.billingInfo.grandTotal}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Payment</Text>
              <Text style={styles.billingValue}>Online</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.orderAgainBtn}>
            <Text style={styles.orderAgainText}>Order again</Text>
          </TouchableOpacity>

          <View style={styles.statusCard}>
            <Icon name="help-outline" size={20} color="#4CAF50" />
            <Text style={styles.helpText}>Need help with your order ?</Text>
            <TouchableOpacity>
              <Text style={styles.contactLink}>Contact Us</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.sectionTitle}>Order Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Delivering to Jatin</Text>
            </View>
            <Text style={styles.addressText}>{dataObject?.deliveryAddress}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order ID</Text>
              <Text style={styles.infoValue}>{dataObject?.orderNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order date</Text>
              <Text style={styles.infoValue}>{dataObject?.orderDate}</Text>
            </View>
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 10,
    padding: 20,
    elevation: 1,

    shadowRadius: 4,
  },
  orderCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
  },

  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },

  loadingIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'white',
    borderTopColor: 'transparent',
  },
  pendingIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    opacity: 0.7,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressDotActive: {
    backgroundColor: '#4CAF50',
  },
  progressDotInactive: {
    backgroundColor: '#E0E0E0',
  },
  progressLine: {
    width: 40,
    height: 2,
  },
  progressLineActive: {
    backgroundColor: '#4CAF50',
  },
  progressLineInactive: {
    backgroundColor: '#E0E0E0',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  invoiceButton: {
    flex: 1,
    paddingVertical: 10,
    // backgroundColor: '#4CAF50',
    alignItems: 'center',
    borderBottomLeftRadius: 12,
  },
  invoiceButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDivider: {
    width: 1,
    backgroundColor: '#fff',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomRightRadius: 12,
  },
  fullAreaButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  cancelButton: {
    backgroundColor: '#4CAF50',
  },
  reorderButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#fff',
  },
  reorderButtonText: {
    color: '#fff',
  },
  viewInvoiceBtn: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewInvoiceText: {
    color: 'white',
    fontWeight: '600',
  },
  reorderBtn: {
    flex: 1,
    backgroundColor: '#E8F5E8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reorderText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  itemsSection: {
    marginBottom: 24,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  billingSection: {
    marginBottom: 24,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billingLabel: {
    fontSize: 14,
    color: '#666',
  },
  billingValue: {
    fontSize: 14,
    color: '#666',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderAgainBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  orderAgainText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  helpText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  contactLink: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  orderInfoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
});

export default OrderDetailsScreen;
