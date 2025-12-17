declare module 'react-native-razorpay' {
  export interface RazorpayOptions {
    description?: string;
    image?: string;
    currency?: string;
    key: string;
    amount: number | string;
    name?: string;
    order_id?: string;
    prefill?: {
      email?: string;
      contact?: string;
      name?: string;
    };
    
    notes?: { [key: string]: string };
    theme?: {
      color?: string;
    };

    modal?: {
      backdropclose?: boolean;
      escape?: boolean;
      handleback?: boolean;
      confirm_close?: boolean;
    };
    method?: {
      netbanking?: boolean;
      card?: boolean;
      wallet?: boolean;
      upi?: boolean;
      emi?: boolean;
    };
  }

  export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }

  export interface RazorpayError {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: { [key: string]: string };
  }

  export default class RazorpayCheckout {
    static open(options: RazorpayOptions): Promise<RazorpayResponse>;
  }

  export interface CheckoutOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
        // emi wallet netbanking paytm phonepe google pay upicard 
        method?: string;
    };
    notes?: Record<string | number, string>;
    theme?: {
        hide_topbar?: boolean;
        color?: string;
        backdrop_color?: string;
    };
    modal?: {
        backdropclose?: boolean;
        escape?: boolean;
        handleback?: boolean;
        confirm_close?: boolean;
        ondismiss?: () => void;
        animation?: boolean;
    };
    subscription_id?: string;
    subscription_card_change?: boolean;
    recurring?: boolean;
    callback_url?: string;
    redirect?: boolean;
    customer_id?: string;
    timeout?: number;
    remember_customer?: boolean;
    readonly?: {
        contact?: boolean;
        email?: boolean;
        name?: boolean;
    };
    hidden?: {
        contact?: boolean;
        email?: boolean;
    };
    send_sms_hash?: boolean;
    allow_rotation?: boolean;
    retry?: {
        enabled: boolean;
        max_count: number;
    };
    config?: {
        display: {
            language: "en" | "ben" | "hi" | "mar" | "guj" | "tam" | "tel";
        };
    };
}
}