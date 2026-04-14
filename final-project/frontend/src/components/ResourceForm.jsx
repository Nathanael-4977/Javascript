export default function ResourceForm() {
  return (
    <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Resource Management</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input type="text" className="w-full p-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-brand-blue/30 outline-none transition-all" placeholder="e.g. Meeting Room A" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea className="w-full p-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-brand-blue/30 outline-none transition-all" rows="3" placeholder="Capacity, location..."></textarea>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Type</label>
          <select className="w-full p-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-brand-blue/30 outline-none bg-white">
            <option value="Room">Room</option>
            <option value="Equipment">Equipment</option>
          </select>
        </div>
        <div className="pt-4 flex gap-4">
          <button type="button" className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-rose/30 hover:-translate-y-0.5 transition-all">Create</button>
          <button type="button" className="flex-1 py-4 border border-black/10 rounded-2xl font-bold hover:bg-black/5 transition-all">Clear</button>
        </div>
      </form>
    </div>
  );
}