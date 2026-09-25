import React from 'react';
import { Poll } from '../../types';
import { MapPin, Clock, Wrench, CheckCircle2, Circle, BarChart3, Users } from 'lucide-react';

interface InteractivePollProps {
  poll: Poll;
  onVote: (optionId: string) => void;
  className?: string;
  compact?: boolean;
}

export const InteractivePoll: React.FC<InteractivePollProps> = ({
  poll,
  onVote,
  className = '',
  compact = false,
}) => {
  const hasVoted = Boolean(poll.userVotedOptionId);

  // Category Icon & Label
  const categoryMeta = {
    destination: {
      label: 'تصويت الوجهة والمسار',
      icon: <MapPin className="w-3.5 h-3.5 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    },
    time: {
      label: 'تصويت موعد وتوقيت التجمع',
      icon: <Clock className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    },
    equipment: {
      label: 'تصويت التجهيزات والمسار',
      icon: <Wrench className="w-3.5 h-3.5 text-sky-400" />,
      color: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    },
    general: {
      label: 'استطلاع رأي الأعضاء',
      icon: <BarChart3 className="w-3.5 h-3.5 text-slate-300" />,
      color: 'border-white/10 bg-white/5 text-slate-300',
    },
  }[poll.category || 'general'];

  // Determine highest vote count to highlight leading choice
  const highestVotes = Math.max(...poll.options.map((o) => o.votesCount), 0);

  return (
    <div
      className={`rounded-xl bg-[#0c1017] border border-white/10 p-4 space-y-3 relative overflow-hidden ${className}`}
    >
      {/* Poll Header */}
      <div className="flex items-center justify-between gap-2">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${categoryMeta.color}`}>
          {categoryMeta.icon}
          <span>{categoryMeta.label}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
          <Users className="w-3 h-3 text-slate-500" />
          <span className="tabular-nums font-bold text-white">{poll.totalVotes}</span>
          <span>صوت</span>
        </div>
      </div>

      {/* Question */}
      <h4 className="text-sm font-bold text-white leading-snug">
        {poll.question}
      </h4>

      {/* Poll Options */}
      <div className="space-y-2">
        {poll.options.map((option) => {
          const isSelected = poll.userVotedOptionId === option.id;
          const percentage = poll.totalVotes > 0 ? Math.round((option.votesCount / poll.totalVotes) * 100) : 0;
          const isLeading = highestVotes > 0 && option.votesCount === highestVotes;

          return (
            <button
              key={option.id}
              onClick={() => onVote(option.id)}
              className={`w-full group relative flex items-center justify-between p-3 rounded-xl border text-right rtl:text-right transition-all overflow-hidden active:scale-[0.99] focus:outline-none ${
                isSelected
                  ? 'border-emerald-500/50 bg-[#121c25]'
                  : 'border-white/5 hover:border-white/15 bg-[#141b24]'
              }`}
            >
              {/* Animated Progress Bar fill */}
              <div
                className={`absolute inset-y-0 right-0 rtl:right-0 rtl:left-auto left-0 transition-all duration-500 ease-out pointer-events-none ${
                  isSelected
                    ? 'bg-emerald-500/20'
                    : isLeading
                    ? 'bg-amber-500/15'
                    : 'bg-white/[0.04]'
                }`}
                style={{ width: `${percentage}%` }}
              />

              {/* Option Text and Check indicator */}
              <div className="relative z-10 flex items-center gap-2.5 flex-1 min-w-0 pr-1 rtl:pr-1 rtl:pl-2">
                <div className="shrink-0">
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  )}
                </div>
                <span
                  className={`text-xs font-semibold truncate ${
                    isSelected ? 'text-white' : 'text-slate-200'
                  }`}
                >
                  {option.text}
                </span>
                {isLeading && poll.totalVotes > 1 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium shrink-0">
                    المتصدر
                  </span>
                )}
              </div>

              {/* Vote Count & Percentage */}
              <div className="relative z-10 flex items-center gap-2 text-xs font-mono shrink-0 pl-1 rtl:pl-1 rtl:pr-2">
                <span className="text-slate-400 text-[11px] tabular-nums">
                  ({option.votesCount})
                </span>
                <span
                  className={`font-bold tabular-nums ${
                    isSelected ? 'text-emerald-400' : isLeading ? 'text-amber-400' : 'text-slate-300'
                  }`}
                >
                  {percentage}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer / Helper note */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <span>
          {hasVoted ? 'انقر على خيار آخر لتغيير تصويتك' : 'انقر على أي خيار للمشاركة في التصويت'}
        </span>
        {poll.expiresAt && (
          <span className="font-mono text-slate-500">ينتهي: {poll.expiresAt}</span>
        )}
      </div>
    </div>
  );
};
