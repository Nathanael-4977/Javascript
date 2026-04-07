export default function ResourceList() {
  // Données factices pour reproduire le visuel
  const resources = [
    { id: 1, name: "Meeting Room A", type: "room" },
    { id: 2, name: "Projector X1", type: "equipment" }
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
      <h3 className="font-bold text-lg mb-2">Existing Resources</h3>
      <p className="text-sm text-black/50 mb-4">Click an item to edit or delete it.</p>
      
      <div className="space-y-3">
        {resources.map((res) => (
          <button key={res.id} className="w-full text-left p-4 rounded-2xl border border-black/10 hover:bg-black/5 transition">
            <div className="font-semibold">{res.name}</div>
            <div className="text-xs mt-2 inline-block rounded bg-black/10 px-2 py-1 uppercase">{res.type}</div>
          </button>
        ))}
      </div>
    </div>
  );
}