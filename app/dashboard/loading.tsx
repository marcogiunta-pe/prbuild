export default function DashboardLoading() {
  return (
    <div className="max-w-5xl animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
      <div className="h-4 w-64 bg-gray-100 rounded mb-8" />
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
