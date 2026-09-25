import React, { useState } from 'react';
import { Community, ActivityType, Poll } from '../../types';
import { useApp } from '../../context/AppContext';
import { CategoryIconBadge } from '../common/AutomotiveArt';
import { InteractivePoll } from '../common/InteractivePoll';
import {
  X,
  Users,
  Compass,
  MapPin,
  ShieldCheck,
  Check,
  Plus,
  AlertTriangle,
  MessageSquare,
  Heart,
  Send,
  Radio,
  Calendar,
  Sparkles,
  HelpCircle,
  Camera,
  Share2,
  BarChart3,
  Clock,
  Trash2,
} from 'lucide-react';

interface CommunityDetailModalProps {
  community: Community;
  onClose: () => void;
  onToggleJoin: (communityId: string) => void;
}

export const CommunityDetailModal: React.FC<CommunityDetailModalProps> = ({
  community,
  onClose,
  onToggleJoin,
}) => {
  const {
    activities,
    toggleLikeActivity,
    addCommentToActivity,
    createActivityPost,
    voteOnActivityPoll,
    currentUser,
    trips,
    setCurrentTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'activity' | 'about'>('activity');
  const [filterType, setFilterType] = useState<string>('all');
  const [newPostText, setNewPostText] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostType, setNewPostType] = useState<ActivityType>('post');
  const [showPostForm, setShowPostForm] = useState(false);
  const [includePoll, setIncludePoll] = useState(false);
  const [pollCategory, setPollCategory] = useState<'destination' | 'time' | 'equipment' | 'general'>('destination');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [activityId: string]: string }>({});

  // Filter activities for this community
  const communityActivities = activities.filter(
    (act) => act.communityId === community.id
  );

  const filteredActivities = communityActivities.filter((act) => {
    if (filterType === 'all') return true;
    return act.type === filterType;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const validPollOptions = pollOptions.map((o) => o.trim()).filter(Boolean);

    createActivityPost(community.id, {
      title: newPostTitle.trim() || (includePoll ? (pollQuestion.trim() || 'استطلاع رأي لأعضاء الرابطة') : 'مشاركة جديدة من الكابتن'),
      content: newPostText.trim(),
      type: includePoll && validPollOptions.length >= 2 ? 'poll' : newPostType,
      poll: includePoll && validPollOptions.length >= 2
        ? {
            question: pollQuestion.trim() || 'يرجى اختيار الخيار الأنسب لك:',
            category: pollCategory,
            options: validPollOptions,
          }
        : undefined,
    });

    setNewPostText('');
    setNewPostTitle('');
    setShowPostForm(false);
    setIncludePoll(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const applyPollPreset = (preset: 'destination' | 'time' | 'equipment') => {
    setIncludePoll(true);
    setPollCategory(preset);
    if (preset === 'destination') {
      setPollQuestion('ما هي وجهة مسارنا القادمة المفضلة؟');
      setPollOptions(['حافة العالم ووادي سدر', 'كثبان نفود الثمامة وتحدي الرمال', 'درب الجِمال الأثري بالقدية']);
      if (!newPostTitle) setNewPostTitle('تصويت: تحديد وجهة المسار القادم 🗺️');
    } else if (preset === 'time') {
      setPollQuestion('ما هو موعد وتوقيت التجمع الأنسب لك؟');
      setPollOptions(['03:30 عصراً (للحاق بضوء العصر والتخييم)', '04:30 عصراً (لتجنب حرارة الشمس)', '08:00 ليلاً (كروز ليلي)']);
      if (!newPostTitle) setNewPostTitle('تصويت: موعد انطلاق القافلة ⏱️');
    } else {
      setPollQuestion('ما هو موقع جلسة السمر وشبة النار والعشاء؟');
      setPollOptions(['أعلى قمة الطعس المطل', 'بطن الوادي المحمي من الرياح']);
      if (!newPostTitle) setNewPostTitle('تصويت: موقع شبة النار والعشاء ⛺');
    }
  };

  const handleAddComment = (activityId: string) => {
    const text = commentInput[activityId];
    if (!text || !text.trim()) return;

    addCommentToActivity(activityId, text.trim());
    setCommentInput((prev) => ({ ...prev, [activityId]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0f141d] border border-white/10 shadow-2xl overflow-hidden relative">
        {/* Sticky Header with Close */}
        <div className="p-5 pb-3 border-b border-white/10 relative bg-[#0f141d]/95 backdrop-blur-md">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <CategoryIconBadge category={community.category} size="lg" />
            <div className="flex-1 pr-8 rtl:pr-0 rtl:pl-8">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{community.name}</h2>
                {community.isVerified && (
                  <span title="مجتمع موثق" className="inline-flex">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-400 font-medium mt-0.5">{community.tagline}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1.5 font-mono">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{community.city}</span>
                </span>
                <span>·</span>
                <span><strong className="text-white tabular-nums">{community.membersCount}</strong> عضو</span>
                <span>·</span>
                <span><strong className="text-white tabular-nums">{community.tripsCount}</strong> قافلة</span>
              </div>
            </div>
          </div>

          {/* Sub Navigation Bar within Community Modal */}
          <div className="flex items-center justify-between mt-4 pt-2">
            <div className="flex items-center gap-1 p-1 bg-[#141b24] rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'activity'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>النشاط الأخير والتحديثات</span>
                <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-mono">
                  {communityActivities.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'about'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>عن المجتمع والقواعد</span>
              </button>
            </div>

            {/* Quick Join / Leave button */}
            <button
              onClick={() => onToggleJoin(community.id)}
              className={`min-h-[34px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shrink-0 ${
                community.isJoined
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
              }`}
            >
              {community.isJoined ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>عضو بالرابطة</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>انضمام للمجتمع</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: RECENT ACTIVITY */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              {/* Filter pills & New Post Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: 'الكل' },
                    { id: 'poll', label: 'استطلاعات الرأي 🗳️' },
                    { id: 'announcement', label: 'إعلانات القوافل' },
                    { id: 'photo', label: 'تقارير وصور' },
                    { id: 'question', label: 'استفسارات وتعديل' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilterType(f.id)}
                      className={`whitespace-nowrap px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        filterType === f.id
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                          : 'bg-[#141b24] text-slate-400 hover:text-slate-200 border border-white/5'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowPostForm(!showPostForm)}
                  className="px-3 py-1.5 rounded-xl bg-[#141b24] hover:bg-[#1a2330] border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>كتابة منشور / سؤال</span>
                </button>
              </div>

              {/* Create Post Expandable Form */}
              {showPostForm && (
                <form
                  onSubmit={handleCreatePost}
                  className="p-4 rounded-xl bg-[#141b25] border border-emerald-500/30 space-y-3 animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>نشر تحديث في {community.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPostForm(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="عنوان المنشور أو الاستفسار..."
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0c1017] border border-white/10 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                    <select
                      value={newPostType}
                      onChange={(e) => setNewPostType(e.target.value as ActivityType)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c1017] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="post">منشور عام</option>
                      <option value="question">استفسار ميكانيكي / تعديل</option>
                      <option value="photo">تقرير مسار وصور</option>
                      <option value="announcement">إعلان تنظيمي</option>
                    </select>
                  </div>

                  <textarea
                    rows={3}
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="شارك تجربتك، حالة المسار، أو استفسارك مع باقي السائقين..."
                    className="w-full px-3 py-2 rounded-lg bg-[#0c1017] border border-white/10 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                  />

                  {/* Poll Toggle & Builder */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c1017] border border-white/5">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-amber-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">إرفاق استطلاع رأي (تصويت)</span>
                          <span className="text-[10px] text-slate-400">لأخذ تصويت الأعضاء على الوجهة أو توقيت التجمع</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!includePoll) {
                            applyPollPreset('destination');
                          } else {
                            setIncludePoll(false);
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          includePoll
                            ? 'bg-amber-500 text-black shadow'
                            : 'bg-white/10 hover:bg-white/15 text-slate-300'
                        }`}
                      >
                        {includePoll ? 'مفعّل ✓' : '+ إضافة تصويت'}
                      </button>
                    </div>

                    {includePoll && (
                      <div className="mt-2.5 p-3 rounded-lg bg-[#0c1017] border border-amber-500/20 space-y-2.5 animate-fade-in">
                        {/* Preset quick buttons */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                          <span className="text-[11px] text-slate-400 shrink-0">نماذج سريعة:</span>
                          <button
                            type="button"
                            onClick={() => applyPollPreset('destination')}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                              pollCategory === 'destination' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-white/5 text-slate-400'
                            }`}
                          >
                            📍 تصويت الوجهة
                          </button>
                          <button
                            type="button"
                            onClick={() => applyPollPreset('time')}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                              pollCategory === 'time' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 text-slate-400'
                            }`}
                          >
                            ⏱️ توقيت الانطلاق
                          </button>
                          <button
                            type="button"
                            onClick={() => applyPollPreset('equipment')}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                              pollCategory === 'equipment' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-white/5 text-slate-400'
                            }`}
                          >
                            ⛺ موقع العشاء
                          </button>
                        </div>

                        {/* Poll Question Input */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            سؤال التصويت
                          </label>
                          <input
                            type="text"
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                            placeholder="مثال: أي مسار تفضلون لقافلة نهاية الأسبوع؟"
                            className="w-full px-3 py-1.5 rounded-lg bg-[#141b25] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        {/* Poll Option Inputs */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-slate-300">
                            خيارات التصويت (الحد الأدنى خيارين)
                          </label>
                          {pollOptions.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-white/5 text-slate-400 text-[10px] font-mono flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...pollOptions];
                                  updated[idx] = e.target.value;
                                  setPollOptions(updated);
                                }}
                                placeholder={`الخيار ${idx + 1}...`}
                                className="flex-1 px-3 py-1 rounded-lg bg-[#141b25] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                              />
                              {pollOptions.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPollOptions(pollOptions.filter((_, i) => i !== idx));
                                  }}
                                  className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-white/5"
                                  title="حذف الخيار"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}

                          {pollOptions.length < 5 && (
                            <button
                              type="button"
                              onClick={() => setPollOptions([...pollOptions, ''])}
                              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 pt-1 font-medium"
                            >
                              <Plus className="w-3 h-3" />
                              <span>إضافة خيار تصويت آخر</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowPostForm(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
                    >
                      نشر الآن
                    </button>
                  </div>
                </form>
              )}

              {/* Feed of Activities */}
              {filteredActivities.length > 0 ? (
                <div className="space-y-3.5">
                  {filteredActivities.map((act) => {
                    const typeBadge = {
                      poll: {
                        label: 'استطلاع رأي وتصويت',
                        icon: <BarChart3 className="w-3 h-3" />,
                        classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
                      },
                      announcement: {
                        label: 'إعلان قافلة',
                        icon: <Radio className="w-3 h-3" />,
                        classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                      },
                      photo: {
                        label: 'تقرير مسار',
                        icon: <Camera className="w-3 h-3" />,
                        classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                      },
                      question: {
                        label: 'استفسار وتعديل',
                        icon: <HelpCircle className="w-3 h-3" />,
                        classes: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
                      },
                      post: {
                        label: 'منشور عضو',
                        icon: <MessageSquare className="w-3 h-3" />,
                        classes: 'bg-slate-500/10 text-slate-300 border-white/10',
                      },
                    }[act.type] || {
                      label: 'منشور',
                      icon: <MessageSquare className="w-3 h-3" />,
                      classes: 'bg-slate-500/10 text-slate-300 border-white/10',
                    };

                    const isCommentOpen = activeCommentBox === act.id;

                    return (
                      <div
                        key={act.id}
                        className="p-4 rounded-xl bg-[#121823] border border-white/10 hover:border-white/15 transition-all space-y-3"
                      >
                        {/* Author Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={act.authorAvatar}
                              alt={act.authorName}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-full object-cover border border-white/10"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white">
                                  {act.authorName}
                                </span>
                                {act.authorRole && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {act.authorRole}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                                {act.authorVehicle && <span>{act.authorVehicle}</span>}
                                {act.authorVehicle && <span>·</span>}
                                <span>{act.time}</span>
                              </div>
                            </div>
                          </div>

                          {/* Type Pill */}
                          <div
                            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${typeBadge.classes}`}
                          >
                            {typeBadge.icon}
                            <span>{typeBadge.label}</span>
                          </div>
                        </div>

                        {/* Title if present */}
                        {act.title && (
                          <h4 className="text-sm font-bold text-slate-100 leading-snug">
                            {act.title}
                          </h4>
                        )}

                        {/* Content text */}
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {act.content}
                        </p>

                        {/* Interactive Poll Component if present */}
                        {act.poll && (
                          <InteractivePoll
                            poll={act.poll}
                            onVote={(optionId) => voteOnActivityPoll(act.id, optionId)}
                          />
                        )}

                        {/* Connected Trip Preview Box (if announcement has tripLink) */}
                        {act.tripLink && (
                          <div className="p-3 rounded-lg bg-[#0c1017] border border-amber-500/20 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                                <Compass className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-white block">
                                  {act.tripLink.tripTitle}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {act.tripLink.tripDate}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                onClose();
                                setCurrentTab('trips');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow shrink-0"
                            >
                              عرض القافلة
                            </button>
                          </div>
                        )}

                        {/* Action Bar (Like, Comment, Reply) */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
                          <div className="flex items-center gap-4">
                            {/* Like Button */}
                            <button
                              onClick={() => toggleLikeActivity(act.id)}
                              className={`flex items-center gap-1.5 font-medium transition-colors ${
                                act.isLiked ? 'text-red-400 font-bold' : 'hover:text-white'
                              }`}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${act.isLiked ? 'fill-current' : ''}`}
                              />
                              <span className="font-mono tabular-nums">{act.likesCount}</span>
                              <span>إعجاب</span>
                            </button>

                            {/* Comments Toggle */}
                            <button
                              onClick={() =>
                                setActiveCommentBox(isCommentOpen ? null : act.id)
                              }
                              className="flex items-center gap-1.5 font-medium hover:text-white transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="font-mono tabular-nums">
                                {act.comments.length}
                              </span>
                              <span>تعليق</span>
                            </button>
                          </div>

                          <span className="text-[11px] text-slate-400 font-mono">
                            نقاشات الرابطة
                          </span>
                        </div>

                        {/* Comments Thread */}
                        {(isCommentOpen || act.comments.length > 0) && (
                          <div className="mt-3 pt-3 border-t border-white/5 space-y-2.5 bg-[#0d121a] p-3 rounded-lg">
                            {act.comments.map((c) => (
                              <div key={c.id} className="flex items-start gap-2 text-xs">
                                <img
                                  src={c.authorAvatar}
                                  alt={c.authorName}
                                  referrerPolicy="no-referrer"
                                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                                />
                                <div className="flex-1 bg-[#141b25] p-2 rounded-lg border border-white/5">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="font-bold text-white text-[11px]">
                                      {c.authorName}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {c.time}
                                    </span>
                                  </div>
                                  <p className="text-slate-300 text-[11px] leading-snug">
                                    {c.text}
                                  </p>
                                </div>
                              </div>
                            ))}

                            {/* Add Comment Input */}
                            <div className="flex items-center gap-2 pt-1.5">
                              <input
                                type="text"
                                value={commentInput[act.id] || ''}
                                onChange={(e) =>
                                  setCommentInput((prev) => ({
                                    ...prev,
                                    [act.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddComment(act.id);
                                }}
                                placeholder="أضف رداً أو شارك رأيك..."
                                className="flex-1 px-3 py-1.5 rounded-lg bg-[#141b25] border border-white/10 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                              />
                              <button
                                onClick={() => handleAddComment(act.id)}
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shrink-0"
                                title="إرسال الرد"
                              >
                                <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400 space-y-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
                  <p>لا توجد منشورات في هذا التصنيف بعد. كن أول من يشارك في المجتمع!</p>
                  <button
                    onClick={() => setShowPostForm(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>كتابة أول منشور</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ABOUT & RULES */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              {/* Description */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <h3 className="text-xs font-bold text-slate-300 mb-1.5">عن المجتمع والأنشطة</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {community.description}
                </p>
              </div>

              {/* Leader Info */}
              <div className="p-3.5 rounded-xl bg-[#141b25] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={community.leader.avatar}
                    alt={community.leader.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {community.leader.name}
                    </span>
                    <span className="text-[11px] text-emerald-400">{community.leader.role}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">
                  قيادة معتمدة
                </span>
              </div>

              {/* Meeting Spot */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>نقطة التجمع الدورية</span>
                </div>
                <p className="text-xs text-slate-300">{community.meetingSpot}</p>
              </div>

              {/* Club Rules & Safety */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>قواعد المشاركة والسلامة</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
                  {community.rules.map((rule, idx) => (
                    <li key={idx} className="leading-snug">{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
