// InvoiceScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, SafeAreaView, } from 'react-native';
import { Fonts } from '../../common/Fonts';
import { Colors } from '../../common/Colors';


const InvoiceScreen = ({ route }: any) => {
  const invoiceData = {
    invoiceNo: "INV-2025-001",
    date: "27 Sep 2025",
    dueDate: "10 Oct 2025",
    customer: "Kavita Sahu",
    address: "MG Road, Koramangala\nBangalore, Karnataka 560034",
    phone: "+91 98765 43210",
    email: "kavita.sahu@email.com",
    items: [
      { name: "Fresh Milk 1L", qty: 2, price: 50, total: 100 },
      { name: "Greek Curd 500g", qty: 1, price: 40, total: 40 },
      { name: "Paneer 250g", qty: 1, price: 80, total: 80 },
    ],
    subtotal: 220,
    tax: 22, // 10%
    discount: 10,
    total: 232,
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.companyName}>FreshMart Store</Text>
        <Text style={styles.companyDetails}>
          Shop No. 15, Gandhi Nagar{'\n'}
          Bangalore, India - 560001{'\n'}
          GST: 29ABCDE1234F1Z5
        </Text>
      </View>
      <View style={styles.invoiceBadge}>
        <Text style={styles.invoiceLabel}>INVOICE</Text>
      </View>
    </View>
  );

  const renderInvoiceDetails = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.detailsRow}>
        <View style={styles.detailsLeft}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Invoice No.</Text>
            <Text style={styles.detailValue}>{invoiceData.invoiceNo}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Invoice Date</Text>
            <Text style={styles.detailValue}>{invoiceData.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Due Date</Text>
            <Text style={styles.detailValue}>{invoiceData.dueDate}</Text>
          </View>
        </View>

        <View style={styles.detailsRight}>
          <Text style={styles.billToLabel}>Bill To:</Text>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{invoiceData.customer}</Text>
            <Text style={styles.customerAddress}>{invoiceData.address}</Text>
            <Text style={styles.customerContact}>{invoiceData.phone}</Text>
            <Text style={styles.customerContact}>{invoiceData.email}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderItemsTable = () => (
    <View style={styles.tableContainer}>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 3 }]}>Item Description</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Qty</Text>
        <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Price</Text>
        <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Amount</Text>
      </View>

      {invoiceData.items.map((item, index) => (
        <View key={index} style={[
          styles.tableRow,
          index === invoiceData.items.length - 1 && styles.lastTableRow
        ]}>
          <Text style={[styles.tableCell, { flex: 3 }]}>{item.name}</Text>
          <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.qty}</Text>
          <Text style={[styles.tableCell, { flex: 1.2, textAlign: 'right' }]}>₹{item.price}</Text>
          <Text style={[styles.tableCell, { flex: 1.2, textAlign: 'right', fontFamily: Fonts.PoppinsMedium, }]}>
            ₹{item.total}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>₹{invoiceData.subtotal}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Discount</Text>
        <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>-₹{invoiceData.discount}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax (10%)</Text>
        <Text style={styles.summaryValue}>₹{invoiceData.tax}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>₹{invoiceData.total}</Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerTitle}>Payment Terms & Notes</Text>
      <Text style={styles.footerText}>
        • Payment is due within 15 days{'\n'}
        • Late payments may incur additional charges{'\n'}
        • Thank you for your business!
      </Text>
      <View style={styles.signature}>
        <Text style={styles.signatureText}>Authorized Signature</Text>
        <View style={styles.signatureLine} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderHeader()}
        {renderInvoiceDetails()}
        {renderItemsTable()}
        {renderSummary()}
        {renderFooter()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },

  // Header Styles
  header: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontFamily: Fonts.PoppinsMedium,
    color: '#2196F3',
    marginBottom: 8,
  },
  companyDetails: {
    fontSize: 14,
    color: Colors.textColor,
    lineHeight: 20,
  },
  invoiceBadge: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  invoiceLabel: {
    color: '#fff',
    fontFamily: Fonts.PoppinsMedium,
    fontSize: 16,
  },

  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsLeft: {
    flex: 1,
  },
  detailsRight: {
    flex: 1,
    marginLeft: 20,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textColor,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontFamily: Fonts.PoppinsSemiBold,
  },

  detailValue: {
    fontSize: 16,
    color: '#333',
    fontFamily: Fonts.PoppinsMedium,
  },

  billToLabel: {
    fontSize: 12,
    color: Colors.textColor,
    marginBottom: 8,
    textTransform: 'uppercase',
    fontFamily: Fonts.PoppinsSemiBold,
  },
  customerInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  customerName: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
    color: '#333',
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 14,
    color: Colors.textColor,
    lineHeight: 18,
    marginBottom: 6,
  },
  customerContact: {
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 2,
  },

  // Table Styles
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    color: '#fff',
    fontFamily: Fonts.PoppinsMedium,
    fontSize: 14,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastTableRow: {
    borderBottomWidth: 0,
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
  },

  // Summary Styles
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textColor,
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: Fonts.PoppinsSemiBold,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: Fonts.PoppinsMedium,
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: Fonts.PoppinsMedium,
    color: '#2196F3',
  },

  // Footer Styles
  footer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  footerTitle: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
    color: '#333',
    marginBottom: 12,
  },
  
  footerText: {
    fontSize: 14,
    color: Colors.textColor,
    lineHeight: 20,
    marginBottom: 20,
  },
  signature: {
    alignItems: 'flex-end',
  },
  signatureText: {
    fontSize: 12,
    // color : Colors.textColor,
    color: Colors.textColor,

    marginBottom: 8,
  },
  signatureLine: {
    width: 150,
    height: 1,
    backgroundColor: '#ccc',
  },
});

export default InvoiceScreen;