import { Alert, Text } from "react-native";
import RazorpayCheckout from 'react-native-razorpay';
import { Colors } from "./Colors";
import { BaseUrl, showSuccessToast } from "../config/Key";
import { Styles } from "./Styles";
import *as _ORDER_SERVICE from "../services/OrderService";
import { Utils } from "./Utils";
import { useNavigation } from "@react-navigation/native";

export const RAZORPAY_KEY = 'rzp_test_e12OYY9xlDSzMc'; // Replace with your Razorpay key

// rzp_live_8naXoMbmHqSH2Y
// rzp_test_e12OYY9xlDSzMc
// rzp_live_8naXoMbmHqSH2Y


interface DoctorData {
  id: String,
  name: string;
  specialty: string;
  experience: string;
  specialization: string;
  avatar: string;
  recommendationPercentage: string;
  rating: string;
  consultationFee: string;
  availableTime: string;
  isAssured: boolean;

}

interface HealthConcern {
  id: string;
  title: string;
  icon: string;
  color: string;
}


interface Category {
  id: number;
  name: string;
  icon: any;
}

interface DetoxCenter {
  id: string;
  name: string;
  location: string;
  startingPrice: number;
  rating: number;
  reviews: number;
  image: string;
}

export const flagshipCenters: DetoxCenter[] = [
  {
    id: '1',
    name: 'Detox Center Name 1',
    location: 'Location Name',
    startingPrice: 50000,
    rating: 4.5,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  },
  {
    id: '2',
    name: 'Detox Center Name 2',
    location: 'Location Name',
    startingPrice: 50000,
    rating: 4.7,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
  },
  {
    id: '3',
    name: 'Detox Center Name 3',
    location: 'Location Name',
    startingPrice: 45000,
    rating: 4.3,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
  },
];

export const foodCategories: Category[] = [
  { id: 0, name: 'Diabetes', icon: require('../assets/images/Diabetes.png'), },
  { id: 1, name: 'Heart Care', icon: require('../assets/images/Heart.png') },
  { id: 2, name: 'Stomach care', icon: require('../assets/images/Stomach.png') },
  { id: 3, name: 'Liver Care', icon: require('../assets/images/Liver.png') },
];

export const healthConcerns: HealthConcern[] = [
  {
    id: '1',
    title: 'Diabetes',
    icon: '🩺',
    color: '#E8F5E8',
  },
  {
    id: '2',
    title: 'Heart care',
    icon: '❤️',
    color: '#FFE8E8',
  },
  {
    id: '3',
    title: 'Women\'s Care',
    icon: '👩‍⚕️',
    color: '#FFF0E8',
  },
  {
    id: '4',
    title: 'Liver Care',
    icon: '🫀',
    color: '#E8F0FF',
  },
];


export const topDoctors: DoctorData[] = [
  {
    id: '1',
    name: "Dr. Sarah Smith",
    specialty: "Neurologist",
    experience: "15 years of exp. overall",
    specialization: "Specialist in Brain Surgery",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face",
    recommendationPercentage: "92%",
    rating: "4.8",
    consultationFee: "₹1500",
    availableTime: "2:00 PM Today",
    isAssured: true
  },
  {
    id: '2',
    name: "Dr. Sarah Smith",
    specialty: "Neurologist",
    experience: "15 years of exp. overall",
    specialization: "Specialist in Brain Surgery",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face",
    recommendationPercentage: "92%",
    rating: "4.8",
    consultationFee: "₹1500",
    availableTime: "2:00 PM Today",
    isAssured: true
  },
];

export interface GenderOption {
  id: string;
  label: string;
  value: string;
}

export const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text key={i} style={Styles.star}>
        {i <= rating ? '★' : '☆'}
      </Text>
    );
  }
  return stars;
};

export const genderOptions: GenderOption[] = [
  { id: '1', label: 'Male', value: 'male' },
  { id: '2', label: 'Female', value: 'female' },
  { id: '3', label: 'Others', value: 'others' },
];

export interface PatientData {
  id?: string;
  name: string;
  age: string;
  gender: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NavigationProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
    push: (screen: string, params?: any) => void;
    replace: (screen: string, params?: any) => void;
  };
}

export interface FormFieldProps {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  required?: boolean;
}

export interface CustomTextInputProps extends FormFieldProps {
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  secureTextEntry?: boolean;
}

export interface DropdownTextInputProps extends FormFieldProps {
  onSelect: (item: string) => void;
  options: string[];
  searchable?: boolean;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

export interface FormValidation {
  [key: string]: ValidationRule;
}

export type Gender = 'Male' | 'Female' | 'Other';


export const doctorData = {
  name: "Dr. Sarah Smith",
  specialty: "Neurologist",
  experience: "15",
  specialization: "Specialist in Brain Surgery",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face",
  recommendationPercentage: "92%",
  rating: "4.8",
  consultationFee: "₹1500",
  availableTime: "2:00 PM Today",
  isAssured: true
};
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const paymentMethods = [{ id: 'googlepay', type: 'wallet', name: 'Google Pay', logo: require('../assets/images/google.png'), color: '#4285F4', height: 25, width: 25, bgColor: '#E8F0FE' },
{ id: 'phonepe', type: 'wallet', name: 'PhonePe', height: 25, width: 25, logo: require('../assets/images/phonepay.png'), color: '#5F259F', bgColor: '#F3E5F5' },
{ id: 'paytm', type: 'wallet', name: 'Paytm', height: 16, width: 50, logo: require('../assets/images/paytm.png'), color: '#00BAF2', bgColor: '#E1F5FE' },
{ id: 'upi_id', type: 'upi_id', height: 16, width: 50, name: 'Enter UPI ID', logo: require('../assets/images/UPI.png'), color: '#FF6B00', bgColor: '#FFF3E0' }
];

export const paymentMethods1 = [{ id: 'sbi', type: 'bank', name: 'State Bank of India', number: '**1234', logo: require('../assets/images/SBIlogo.png'), color: '#1976D2', bgColor: '#E3F2FD' },];

export const creditDebitOptions = [{ id: 'sbi_credit', name: 'State Bank of India', number: '**1234', logo: require('../assets/images/SBIlogo.png'), color: '#1976D2' },
{ id: 'sbi_debit', name: 'State Bank of India', number: '**1234', logo: require('../assets/images/SBIlogo.png'), color: '#1976D2' },
{ id: 'add_new_card', name: 'Add a new credit or debit card', isAddNew: true, color: '#4CAF50' }
];

export const moreWaysToPay = [{ id: 'netbanking', name: 'Netbanking', height: 25, width: 25, logo: require('../assets/images/netbanking.png'), color: '#4CAF50' },
{ id: 'cod', height: 25, width: 25, name: 'Cash On Delivery', logo: require('../assets/images/cashDelivery.png'), color: '#FF9800' }
];






