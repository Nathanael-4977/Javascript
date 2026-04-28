// --- Sélecteurs DOM ---
const customerForm = document.getElementById('customer-form');
const btnSave = document.getElementById('btn-save');
const btnUpdate = document.getElementById('btn-update');
const btnDelete = document.getElementById('btn-delete');
const btnCancel = document.getElementById('btn-cancel');


let selectedCustomerId = null;

async function loadCustomers() {
  const container = document.getElementById("customer-list");

  try {
    const res = await fetch("/api/persons");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No customers found.</p>";
      return;
    }

    data.forEach(person => {
      const div = document.createElement("div");
      div.className = "customer-card";

      div.innerHTML = `
        <strong>${person.first_name} ${person.last_name}</strong><br>
        Email: ${person.email}<br>
        Phone: ${person.phone || "-"}
      `;

      div.addEventListener("click", () => {
        populateForm(person);
      });

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red;'>Error loading data</p>";
  }
}


function populateForm(person) {
    selectedCustomerId = person.id;
    

    document.getElementById('customerId').value = person.id;
    document.getElementById('firstName').value = person.first_name;
    document.getElementById('lastName').value = person.last_name;
    document.getElementById('email').value = person.email;
    document.getElementById('phone').value = person.phone || "";
    

    if (person.birth_date) {
        document.getElementById('birthDate').value = person.birth_date.split('T')[0];
    } else {
        document.getElementById('birthDate').value = "";
    }

    btnSave.style.display = 'none';
    btnUpdate.style.display = 'inline-block';
    btnDelete.style.display = 'inline-block';
    btnCancel.style.display = 'inline-block';
}


function resetForm() {
    customerForm.reset();
    selectedCustomerId = null;
    document.getElementById('customerId').value = '';
    
    btnSave.style.display = 'inline-block';
    btnUpdate.style.display = 'none';
    btnDelete.style.display = 'none';
    btnCancel.style.display = 'none';
}


customerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    

    if(selectedCustomerId) return; 


    const formData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        birth_date: document.getElementById('birthDate').value,
    };

    try {
        const response = await fetch("/api/persons", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            resetForm();
            loadCustomers(); 
        }
    } catch (error) {
        console.error("Error creating person:", error);
    }
});


btnUpdate.addEventListener('click', async () => {
    if (!selectedCustomerId) return;

    const formData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        birth_date: document.getElementById('birthDate').value,
    };

    try {
        const response = await fetch(`/api/persons/${selectedCustomerId}`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            resetForm();
            loadCustomers();
        }
    } catch (error) {
        console.error("Error updating person:", error);
    }
});


btnDelete.addEventListener('click', async () => {
    if (!selectedCustomerId) return;

    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
        try {
            const response = await fetch(`/api/persons/${selectedCustomerId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                resetForm();
                loadCustomers();
            }
        } catch (error) {
            console.error("Error deleting person:", error);
        }
    }
});


btnCancel.addEventListener('click', resetForm);


loadCustomers();