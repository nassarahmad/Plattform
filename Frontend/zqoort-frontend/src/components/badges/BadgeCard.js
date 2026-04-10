export default function BadgeCard({ badge, earned = false, showProgress = false, progress = 0 }) {
  return (
    <div className={`p-4 rounded-xl border-2 transition ${
      earned 
        ? 'border-success bg-green-50 shadow-md' 
        : 'border-gray-200 bg-gray-50 opacity-75'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{badge.icon || '🏅'}</span>
        <div className="flex-1">
          <h4 className="font-bold text-sm">{badge.name}</h4>
          <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
          
          {showProgress && !earned && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>التقدم</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        {earned && (
          <span className="px-2 py-1 bg-success text-white text-xs rounded-full">
            ✓ مكتسبة
          </span>
        )}
      </div>
      
      {badge.xpReward > 0 && (
        <div className="mt-2 text-xs text-primary font-medium">
          +{badge.xpReward} نقطة خبرة 🎯
        </div>
      )}
    </div>
  );
}