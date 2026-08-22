export default function ActivityCard({ activity, onAdd }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold">{activity?.name || 'Activity'}</h3>
      <p className="text-xs text-stone-500 mb-2">
        {activity?.category} · ~{activity?.duration_minutes || 60} min
      </p>
      {onAdd && <button onClick={() => onAdd(activity)} className="text-sm text-clay">+ Add</button>}
    </div>
  );
}