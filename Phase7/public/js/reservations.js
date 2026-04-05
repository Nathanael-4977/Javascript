window.logout = function() {
    localStorage.removeItem("token");
    window.location.href = "/login.html"; // Redirige vers la page de connexion
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reservationForm");
    const listEl = document.getElementById("reservationList");
    const msgEl = document.getElementById("formMessage");
    
    // Boutons
    const btnCreate = document.getElementById("btnCreate");
    const btnUpdate = document.getElementById("btnUpdate");
    const btnDelete = document.getElementById("btnDelete");
    const btnClear = document.getElementById("btnClear");

    // Inputs
    const idInput = document.getElementById("reservationId");
    const resourceInput = document.getElementById("resourceId");
    const userInput = document.getElementById("userId");
    const startInput = document.getElementById("startTime");
    const endInput = document.getElementById("endTime");
    const noteInput = document.getElementById("note");
    const statusInput = document.getElementById("status");

    const token = localStorage.getItem("token");

    // --- GESTION DYNAMIQUE DU HEADER ---
    const userElements = document.querySelectorAll('[data-auth="user"]');
    const guestElements = document.querySelectorAll('[data-auth="guest"]');

    if (token) {
        guestElements.forEach(el => el.classList.add("hidden"));
        userElements.forEach(el => {
            el.classList.remove("hidden", "cursor-not-allowed", "pointer-events-none");
        });
    } else {
        window.location.href = "/login.html";
    }

    window.logout = function() {
        localStorage.removeItem("token");
        window.location.href = "/login.html";
    };
    // -----------------------------------

    // --- VALIDATION VISUELLE (Rouge / Vert) ---
    function setInputVisualState(input, state) {
        input.classList.remove(
            "border-green-500", "bg-green-100", "focus:ring-green-500/30",
            "border-red-500", "bg-red-100", "focus:ring-red-500/30",
            "focus:border-brand-blue", "focus:ring-brand-blue/30"
        );
        input.classList.add("focus:ring-2");

        if (state === "valid") {
            input.classList.add("border-green-500", "bg-green-100", "focus:ring-green-500/30");
        } else if (state === "invalid") {
            input.classList.add("border-red-500", "bg-red-100", "focus:ring-red-500/30");
        } else {
            input.classList.add("focus:border-brand-blue", "focus:ring-brand-blue/30", "border-black/10", "bg-white");
        }
    }

    function validateNumberInput(input) {
        const val = input.value;
        if (val === "") {
            setInputVisualState(input, "neutral");
            return false;
        }
        const isValid = !isNaN(val) && Number(val) > 0;
        setInputVisualState(input, isValid ? "valid" : "invalid");
        return isValid;
    }

    function validateDateInput(input) {
        const isValid = input.value !== "";
        setInputVisualState(input, isValid ? "valid" : "invalid");
        return isValid;
    }

    function validateNoteInput(input) {
        const val = input.value.trim();
        // Si c'est vide, on le remet en neutre (en supposant que la note est facultative)
        if (val === "") {
            setInputVisualState(input, "neutral");
            return true;
        }
        
        const isValid = val.length <= 50;
        setInputVisualState(input, isValid ? "valid" : "invalid");
        return isValid;
    }


    // Attacher les événements de validation en temps réel
    [resourceInput, userInput].forEach(input => {
        input.addEventListener("input", () => validateNumberInput(input));
    });

    [startInput, endInput].forEach(input => {
        input.addEventListener("change", () => validateDateInput(input));
    });

    noteInput.addEventListener("input", () => validateNoteInput(noteInput));
    // ------------------------------------------

    const formatForInput = (isoString) => {
        if (!isoString) return "";
        return new Date(isoString).toISOString().slice(0, 16);
    };

    const showMessage = (msg, isError = false) => {
        msgEl.textContent = msg;
        // On écrit les classes en entier pour que le CDN Tailwind les détecte correctement
        msgEl.className = "mt-6 rounded-2xl border px-4 py-3 text-sm";
        if (isError) {
            msgEl.classList.add("border-rose-200", "bg-rose-50", "text-rose-900");
        } else {
            msgEl.classList.add("border-emerald-200", "bg-emerald-50", "text-emerald-900");
        }
        msgEl.classList.remove("hidden");
    };

    async function apiCall(url, method = "GET", body = null) {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        
        const config = { method, headers };
        if (body) config.body = JSON.stringify(body);

        const res = await fetch(url, config);
        
        if (res.status === 204) return { ok: true };
        
        const data = await res.json().catch(() => ({}));
        return { ok: res.ok, status: res.status, data };
    }

    async function loadReservations() {
        const res = await apiCall("/api/reservations");
        if (!res.ok) {
            listEl.innerHTML = `<p class="text-sm text-brand-rose">Failed to load reservations.</p>`;
            return;
        }

        const reservations = res.data.data || res.data; 
        
        if (!reservations || reservations.length === 0) {
            listEl.innerHTML = `<p class="text-sm text-black/50">No reservations found.</p>`;
            return;
        }

        listEl.innerHTML = reservations.map(r => {
            // Adaptation pour gérer camelCase ET snake_case depuis la base de données
            const resId = r.resourceId || r.resource_id;
            const usrId = r.userId || r.user_id;
            const sTime = r.startTime || r.start_time;
            
            return `
            <button type="button" onclick='selectReservation(${JSON.stringify(r).replace(/'/g, "&#39;")})' 
                class="w-full text-left rounded-2xl border border-black/10 bg-white px-4 py-3 transition hover:bg-black/5">
                <div class="font-semibold text-sm">Resource ${resId} (User ${usrId})</div>
                <div class="text-xs text-black/60">${new Date(sTime).toLocaleString()}</div>
                <div class="text-xs mt-1 inline-block rounded bg-black/10 px-2">${r.status}</div>
            </button>
            `;
        }).join("");
    }

    window.selectReservation = (r) => {
        idInput.value = r.id;
        
        // On gère les deux formats ici aussi
        resourceInput.value = r.resourceId || r.resource_id || "";
        userInput.value = r.userId || r.user_id || "";
        
        const sTime = r.startTime || r.start_time;
        const eTime = r.endTime || r.end_time;
        
        startInput.value = formatForInput(sTime);
        endInput.value = formatForInput(eTime);
        noteInput.value = r.note || "";
        statusInput.value = r.status;

        // Force la validation visuelle au chargement
        validateNumberInput(resourceInput);
        validateNumberInput(userInput);
        validateDateInput(startInput);
        validateDateInput(endInput);
        validateNoteInput(noteInput); // N'oublie pas celle-ci qu'on a ajoutée tout à l'heure !

        btnCreate.classList.add("hidden");
        btnUpdate.classList.remove("hidden");
        btnDelete.classList.remove("hidden");
        msgEl.classList.add("hidden");
    };

    btnClear.addEventListener("click", () => {
        form.reset();
        idInput.value = "";
        
        // Réinitialise les couleurs
        [resourceInput, userInput, startInput, endInput].forEach(input => setInputVisualState(input, "neutral"));

        btnCreate.classList.remove("hidden");
        btnUpdate.classList.add("hidden");
        btnDelete.classList.add("hidden");
        msgEl.classList.add("hidden");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if(idInput.value) return; 

        // Vérification de sécurité avant l'envoi
        if(!validateNumberInput(resourceInput) || !validateNumberInput(userInput) || !validateDateInput(startInput) || !validateDateInput(endInput)) {
            showMessage("Veuillez remplir correctement tous les champs requis.", true);
            return;
        }

        const payload = {
            resourceId: Number(resourceInput.value),
            userId: Number(userInput.value),
            startTime: new Date(startInput.value).toISOString(),
            endTime: new Date(endInput.value).toISOString(),
            note: noteInput.value,
            status: statusInput.value
        };

        const res = await apiCall("/api/reservations", "POST", payload);
        if (res.ok) {
            // 1. On nettoie le formulaire d'abord (ce qui cache les anciens messages)
            btnClear.click();
            // 2. On affiche le message de succès ensuite !
            showMessage("Reservation created successfully!");
            // 3. On recharge la liste
            loadReservations();
        } else {
            showMessage(`Error: ${res.data.error || "Could not create reservation"}`, true);
        }
    });

    btnUpdate.addEventListener("click", async () => {
        const id = idInput.value;
        const payload = {
            resourceId: Number(resourceInput.value),
            userId: Number(userInput.value),
            startTime: new Date(startInput.value).toISOString(),
            endTime: new Date(endInput.value).toISOString(),
            note: noteInput.value,
            status: statusInput.value
        };

        const res = await apiCall(`/api/reservations/${id}`, "PUT", payload);
        if (res.ok) {
            showMessage("Reservation updated successfully!");
            loadReservations();
        } else {
            showMessage(`Error: ${res.data.error || "Could not update"}`, true);
        }
    });

    btnDelete.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete this reservation?")) return;
        
        const id = idInput.value;
        const res = await apiCall(`/api/reservations/${id}`, "DELETE");
        if (res.ok) {
            // 1. On clique sur Clear en premier pour vider l'écran
            btnClear.click();
            // 2. Ensuite seulement, on affiche notre beau message de succès
            showMessage("Reservation deleted successfully!");
            // 3. On met à jour la liste sur la droite
            loadReservations();
        } else {
            showMessage("Error deleting reservation.", true);
        }
    });

    loadReservations();
});