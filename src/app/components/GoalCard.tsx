import { Target } from 'lucide-react';

interface GoalCardProps {
  title: string;
  progress: number;
  total: number;
  color: string;
}

export function GoalCard({ title, progress, total, color }: GoalCardProps) {
  const percentage = (progress / total) * 100;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">{title}</h3>
        </div>
        <span className="text-sm text-slate-600">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-slate-600 mt-2">
        {progress} / {total}
      </p>
    </div>
  );
}
