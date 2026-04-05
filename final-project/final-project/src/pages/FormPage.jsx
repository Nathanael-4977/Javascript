import { useState } from "react";
import { z } from "zod";
import Navbar from "../components/Navbar"; // On réutilise le design !

// 1. Définition du schéma Zod pour la validation (Exigence pour les 2 points)
const bookingSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  bookingDate: z.string().min(1, "Please select a date"),
});

export default function FormPage() {
  // 2. Gestion de l'état (State)
  const [formData, setFormData] = useState({ fullName: "", email: "", bookingDate: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Mise à jour de l'état quand l'utilisateur tape
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // 3. Envoi au serveur (httpbin)
  async function handleSubmit(e) {
    e.preventDefault(); // Empêche la page de se recharger
    setApiResponse(null);

    // Validation Zod
    const validation = bookingSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach(issue => fieldErrors[issue.path[0]] = issue.message);
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Envoi de la requête POST
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const data = await response.json();
      setApiResponse(data); // Sauvegarde la réponse
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans">
      {/* On garde la même Navbar pour la cohérence visuelle */}
      <Navbar />
      
      <main className="max-w-2xl mx-auto p-8">
        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Book a Resource</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input 1 : Texte */}
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-brand-rose/30 outline-none" />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Input 2 : Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-brand-rose/30 outline-none" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Input 3 : Date */}
            <div>
              <label className="block text-sm font-semibold mb-2">Booking Date</label>
              <input type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} className="w-full p-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-brand-rose/30 outline-none" />
              {errors.bookingDate && <p className="text-red-500 text-xs mt-1">{errors.bookingDate}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-brand-rose text-white rounded-2xl font-bold shadow-lg mt-4 disabled:opacity-50">
              {loading ? "Sending..." : "Submit Booking"}
            </button>
          </form>

          {/* 4. Affichage de la réponse du serveur */}
          {apiResponse && (
            <div className="mt-8 p-4 bg-black/5 rounded-2xl border border-black/10">
              <h3 className="font-bold mb-2 text-green-600">✅ Success! Server Response:</h3>
              <pre className="text-xs bg-black text-white p-4 rounded-xl overflow-x-auto">
                {JSON.stringify(apiResponse.json, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}