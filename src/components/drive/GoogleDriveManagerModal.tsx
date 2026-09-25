import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  googleSignIn,
  googleSignOut,
  getAccessToken,
  initAuth,
  setCachedAccessToken,
} from '../../services/googleAuthService';
import {
  listDriveFiles,
  getDriveAbout,
  syncTripToDrive,
  syncDriverProfileToDrive,
  uploadTextToDrive,
  deleteDriveFile,
  getOrCreateCarComFolder,
  GoogleDriveFile,
  GoogleDriveUser,
  GoogleDriveQuota,
} from '../../services/googleDriveService';
import {
  HardDrive,
  Cloud,
  CloudUpload,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Search,
  RefreshCw,
  FileText,
  Folder,
  MapPin,
  Car,
  AlertTriangle,
  X,
  Plus,
  LogIn,
  LogOut,
  Shield,
  Sparkles,
} from 'lucide-react';

interface GoogleDriveManagerModalProps {
  onClose: () => void;
  targetTripToSync?: any;
}

export const GoogleDriveManagerModal: React.FC<GoogleDriveManagerModalProps> = ({
  onClose,
  targetTripToSync,
}) => {
  const { currentUser, trips, dir } = useApp();
  const isRtl = dir === 'rtl';

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<GoogleDriveUser | null>(null);
  const [storageQuota, setStorageQuota] = useState<GoogleDriveQuota | null>(null);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Destructive delete confirmation dialog state (Mandatory per skill)
  const [fileToDelete, setFileToDelete] = useState<GoogleDriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // New Note / Waypoint file modal
  const [showCreateNote, setShowCreateNote] = useState<boolean>(false);
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState<string>('');

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setAccessToken(token);
        fetchDriveData(token);
      },
      () => {
        setAccessToken(null);
        setGoogleUser(null);
        setFiles([]);
      }
    );

    // Also check memory token immediately
    getAccessToken().then((token) => {
      if (token) {
        setAccessToken(token);
        fetchDriveData(token);
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-sync requested trip if token is already active
  useEffect(() => {
    if (accessToken && targetTripToSync && !isSyncing) {
      handleSyncSingleTrip(targetTripToSync);
    }
  }, [accessToken, targetTripToSync]);

  const fetchDriveData = async (token: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [aboutData, filesList] = await Promise.all([
        getDriveAbout(token).catch((err) => {
          console.warn('Could not fetch about:', err);
          return { user: undefined, storageQuota: undefined };
        }),
        listDriveFiles(token),
      ]);

      if (aboutData.user) {
        setGoogleUser(aboutData.user);
      }
      if (aboutData.storageQuota) {
        setStorageQuota(aboutData.storageQuota);
      }
      setFiles(filesList);
    } catch (err: any) {
      console.error('Error fetching Google Drive data:', err);
      setErrorMessage(err.message || 'فشل في جلب ملفات Google Drive.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setAccessToken(res.accessToken);
        setCachedAccessToken(res.accessToken);
        await fetchDriveData(res.accessToken);
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setErrorMessage('تعذر تسجيل الدخول بـ Google. يرجى المحاولة مرة أخرى والموافقة على الأذونات.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleSignOut();
      setAccessToken(null);
      setGoogleUser(null);
      setFiles([]);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const handleSyncSingleTrip = async (trip: any) => {
    if (!accessToken) return;
    setIsSyncing(true);
    setErrorMessage(null);
    try {
      const created = await syncTripToDrive(accessToken, trip);
      setSyncSuccessMessage(`تمت مزامنة مسار "${trip.title}" بنجاح في Google Drive!`);
      // Refresh list
      await fetchDriveData(accessToken);
      setTimeout(() => setSyncSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Sync trip error:', err);
      setErrorMessage(`فشل في مزامنة المسار: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncDriverProfile = async () => {
    if (!accessToken) return;
    setIsSyncing(true);
    setErrorMessage(null);
    try {
      await syncDriverProfileToDrive(accessToken, currentUser);
      setSyncSuccessMessage(`تم حفظ رخصة السائق وبيانات الكراج في مجلد CarCom على Google Drive!`);
      await fetchDriveData(accessToken);
      setTimeout(() => setSyncSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Sync profile error:', err);
      setErrorMessage(`فشل في حفظ بطاقة السائق: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateCustomNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !newNoteTitle.trim()) return;

    setIsSyncing(true);
    try {
      const folderId = await getOrCreateCarComFolder(accessToken);
      const fileName = `${newNoteTitle.trim().replace(/[\/\\]/g, '_')}.txt`;
      await uploadTextToDrive(
        accessToken,
        fileName,
        newNoteContent || 'ملاحظات مسار ومخطط قافلة CarCom',
        'text/plain',
        folderId
      );
      setSyncSuccessMessage(`تم إنشاء الملف "${fileName}" بنجاح في Google Drive!`);
      setShowCreateNote(false);
      setNewNoteTitle('');
      setNewNoteContent('');
      await fetchDriveData(accessToken);
      setTimeout(() => setSyncSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(`فشل إنشاء الملف: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Explicit confirmation delete execution (Mandatory for destructive workspace mutations)
  const confirmDeleteFile = async () => {
    if (!accessToken || !fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setFileToDelete(null);
      setSyncSuccessMessage('تم حذف الملف من Google Drive بنجاح.');
      setTimeout(() => setSyncSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(`فشل حذف الملف: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFiles = files.filter((f) => {
    if (!searchQuery.trim()) return true;
    return f.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '—';
    const num = Number(bytes);
    if (isNaN(num)) return bytes;
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatStorageUsage = (quota?: GoogleDriveQuota | null) => {
    if (!quota?.usage || !quota?.limit) return null;
    const usageGB = (Number(quota.usage) / (1024 * 1024 * 1024)).toFixed(1);
    const limitGB = (Number(quota.limit) / (1024 * 1024 * 1024)).toFixed(0);
    const percent = Math.min(100, Math.round((Number(quota.usage) / Number(quota.limit)) * 100));
    return { usageGB, limitGB, percent };
  };

  const storageInfo = formatStorageUsage(storageQuota);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#090d14] border border-blue-500/30 shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0e1422]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-[1.5px]">
              <div className="w-full h-full bg-[#090d14] rounded-[10px] flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  سحابة Google Drive للمسارات والقوافل
                </h2>
                {accessToken ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    متصل
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    غير متصل
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                مزامنة إحداثيات GPS، مسارات GPX، وبطاقات قوافل 4x4 في سحابتك الخاصة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications Banners */}
        {syncSuccessMessage && (
          <div className="px-6 py-2.5 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="px-6 py-2.5 bg-rose-500/15 border-b border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Section 1: Authentication Card */}
          {!accessToken ? (
            <div className="p-8 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0c101a] border border-blue-500/20 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <Cloud className="w-8 h-8 text-blue-400" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-bold text-white">
                  اربط حساب Google Drive لحفظ ومزامنة رحلاتك
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  احفظ مسارات القوافل وإحداثيات ونقاط التجمع الوعرة، وشاركها مع أفراد الفريق مباشرة عبر سحابتك بأمان وبإذن مباشر منك.
                </p>
              </div>

              {/* Official Google Sign-In Styled Button (Skill requirement) */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  type="button"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isLoading ? 'جاري الاتصال بـ Google...' : 'تسجيل الدخول بحساب Google Drive'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Connected Account Header & Quota */
            <div className="p-4 rounded-2xl bg-[#0d131f] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {googleUser?.photoLink ? (
                  <img
                    src={googleUser.photoLink}
                    alt={googleUser.displayName || 'Google User'}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full border border-blue-400 object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold">
                    G
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{googleUser?.displayName || 'حساب Google Drive متصل'}</span>
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">{googleUser?.emailAddress}</p>
                </div>
              </div>

              {storageInfo && (
                <div className="sm:text-right rtl:sm:text-right">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">
                    المساحة: {storageInfo.usageGB} GB من {storageInfo.limitGB} GB ({storageInfo.percent}%)
                  </div>
                  <div className="w-36 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                      style={{ width: `${storageInfo.percent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                <button
                  onClick={() => fetchDriveData(accessToken)}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title="تحديث الملفات"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>قطع الاتصال</span>
                </button>
              </div>
            </div>
          )}

          {/* Section 2: Quick Sync Actions (When Authenticated) */}
          {accessToken && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>إجراءات المزامنة السحابية السريعة</span>
                </h3>
                <button
                  onClick={() => setShowCreateNote(!showCreateNote)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إنشاء ملف مسار جديد</span>
                </button>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleSyncDriverProfile}
                  disabled={isSyncing}
                  className="p-3.5 rounded-2xl bg-[#0c121d] hover:bg-[#111927] border border-amber-500/30 text-right rtl:text-right transition-all flex items-start gap-3 group active:scale-[0.98]"
                >
                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 group-hover:scale-105 transition-transform">
                    <Car className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-white block">
                      مزامنة رخصة السائق وتجهيزات الكراج
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block leading-snug">
                      تصدير ملف مواصفات المركبة ونداء اللاسلكي إلى مجلد CarCom
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const primaryTrip = trips[0];
                    if (primaryTrip) handleSyncSingleTrip(primaryTrip);
                  }}
                  disabled={isSyncing || trips.length === 0}
                  className="p-3.5 rounded-2xl bg-[#0c121d] hover:bg-[#111927] border border-emerald-500/30 text-right rtl:text-right transition-all flex items-start gap-3 group active:scale-[0.98]"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-white block">
                      مزامنة مسارات القوافل وإحداثيات GPS
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block leading-snug">
                      حفظ إحداثيات التجمع ونقاط التخييم ومخطط الطوارئ
                    </span>
                  </div>
                </button>
              </div>

              {/* Inline Create Note Form */}
              {showCreateNote && (
                <form
                  onSubmit={handleCreateCustomNote}
                  className="p-4 rounded-2xl bg-[#0c1017] border border-blue-500/30 space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">إضافة ملف أو مسار يدوي في Drive</span>
                    <button
                      type="button"
                      onClick={() => setShowCreateNote(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="اسم الملف (مثال: نقاط تجمع طعوس الثمامة)"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#06090f] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    required
                  />
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    rows={3}
                    placeholder="محتوى الملاحظة أو الإحداثيات أو ترددات اللاسلكي..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#06090f] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateNote(false)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={isSyncing}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                    >
                      {isSyncing ? 'جاري الرفع...' : 'رفع إلى Google Drive'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Section 3: Google Drive File Explorer (When Authenticated) */}
          {accessToken && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-blue-400" />
                  <span>الملفات في Google Drive ({filteredFiles.length})</span>
                </h3>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute right-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالاسم في Drive..."
                    className="w-full pr-8 pl-3 py-1.5 rounded-xl bg-[#070b12] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Files List */}
              {isLoading ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin text-blue-400" />
                  <p>جاري تحميل ملفاتك من Google Drive...</p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#080c13] border border-dashed border-white/10 text-center space-y-2">
                  <FileText className="w-7 h-7 mx-auto text-slate-500" />
                  <p className="text-xs text-slate-300">لم يتم العثور على ملفات مطابقة</p>
                  <p className="text-[11px] text-slate-500">
                    استخدم أزرار المزامنة أعلاه لتصدير رحلاتك ورخصة السائق إلى Drive.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 rounded-xl bg-[#0a0f18] hover:bg-[#0e1422] border border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {file.mimeType.includes('folder') ? (
                          <Folder className="w-5 h-5 text-amber-400 shrink-0" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">{file.name}</h4>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                            <span>{formatFileSize(file.size)}</span>
                            {file.modifiedTime && (
                              <span>· {new Date(file.modifiedTime).toLocaleDateString('ar-SA')}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                            title="فتح في Google Drive"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        {/* Trigger explicit destructive confirmation modal */}
                        <button
                          type="button"
                          onClick={() => setFileToDelete(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="حذف الملف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mandatory User Confirmation Modal for Destructive Delete Operation */}
        {fileToDelete && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded-2xl bg-[#0e1420] border border-rose-500/40 p-6 shadow-2xl text-right rtl:text-right space-y-4 animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-rose-400">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">تأكيد حذف الملف من Google Drive</h3>
                  <span className="text-[11px] text-slate-400 font-mono">حذف نهائي لا يمكن التراجع عنه</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs space-y-1">
                <span className="text-slate-400 block text-[11px]">اسم الملف:</span>
                <span className="text-white font-mono font-bold block truncate">{fileToDelete.name}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذا الملف من حساب Google Drive الخاص بك؟ لن تتمكن من استعادته بعد الحذف.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFileToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteFile}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-950/50 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <span>جاري الحذف...</span>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>تأكيد الحذف نهائياً</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-[#070a10] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Cloud className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Drive API v3 · مشفرة سحابياً</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
