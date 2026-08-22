export default function DayBlock({ dayNumber, activities = [] }) {
  return (
    <section className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold mb-3">Day {dayNumber}</h3>
      {activities.length === 0 ? (
        <p className="text-sm text-stone-400">No activities added yet.</p>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="py-2 text-sm border-b border-stone-100 last:border-0">
            {activity.name}
          </div>
        ))
      )}
    </section>
  );
}