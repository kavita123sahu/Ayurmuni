
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Otp: undefined;
  Onboarding: undefined;
  CenterDetail: undefined;
  Splash: undefined;
  GeoLocation : undefined;
  SplashStack: undefined;
  DoctorSelect : any;
  AuthStack: undefined;
  InvoiceScreen : undefined;
  Search: undefined;
  Wakeup:undefined;
  ProductSearch : undefined;
  HomeStack: undefined;
  ConsultationPayment : undefined
  OrderDetails : undefined;
  PaymentSuccessScreen : undefined;
  HealthRecords: undefined;
  HomePage: undefined;
  FriendCall: undefined;
  RatingScreen : undefined;
  CallInviteSystem: undefined;
  ViewAll: undefined;
  WellnessOrder: undefined;
  // VideoPlayer: undefined;
  PackageSelect: undefined;
  GeocodingExample : undefined;
  TabStack: undefined;
  AccessEnable : undefined;
  EditProfile: undefined;
  Profile: undefined;
  QuantitySelector: undefined;
  UpdateAvailable: undefined;
  TimeSlotBooking : undefined;
  MyOrders: undefined;
  MyWishList: undefined;
  SelectSpecialty: any;
  OtpVerify: undefined;
  PatientSelect: any;
  PaymentFlow: undefined;
  PaymentLoadingScreen: undefined;
  TermsConditions: undefined;
  Replacement: undefined;
  PrivacyPolicy: undefined;
  RateShare: undefined;
  AllSpecialty: undefined;
  AboutUs: undefined;
  Consultation: undefined;
  ContactUs: any;
  AddNewPatient: undefined;
  ChildCategories: undefined;
  BookItem: undefined;
  AllBooks: undefined;
  ProductDetail: any;
  Cart: undefined;
  CartScreen: undefined;
  Coupons: undefined;
  EditAddress: undefined;
  PaymentMethods: undefined;
  AddAddress: any;
  TermsAndConditions: any;
  ReplacementAndReturn: any;
  SubSubCategory: any;
  Sub3Category: any;
  Sub4Category: any;
  Sub5Category: any;
  WriteReview: any;
  SellerDetails: any;
  ThankYou: any;
  OrderDetailPage: any;
  ViewPdf: any;
  ReplacementReason: any;
  HealthAssesment : undefined;
};


export type RootBottomParamList = {
    Home: undefined;
    Shop: undefined;
    Consultation: undefined;
    Centers: undefined;
    Profile: undefined;
};

export type AllBooksScreenProps = NativeStackScreenProps<RootStackParamList, 'AllBooks'>
