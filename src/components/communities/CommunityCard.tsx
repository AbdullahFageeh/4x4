import React from 'react';
import { Community, CommunityActivity } from '../../types';
import { CategoryIconBadge } from '../common/AutomotiveArt';
import { ShieldCheck, Plus, Check } from 'lucide-react';

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
      className="group relative flex flex-col justify-between bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(212,175,55,0.04)] border border-[rgba(235,233,228,0.08)] hover:border-[#D4AF37] transition-all duration-200 cursor-pointer overflow-hidden p-5 shadow-lg flex-1"
    >
      {/* Top Banner & Category */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <CategoryIconBadge category={community.category} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-lg font-bold text-[#EBE9E4] group-hover:text-[#D4AF37] transition-colors">
                  {community.name}
                </h3>
                {community.isVerified && (
                  <span title="مجتمع مرخص وموثق" className="inline-flex">
                    <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-xs text-[#EBE9E4]/60 line-clamp-1 mt-0.5 font-sans">
                {community.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-[#EBE9E4]/70 line-clamp-2 leading-relaxed mb-3 font-sans">
          {community.description}
        </p>

        {/* Latest Activity Snippet */}
        {latestActivity && (
          <div className="mb-3 px-2.5 py-1.5 bg-black/40 border border-[rgba(235,233,228,0.06)] text-[11px] text-[#EBE9E4]/70 flex items-center gap-2 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 animate-pulse" />
            <span className="text-[#EBE9E4]/40 shrink-0">آخر نشاط:</span>
            <span className="truncate text-[#EBE9E4] font-medium font-sans">
              {latestActivity.title || latestActivity.content}
            </span>
          </div>
        )}
      </div>

      {/* Footer Stats & Actions */}
      <div className="pt-3 border-t border-[rgba(235,233,228,0.06)] flex items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-3 text-[#EBE9E4]/50">
          <span>
            <strong className="text-[#EBE9E4] font-bold">{community.membersCount}</strong> عضو
          </span>
          <span>·</span>
          <span>
            <strong className="text-[#EBE9E4] font-bold">{community.tripsCount}</strong> قافلة
          </span>
        </div>

        {/* Join Button */}
        <button
          onClick={(e) => onToggleJoin(community.id, e)}
          className={`min-h-[34px] px-3.5 py-1 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer ${
            community.isJoined
              ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/25'
              : 'bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#151412]'
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
