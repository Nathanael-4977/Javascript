import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-black text-white px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-brand-rose text-white font-bold p-2 rounded-xl text-sm">BS</div>
        <div>
          <h1 className="font-bold text-lg leading-tight">Booking System</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* On utilise <Link> au lieu de <button> pour le Routing */}
        <Link to="/" className="px-4 py-2 rounded-xl border border-white/20 text-sm font-semibold hover:bg-white/10 transition">
          Home
        </Link>
        <Link to="/form" className="px-4 py-2 rounded-xl border border-white/20 text-sm font-semibold hover:bg-white/10 transition">
          Book Form
        </Link>
        <button className="px-6 py-2 bg-brand-rose text-white rounded-xl text-sm font-semibold shadow-lg hover:opacity-90 transition">
          Sign out
        </button>
      </div>
    </header>
  );
}