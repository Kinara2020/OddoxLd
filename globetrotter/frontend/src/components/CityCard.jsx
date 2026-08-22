export default function CityCard({ city }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold">{city?.name || 'City'}</h3>
      <p className="text-sm text-stone-500">{city?.country}</p>
    </div>
  );
}