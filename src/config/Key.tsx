import Toast from "react-native-toast-message";
import { Fonts } from "../common/Fonts";
import { Platform } from "react-native";

export const BaseUrl = {
    url: 'https://clikshop.co.in/api/v1/',
    urlV3: 'https://clikshop.co.in/api/v3/',
    base: 'https://clikshop.co.in/',
    // https://q8f99wg9-8000.inc1.devtunnels.ms/
    base_url: 'https://0rb83pmx-8000.inc1.devtunnels.ms/',
    base_url1: 'https://ayurmuni.com/',
    //  https://pkg5t4tg-8000.inc1.devtunnels.ms/
};


export const Method = {
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
    PUT: 'PUT'
}

export const ZUGOKey = {
    ZEGO_APP_ID: '712416091',
    ZEGO_APP_SIGN: 'c6de6e9ebf00826ca6a1834aaf6db203e722d67f5976cb9ede3f023db73232e8'
}

// export const Key = {`
//     GOOGLE_MAPS_API_KEY: 'AIzaSyD1b9d3g4f8a5e6f7g8h9i0j1k2l3m4n5o',
//     STRIPE_PUBLISHABLE_KEY: 'pk_test_12345',
//     RAZORPAY_KEY: 'rzp_test_12345',
//     FIREBASE_API_KEY: 'AIzaSyD1b9d3g4f8a5e6f7g8h9i0j1k2l3m4n5o',
//     FIREBASE_AUTH_DOMAIN: 'your-app.firebaseapp.com',
// };

export interface ApiResponse {
    status_code: number;
    message: string;
    status: string;
    is_new_user?: boolean;
    user_id?: string
    // data?: any;
}

export const showSuccessToast = (message: string, type: string) => {
    Toast.show({
        type: type,
        text2: message,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: Platform.OS === 'ios' ? 40 : 100,
        text2Style: { textAlign: 'center', fontFamily: Fonts.PoppinsMedium, fontSize: 12, color: type === 'success' ? 'green' : 'red' },

    });
}


export const getExpectedDeliveryDate = (rangeStr: string) => {
    const [day, month] = rangeStr.split("–")[0].trim().split(" "); // "28 Sep"
    const year = new Date().getFullYear();

    const months: any = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const date = new Date(year, months[month], parseInt(day));

    return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
}



