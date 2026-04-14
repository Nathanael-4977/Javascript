CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    booking_date DATE NOT NULL
);