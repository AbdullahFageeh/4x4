import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useBroncoStore } from '../broncoStore';
import { DEMO_ANALYTICS, DEMO_PERMISSIONS } from '../demoData';

interface PartProps {
  page: string;
  theme: any;
}

export function AdminPanelPart2({ page, theme }: PartProps) {
  switch (page) {
    case 'admins': return <AdminsAdmin theme={theme} />;
    case 'analytics': return <AnalyticsAdmin theme={theme} />;
    case 'audit': return <AuditAdmin theme={theme} />;
    case 'tickets': return <TicketsAdmin theme={theme} />;
    case 'users': return <UsersAdmin theme={theme} />;
    default: return null;
  }
}

function AdminsAdmin({ theme }: { theme: any }) {
  const { admins, addAdmin, toggleAdminActive, setAdminPermissions, logAction, users } = useBroncoStore();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'support'>('admin');
  const [newPerms, setNewPerms] = useState<string[]>(['tickets']);

  const togglePerm = (key: string, list: string[], set: (v: string[]) => void) => {
    set(list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);
  };

  const create = () => {
    if (!newName) return;
    addAdmin({
      id: `admin-${Date.now()}`,
      user_id: users.find((u) => u.name.includes(newName))?.id ?? 'user-new',
      name: newName,
      role: newRole,
      permissions: newRole === 'admin' ? newPerms : ['tickets'],
      active: true,
      last_active_at: new Date().toISOString(),
    });
    logAction('CREATE_ADMIN', newName, `إضافة مسؤول جديد (${newRole}) بصلاحيات: ${newPerms.join(', ')}`);
    setAdding(false);
    setNewName('');
    setNewPerms(['tickets']);
  };

  return (
    <View>
      <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.colors.primary }]} onPress={() => setAdding(!adding)}>
        <Text style={[styles.addText, { color: theme.colors.onPrimary }]}>{adding ? 'إغلاق' : '+ إضافة مسؤول'}</Text>
      </TouchableOpacity>

      {adding && (
        <View style={[styles.addCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={newName}
            onChangeText={setNewName}
            placeholder="اسم المسؤول"
            placeholderTextColor={theme.colors.placeholder}
          />
          <View style={styles.roleRow}>
            {(['admin', 'support'] as const).map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.roleChip,
                  {
                    backgroundColor: newRole === r ? theme.colors.primary : theme.colors.background,
                    borderColor: newRole === r ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                onPress={() => setNewRole(r)}
              >
                <Text style={{ color: newRole === r ? theme.colors.onPrimary : theme.colors.text, fontSize: 12, fontWeight: '700' }}>
                  {r === 'admin' ? 'أدمن' : 'دعم فني'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {newRole === 'admin' && (
            <View>
              <Text style={[styles.permLabel, { color: theme.colors.textMuted }]}>الصلاحيات:</Text>
              <View style={styles.permGrid}>
                {DEMO_PERMISSIONS.map((p) => (
                  <TouchableOpacity
                    key={p.key}
                    style={[
                      styles.permChip,
                      {
                        backgroundColor: newPerms.includes(p.key) ? theme.colors.success : theme.colors.background,
                        borderColor: newPerms.includes(p.key) ? theme.colors.success : theme.colors.border,
                      },
                    ]}
                    onPress={() => togglePerm(p.key, newPerms, setNewPerms)}
                  >
                    <Text style={{ color: newPerms.includes(p.key) ? '#fff' : theme.colors.text, fontSize: 11, fontWeight: '700' }}>{p.label_ar}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.colors.success }]} onPress={create}>
            <Text style={[styles.saveText, { color: '#fff' }]}>إضافة</Text>
          </TouchableOpacity>
        </View>
      )}

      {admins.map((a) => (
        <View key={a.id} style={[styles.adminCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.adminTop}>
            <Text style={[styles.adminName, { color: theme.colors.text }]}>{a.name}</Text>
            <View style={[styles.activeTag, { backgroundColor: a.active ? 'rgba(76,175,80,0.15)' : theme.colors.background }]}>
              <Text style={{ color: a.active ? theme.colors.success : theme.colors.textMuted, fontSize: 11, fontWeight: '800' }}>
                {a.active ? 'نشط' : 'متوقف'}
              </Text>
            </View>
          </View>
          <Text style={[styles.adminRole, { color: theme.colors.primary }]}>
            {a.role === 'super_admin' ? '👑 أدمن رئيسي' : a.role === 'admin' ? 'أدمن' : 'دعم فني'}
          </Text>
          <View style={styles.permRow}>
            {DEMO_PERMISSIONS.filter((p) =>
              a.role === 'super_admin' ? true : a.permissions.includes(p.key)
            ).map((p) => (
              <View key={p.key} style={[styles.miniPerm, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <Text style={[styles.miniPermText, { color: theme.colors.textMuted }]}>{p.label_ar}</Text>
              </View>
            ))}
          </View>
          {a.role !== 'super_admin' && (
            <TouchableOpacity
              style={[styles.editPermsBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
              onPress={() => setAdminPermissions(a.id, [...a.permissions, 'analytics'])}
            >
              <Text style={[styles.editPermsText, { color: theme.colors.primary }]}>+ منحه صلاحية التحليلات</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.toggleBtn, { backgroundColor: a.active ? theme.colors.error : theme.colors.success }]} onPress={() => toggleAdminActive(a.id)}>
            <Text style={[styles.toggleText, { color: '#fff' }]}>{a.active ? 'إيقاف المسؤول' : 'تفعيل المسؤول'}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

function AnalyticsAdmin({ theme }: { theme: any }) {
  const a = DEMO_ANALYTICS;
  const maxUsers = Math.max(...a.weeklyUsers.map((w) => w.value));
  return (
    <View>
      <View style={styles.statGrid}>
        <StatCard theme={theme} value={String(a.totalUsers)} label="مستخدم" color={theme.colors.primary} />
        <StatCard theme={theme} value={String(a.activeUsers)} label="نشط (30 يوم)" color={theme.colors.success} />
        <StatCard theme={theme} value={a.mrr.toLocaleString()} label="إيراد شهري (ر.س)" color={theme.colors.accent} />
        <StatCard theme={theme} value={String(a.totalTrips)} label="رحلة" color={theme.colors.primary} />
        <StatCard theme={theme} value={`★ ${a.avgRating}`} label="متوسط التقييم" color={theme.colors.accent} />
        <StatCard theme={theme} value={String(a.sosThisMonth)} label="تنبيه SOS" color={theme.colors.error} />
      </View>

      <View style={[styles.chartCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.chartTitle, { color: theme.colors.text }]}>📈 المستخدمون النشطون أسبوعيًا</Text>
        <View style={styles.barChart}>
          {a.weeklyUsers.map((w) => (
            <View key={w.label} style={styles.barCol}>
              <View style={[styles.bar, { backgroundColor: theme.colors.primary, height: `${(w.value / maxUsers) * 100}%` }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textMuted }]}>{w.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.chartCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.chartTitle, { color: theme.colors.text }]}>🗺️ الرحلات حسب النوع</Text>
        <View style={[styles.donut, { borderWidth: 14, borderColor: theme.colors.border }]}>
          {a.tripCategories.map((c, i) => (
            <View
              key={c.label}
              style={{
                position: 'absolute',
                width: 14,
                height: 80,
                backgroundColor: c.color,
                left: 70 - 7,
                top: 70 - 40,
                transformOrigin: 'center center',
                transform: [
                  { rotate: `${(a.tripCategories.slice(0, i).reduce((s, x) => s + x.value, 0) / a.tripCategories.reduce((s, x) => s + x.value, 0)) * 360}deg` },
                  { scaleY: c.value / a.tripCategories.reduce((s, x) => s + x.value, 0) },
                ],
              }}
            />
          ))}
          <View style={styles.donutHole}>
            <Text style={[styles.donutValue, { color: theme.colors.text }]}>{a.totalTrips}</Text>
          </View>
        </View>
        <View style={styles.legend}>
          {a.tripCategories.map((c) => (
            <View key={c.label} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: c.color }]} />
              <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>{c.label} — {c.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function StatCard({ theme, value, label, color }: { theme: any; value: string; label: string; color: string }) {
  return (
    <View style={[styles.statCell, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.statCellValue, { color }]}>{value}</Text>
      <Text style={[styles.statCellLabel, { color: theme.colors.textMuted }]}>{label}</Text>
    </View>
  );
}

function AuditAdmin({ theme }: { theme: any }) {
  const { auditLogs } = useBroncoStore();
  return (
    <View>
      <Text style={[styles.auditHint, { color: theme.colors.textMuted }]}>
        كل إجراء إداري يُسجل هنا (من قام، ماذا، على ماذا). سجل غير قابل للتعديل.
      </Text>
      {auditLogs.map((log) => (
        <View key={log.id} style={[styles.auditCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.auditTop}>
            <Text style={[styles.auditAction, { color: theme.colors.primary }]}>{log.action}</Text>
            <Text style={[styles.auditTime, { color: theme.colors.textMuted }]}>{log.created_at.slice(0, 10)} {log.created_at.slice(11, 16)}</Text>
          </View>
          <Text style={[styles.auditDetail, { color: theme.colors.text }]}>{log.detail}</Text>
          <Text style={[styles.auditActor, { color: theme.colors.textMuted }]}>
            بواسطة: {log.actor_id === 'system' ? 'النظام' : log.actor_id} ({log.actor_role})
          </Text>
        </View>
      ))}
    </View>
  );
}

function TicketsAdmin({ theme }: { theme: any }) {
  const { tickets, updateTicketStatus, logAction } = useBroncoStore();
  const open = tickets.filter((t) => t.status === 'open').length;
  return (
    <View>
      <View style={[styles.ticketBanner, { backgroundColor: open > 0 ? 'rgba(211,47,47,0.1)' : 'rgba(56,142,60,0.1)' }]}>
        <Text style={[styles.ticketBannerText, { color: open > 0 ? theme.colors.error : theme.colors.success }]}>
          {open > 0 ? `🎫 ${open} تذاكر مفتوحة تحتاج رد` : '✅ لا تذاكر مفتوحة'}
        </Text>
      </View>
      {tickets.map((t) => (
        <View key={t.id} style={[styles.ticketCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.ticketTop}>
            <Text style={[styles.ticketSubject, { color: theme.colors.text }]}>{t.subject}</Text>
            <View style={[styles.priorityTag, { backgroundColor: t.priority === 'critical' ? 'rgba(211,47,47,0.15)' : t.priority === 'high' ? 'rgba(245,124,0,0.15)' : theme.colors.background }]}>
              <Text style={[styles.priorityText, { color: t.priority === 'critical' ? theme.colors.error : t.priority === 'high' ? theme.colors.warning : theme.colors.textMuted }]}>
                {t.priority === 'critical' ? 'حرج' : t.priority === 'high' ? 'عالية' : t.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
              </Text>
            </View>
          </View>
          <Text style={[styles.ticketMeta, { color: theme.colors.textMuted }]}>
            {t.user?.name} ({t.user?.phone}) • {t.category} • {t.created_at.slice(0, 10)}
          </Text>
          <View style={styles.ticketActions}>
            {t.status !== 'in_progress' && (
              <TouchableOpacity
                style={[styles.ticketBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                onPress={() => { updateTicketStatus(t.id, 'in_progress'); logAction('TICKET_UPDATE', t.id, `فُتح التذكرة: ${t.subject}`); }}
              >
                <Text style={[styles.ticketBtnText, { color: theme.colors.primary }]}>جارٍ العمل</Text>
              </TouchableOpacity>
            )}
            {t.status !== 'resolved' && (
              <TouchableOpacity
                style={[styles.ticketBtn, { backgroundColor: theme.colors.success }]}
                onPress={() => { updateTicketStatus(t.id, 'resolved'); logAction('TICKET_RESOLVE', t.id, `حُلَّت التذكرة: ${t.subject}`); }}
              >
                <Text style={[styles.ticketBtnText, { color: '#fff' }]}>✓ حُلّت</Text>
              </TouchableOpacity>
            )}
            {t.status === 'resolved' && (
              <Text style={[styles.resolvedText, { color: theme.colors.success }]}>✓ تم الحل</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

function UsersAdmin({ theme }: { theme: any }) {
  const { users, setUserId } = useBroncoStore();
  return (
    <View>
      <Text style={[styles.usersHint, { color: theme.colors.textMuted }]}>
        إدارة جميع مستخدمي المجتمع: البحث، الإيقاف، أو تجربة تطبيقهم.
      </Text>
      {users.map((u) => (
        <View key={u.id} style={[styles.userCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.userTop}>
            <View style={[styles.userAvatar, { backgroundColor: theme.colors.background }]}>
              <Text style={{ fontSize: 22 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>{u.name}</Text>
              <Text style={[styles.userMeta, { color: theme.colors.textMuted }]}>{u.phone} • {u.city}</Text>
              <Text style={[styles.userMeta, { color: theme.colors.primary }]}>
                {u.role === 'platform_admin' ? '👑 أدمن' : u.role === 'organizer' ? '🗺️ منظّم' : u.role === 'community_admin' ? '🛠️ مسؤول مجتمع' : '🚙 عضو'}
                {' • '}
                {u.subscription === 'elite' ? '💎 إيليت' : u.subscription === 'pro' ? '💎 برو' : 'مجاني'}
              </Text>
            </View>
          </View>
          <View style={styles.userActions}>
            <TouchableOpacity style={[styles.userBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]} onPress={() => setUserId(u.id)}>
              <Text style={[styles.userBtnText, { color: theme.colors.primary }]}>👁️ تجربة كـ{u.name.split(' ')[0]}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.userBtn, { backgroundColor: 'rgba(211,47,47,0.1)', borderColor: theme.colors.error }]}>
              <Text style={[styles.userBtnText, { color: theme.colors.error }]}>🚫 إيقاف</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: { borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginBottom: 12 },
  addText: { fontSize: 14, fontWeight: '800' },
  addCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  input: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, marginBottom: 10 },
  roleRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  roleChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  permLabel: { fontSize: 12, fontWeight: '700', marginBottom: 8 },
  permGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  permChip: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  saveBtn: { borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  saveText: { fontSize: 14, fontWeight: '800' },
  adminCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  adminTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  adminName: { fontSize: 15, fontWeight: '800' },
  activeTag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  adminRole: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  permRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  miniPerm: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4 },
  miniPermText: { fontSize: 10 },
  editPermsBtn: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start', marginTop: 10 },
  editPermsText: { fontSize: 12, fontWeight: '700' },
  toggleBtn: { borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 10 },
  toggleText: { fontSize: 13, fontWeight: '700' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  statCell: { flexBasis: '31%', borderRadius: 12, borderWidth: 1, padding: 12, alignItems: 'center' },
  statCellValue: { fontSize: 18, fontWeight: '900' },
  statCellLabel: { fontSize: 10, marginTop: 3 },
  chartCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  chartTitle: { fontSize: 14, fontWeight: '800', marginBottom: 12 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 130, gap: 8 },
  barCol: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: '60%', borderRadius: 6, minHeight: 8 },
  barLabel: { fontSize: 9, marginTop: 4 },
  donut: { width: 150, height: 150, borderRadius: 75, alignSelf: 'center', overflow: 'hidden', marginBottom: 12 },
  donutHole: { position: 'absolute', top: 40, left: 40, width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  donutValue: { fontSize: 18, fontWeight: '900' },
  legend: { gap: 6 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12 },
  auditHint: { fontSize: 12, marginBottom: 12, lineHeight: 18 },
  auditCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  auditTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  auditAction: { fontSize: 13, fontWeight: '900' },
  auditTime: { fontSize: 11 },
  auditDetail: { fontSize: 13 },
  auditActor: { fontSize: 11, marginTop: 6 },
  ticketBanner: { borderRadius: 12, padding: 12, marginBottom: 12 },
  ticketBannerText: { fontSize: 13, fontWeight: '800' },
  ticketCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  ticketTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  ticketSubject: { fontSize: 14, fontWeight: '700', flex: 1 },
  priorityTag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  priorityText: { fontSize: 10, fontWeight: '800' },
  ticketMeta: { fontSize: 11, marginTop: 6 },
  ticketActions: { flexDirection: 'row', gap: 8, marginTop: 10, alignItems: 'center' },
  ticketBtn: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  ticketBtnText: { fontSize: 12, fontWeight: '700' },
  resolvedText: { fontSize: 13, fontWeight: '800' },
  usersHint: { fontSize: 12, marginBottom: 12, lineHeight: 18 },
  userCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  userTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  userAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 15, fontWeight: '800' },
  userMeta: { fontSize: 11, marginTop: 2 },
  userActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  userBtn: { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 10, alignItems: 'center' },
  userBtnText: { fontSize: 12, fontWeight: '700' },
});