import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch('/api/bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">All Bookings</h2>
          
          {loading ? (
            <p className="text-gray-500">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">No bookings found in the database.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4 border border-black/10 rounded-xl bg-gray-50 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg">{booking.full_name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{booking.email}</p>
                  <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                    Date: {new Date(booking.booking_date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}