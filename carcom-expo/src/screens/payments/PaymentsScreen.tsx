import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';

interface Props {
  navigation: any;
  route: any;
}

interface Expense {
  id: string;
  title: string;
  type: 'trip_fee' | 'food' | 'campsite' | 'supplies' | 'other';
  totalAmount: number;
  paidBy: string;
  shares: {
    userId: string;
    userName: string;
    amount: number;
    status: 'pending' | 'paid';
  }[];
}

const DEMO_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'رسوم الرحلة',
    type: 'trip_fee',
    totalAmount: 350,
    paidBy: 'عبدالله',
    shares: [
      { userId: 'user-001', userName: 'عبدالله', amount: 350, status: 'paid' },
      { userId: 'user-002', userName: 'سارة', amount: 350, status: 'pending' },
      { userId: 'user-004', userName: 'محمد', amount: 350, status: 'pending' },
    ],
  },
  {
    id: 'exp-2',
    title: 'حجز المخيم',
    type: 'campsite',
    totalAmount: 500,
    paidBy: 'سارة',
    shares: [
      { userId: 'user-001', userName: 'عبدالله', amount: 50, status: 'paid' },
      { userId: 'user-002', userName: 'سارة', amount: 50, status: 'paid' },
      { userId: 'user-004', userName: 'محمد', amount: 50, status: 'pending' },
    ],
  },
];

export function PaymentsScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;

  const [expenses] = useState<Expense[]>(DEMO_EXPENSES);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const totalOwed = expenses.reduce((sum, exp) => {
    const userShare = exp.shares.find((s) => s.userId === 'demo-user-001');
    return sum + (userShare?.status === 'pending' ? userShare.amount : 0);
  }, 0);

  const totalPaid = expenses.reduce((sum, exp) => {
    const userShare = exp.shares.find((s) => s.userId === 'demo-user-001');
    return sum + (userShare?.status === 'paid' ? userShare.amount : 0);
  }, 0);

  const renderExpense = ({ item }: { item: Expense }) => {
    const userShare = item.shares.find((s) => s.userId === 'demo-user-001');
    const paidCount = item.shares.filter((s) => s.status === 'paid').length;

    return (
      <View style={[styles.expenseCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.expenseHeader}>
          <View style={styles.expenseInfo}>
            <Text style={[styles.expenseTitle, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={[styles.expenseMeta, { color: theme.colors.textMuted }]}>
              دفع: {item.paidBy} • {item.shares.length} أشخاص
            </Text>
          </View>
          <Text style={[styles.expenseAmount, { color: theme.colors.accent }]}>
            {item.totalAmount} SAR
          </Text>
        </View>
        <View style={styles.sharesRow}>
          <Text style={[styles.shareAmount, { color: userShare?.status === 'paid' ? theme.colors.success : theme.colors.warning }]}>
            حصتك: {userShare?.amount} SAR — {userShare?.status === 'paid' ? 'مدفوع' : 'قيد الانتظار'}
          </Text>
          <Text style={[styles.shareProgress, { color: theme.colors.textMuted }]}>
            {paidCount}/{item.shares.length} مدفوع
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>المصاريف والمدفوعات</Text>
        <TouchableOpacity onPress={() => setShowAddExpense(!showAddExpense)}>
          <Text style={[styles.addButton, { color: theme.colors.primary }]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={[styles.summaryCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>إجمالي المستحق</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.error }]}>{totalOwed} SAR</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>المدفوع</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.success }]}>{totalPaid} SAR</Text>
          </View>
        </View>
        {totalOwed > 0 && (
          <TouchableOpacity style={[styles.payAllButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.payAllText, { color: theme.colors.onPrimary }]}>ادفع الكل ({totalOwed} SAR)</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Test mode notice */}
      <View style={[styles.testModeBanner, { backgroundColor: theme.colors.warning }]}>
        <Text style={styles.testModeText}>🎬 وضع التجربة — لن يتم خصم أي مبلغ حقيقي</Text>
      </View>

      {/* Add expense form */}
      {showAddExpense && (
        <View style={[styles.addExpenseCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>إضافة مصروف</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={newExpenseTitle}
            onChangeText={setNewExpenseTitle}
            placeholder="عنوان المصروف"
            placeholderTextColor={theme.colors.placeholder}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={newExpenseAmount}
            onChangeText={setNewExpenseAmount}
            placeholder="المبلغ (SAR)"
            placeholderTextColor={theme.colors.placeholder}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={[styles.addExpenseButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.addExpenseText, { color: theme.colors.onPrimary }]}>إضافة</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Expenses list */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpense}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48 }}>💰</Text>
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>لا توجد مصاريف بعد</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backButton: { fontSize: 24 },
  title: { fontSize: 18, fontWeight: '600' },
  addButton: { fontSize: 28, fontWeight: '300' },
  summaryCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryLabel: { fontSize: 12, marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: '700' },
  summaryDivider: { width: 1 },
  payAllButton: { height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  payAllText: { fontSize: 16, fontWeight: '600' },
  testModeBanner: { marginHorizontal: 16, marginBottom: 16, borderRadius: 8, padding: 10, alignItems: 'center' },
  testModeText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  addExpenseCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  input: { height: 44, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, marginBottom: 10, fontSize: 16 },
  addExpenseButton: { height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  addExpenseText: { fontSize: 16, fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  expenseCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  expenseHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  expenseInfo: { flex: 1 },
  expenseTitle: { fontSize: 16, fontWeight: '600' },
  expenseMeta: { fontSize: 12, marginTop: 2 },
  expenseAmount: { fontSize: 18, fontWeight: '700' },
  sharesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  shareAmount: { fontSize: 14, fontWeight: '500' },
  shareProgress: { fontSize: 12 },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, marginTop: 8 },
});
