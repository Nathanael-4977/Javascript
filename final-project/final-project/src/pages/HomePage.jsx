import Navbar from '../components/Navbar';
import ResourceForm from '../components/ResourceForm';
import ResourceList from '../components/ResourceList';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"><ResourceForm /></div>
          <div className="lg:col-span-1"><ResourceList /></div>
        </div>
      </main>
    </div>
  );
}