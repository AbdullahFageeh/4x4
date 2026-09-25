import React from 'react';
import { Community, CommunityActivity } from '../../types';
import { CategoryIconBadge } from '../common/AutomotiveArt';
import { Users, Compass, MapPin, Check, Plus, ShieldCheck, Sparkles } from 'lucide-react';

interface CommunityCardProps {
  community: Community;
  latestActivity?: CommunityActivity;
  onSelect: (community: Community) => void;
  onToggleJoin: (communityId: string, e: React.MouseEvent) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  latestActivity,
  onSelect,
  onToggleJoin,
}) => {
  return (
    <div
      onClick={() => onSelect(community)}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#111722] hover:bg-[#151c2a] border border-white/10 hover:border-emerald-500/30 transition-all duration-200 cursor-pointer overflow-hidden p-5 shadow-lg shadow-black/40"
    >
      {/* Top Banner & Category */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <CategoryIconBadge category={community.category} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {community.name}
                </h3>
                {community.isVerified && (
                  <span title="مجتمع مرخص وموثق" className="inline-flex">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {community.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed mb-3">
          {community.description}
        </p>

        {/* Latest Activity Snippet */}
        {latestActivity && (
          <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-[#0c1017] border border-white/5 text-[11px] text-slate-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            <span className="text-slate-400 shrink-0">آخر تحديث:</span>
            <span className="truncate text-slate-200 font-medium">
              {latestActivity.title || latestActivity.content}
            </span>
          </div>
        )}
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
        {/* Unboxed Metadata (Zero-Pill Discipline) */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{community.city}</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="tabular-nums font-semibold text-slate-200">{community.membersCount}</span> عضو
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="tabular-nums font-semibold text-slate-200">{community.tripsCount}</span> قافلة
          </span>
        </div>

        {/* Join / Joined Toggle Action Button */}
        <button
          onClick={(e) => onToggleJoin(community.id, e)}
          className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 shrink-0 ${
            community.isJoined
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40'
          }`}
        >
          {community.isJoined ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>مشترك</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>انضمام</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
