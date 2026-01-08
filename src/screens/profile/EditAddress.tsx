import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import Header from '../../component/Header';
import { Fonts } from '../../common/Fonts';
import { Colors } from '../../common/Colors';
import { Utils } from '../../common/Utils';
import { showSuccessToast } from '../../config/Key';
import { MaterialIcons } from '../../common/Vector';

import * as _ADDRESS_SERVICE from '../../services/AddressService';
import * as _PROFILE_SERVICES from '../../services/ProfileServices';

const { height: screenHeight } = Dimensions.get('window');

const EditAddress = (props: any) => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getCustomerAddress();
    }
  }, [isFocused]);

  const getCustomerAddress = async () => {
    try {
      const token = await Utils.getData('_TOKEN');
      if (!token) {
        props.navigation.replace('AuthStack', { screen: 'Login' });
        return;
      }

      const result: any = await _PROFILE_SERVICES.user_profile();
      const data = await result.json();

      if (result.status === 200) {
        setAddresses(data.addresses || []);
      } else {
        showSuccessToast('No Address found', 'error');
      }
    } catch (error) {
      console.log('GET ADDRESS ERROR:', error);
    }
  };

  const editAddress = (address: any) => {
    props.navigation.navigate('AddAddress', {
      isEdit: true,
      addressData: address,
    });
  };

  const updateDefaultAddress = async (addressId: string) => {
    try {
      const result: any = await _ADDRESS_SERVICE.editAddress(addressId, {
        is_default: true,
      });

      if (result.status === 'success') {
        showSuccessToast('Address Successfully Updated', 'success');
        setSelectedAddress(Number(addressId));
      } else {
        showSuccessToast(result.message || 'Update failed', 'error');
      }
    } catch (error) {
      console.log('UPDATE ADDRESS ERROR:', error);
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      const result: any = await _ADDRESS_SERVICE.DeleteAddressByID(addressId);
      if (result.status === 'success') {
        showSuccessToast('Address Successfully Deleted', 'success');
        getCustomerAddress();
      } else {
        showSuccessToast(result.message || 'Delete failed', 'error');
      }
    } catch (error) {
      console.log('DELETE ADDRESS ERROR:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Address" navigation={props.navigation} Is_Tab={false} />

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {addresses.length > 0 && (
          <Text style={styles.sectionTitle}>
            Select your primary address for delivery
          </Text>
        )}

        {addresses.length > 0 ? (
          addresses.map(address => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                selectedAddress === address.id && styles.selectedCard,
              ]}
              onPress={() => updateDefaultAddress(address.id)}
            >
              <View style={styles.addressTypeChip}>
                <Text style={styles.addressTypeText}>
                  {address.address_type}
                </Text>
              </View>

              <Text style={styles.addressText}>
                {address.house_details}, {address.city}, {address.state}
              </Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => editAddress(address)}
                >
                  <MaterialIcons name="edit" size={16} color="#4CAF50" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => deleteAddress(address.id)}
                >
                  <MaterialIcons name="delete" size={16} color="#F44336" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📍</Text>
            <Text style={styles.emptyTitle}>No Addresses Found</Text>
            <Text style={styles.emptySubtitle}>
              You haven't added any delivery addresses yet.
            </Text>

            <TouchableOpacity
              style={styles.addAddressButton}
              onPress={() =>
                props.navigation.navigate('AddAddress', { isEdit: false })
              }
            >
              <Text style={styles.addAddressButtonText}>
                + Add New Address
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {addresses.length > 0 && (
        <LinearGradient
          colors={[Colors.secondaryColor, Colors.primaryColor]}
          style={styles.addAddressBtn}
        >
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('AddAddress', { isEdit: false })
            }
          >
            <Text style={styles.addAddressBtnText}>Add New Address</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </View>
  );
};



export default EditAddress;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  formContainer: {
    flex: 1,
    padding: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.black,
    marginBottom: 20,
  },

  /* ================= Address Card ================= */

  addressCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  selectedCard: {
    borderColor: '#7CB342',
    backgroundColor: '#f8fff8',
    borderWidth: 2,
  },

  addressTypeChip: {
    backgroundColor: '#7CB342',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  addressTypeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Fonts.PoppinsMedium,
  },

  addressText: {
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.textColor,
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },

  /* ================= Actions ================= */

  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },

  editButton: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },

  editButtonText: {
    fontSize: 12,
    fontFamily: Fonts.PoppinsMedium,
    color: '#4CAF50',
  },

  deleteButton: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#F44336',
  },

  deleteButtonText: {
    fontSize: 12,
    fontFamily: Fonts.PoppinsMedium,
    color: '#F44336',
  },

  /* ================= Empty State ================= */

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.black,
    marginBottom: 10,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  
  addAddressButton: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 8,
  },

  addAddressButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
  },

  /* ================= Bottom Button ================= */

  addAddressBtn: {
    margin: 15,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  addAddressBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
  },
});
