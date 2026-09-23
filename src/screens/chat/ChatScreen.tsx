import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';

interface Props {
  navigation: any;
  route: any;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  type: 'text' | 'image' | 'location' | 'announcement';
  createdAt: string;
  reactions?: Record<string, number>;
}

// Demo messages
const DEMO_MESSAGES: Message[] = [
  { id: 'msg-1', userId: 'user-001', userName: 'عبدالله', content: 'مرحباً بالجميع في رحلتنا القادمة!', type: 'announcement', createdAt: '2026-09-20T10:00:00Z', reactions: { '👍': 5, '❤️': 3 } },
  { id: 'msg-2', userId: 'user-002', userName: 'سارة', content: 'أنا متحمسة جداً! متى نلتقي؟', type: 'text', createdAt: '2026-09-20T10:05:00Z' },
  { id: 'msg-3', userId: 'user-001', userName: 'عبدالله', content: 'الاجتماع في محطة الفيصلية الساعة 6 صباحاً', type: 'text', createdAt: '2026-09-20T10:10:00Z' },
  { id: 'msg-4', userId: 'user-004', userName: 'محمد', content: '📍 محطة الفيصلية، تبوك', type: 'location', createdAt: '2026-09-20T10:15:00Z' },
];

export function ChatScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { isDark, user } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { channelType } = route.params;
  const [messages] = useState<Message[]>(DEMO_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;
    // In production, this would send via Supabase Realtime
    setInputText('');
  };

  const handleReaction = (_messageId: string, _emoji: string) => {
    // In production, this would update via Supabase
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.userId === user?.id;
    const isAnnouncement = item.type === 'announcement';

    return (
      <View
        style={[
          styles.messageContainer,
          isOwn ? styles.ownMessage : styles.otherMessage,
          isAnnouncement && styles.announcementMessage,
        ]}>
        {isAnnouncement && (
          <View style={[styles.announcementBadge, { backgroundColor: theme.colors.warning }]}>
            <Text style={styles.announcementBadgeText}>📢 إعلان</Text>
          </View>
        )}
        {!isOwn && !isAnnouncement && (
          <Text style={[styles.userName, { color: theme.colors.primary }]}>{item.userName}</Text>
        )}
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isOwn ? theme.colors.primary : isAnnouncement ? theme.colors.surface : theme.colors.card,
              borderColor: isAnnouncement ? theme.colors.warning : theme.colors.border,
              borderWidth: isAnnouncement ? 2 : 1,
            },
          ]}>
          {item.type === 'location' ? (
            <View style={styles.locationMessage}>
              <Text style={{ fontSize: 24 }}>📍</Text>
              <Text style={[styles.locationText, { color: isOwn ? theme.colors.onPrimary : theme.colors.text }]}>
                {item.content}
              </Text>
            </View>
          ) : (
            <Text style={[styles.messageText, { color: isOwn ? theme.colors.onPrimary : theme.colors.text }]}>
              {item.content}
            </Text>
          )}
          <Text style={[styles.timestamp, { color: isOwn ? 'rgba(255,255,255,0.6)' : theme.colors.textMuted }]}>
            {new Date(item.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {item.reactions && Object.keys(item.reactions).length > 0 && (
          <View style={styles.reactionsRow}>
            {Object.entries(item.reactions).map(([emoji, count]) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => handleReaction(item.id, emoji)}
                style={[styles.reactionChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={styles.reactionText}>{emoji} {count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {channelType === 'community' ? 'دردشة المجتمع' : 'دردشة الرحلة'}
        </Text>
        <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
          <Text style={{ fontSize: 20 }}>{isMuted ? '🔕' : '🔔'}</Text>
        </TouchableOpacity>
      </View>

      {/* Messages list */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48 }}>💬</Text>
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
              ابدأ المحادثة!
            </Text>
          </View>
        }
      />

      {/* Input area */}
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.mediaButton}>
          <Text style={{ fontSize: 24 }}>📷</Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.textInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder={t('chat.typeMessage')}
          placeholderTextColor={theme.colors.placeholder}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.sendText, { color: theme.colors.onPrimary }]}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: { fontSize: 24, marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1 },
  messagesList: { padding: 16, paddingBottom: 8 },
  messageContainer: { marginBottom: 12, maxWidth: '80%' },
  ownMessage: { alignSelf: 'flex-end' },
  otherMessage: { alignSelf: 'flex-start' },
  announcementMessage: { alignSelf: 'center', maxWidth: '90%' },
  announcementBadge: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  announcementBadgeText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  userName: { fontSize: 12, fontWeight: '600', marginBottom: 2, marginLeft: 4 },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageText: { fontSize: 15, lineHeight: 20 },
  timestamp: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  locationMessage: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationText: { fontSize: 14, fontWeight: '500' },
  reactionsRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  reactionChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  reactionText: { fontSize: 11 },
  mediaButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  textInput: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendText: { fontSize: 18 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
  },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, marginTop: 8 },
});
