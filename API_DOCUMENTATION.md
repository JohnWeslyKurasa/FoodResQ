# FoodResQ API Documentation & Endpoint Specification

Base Production URL: `https://foodresq-b9nq.onrender.com/api/v1`  
Local Development URL: `http://localhost:5000/api/v1`

---

## 🔐 1. Authentication Endpoints (`/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new account (Donor, Recipient, Volunteer) with coordinates & role details |
| `POST` | `/auth/login` | Public | Authenticate with email & password, returns JWT token |
| `GET` | `/auth/me` | Private | Retrieve authenticated profile |
| `PATCH` | `/auth/profile` | Private | Update user details, avatar, and phone |

### Register Request Payload Example:
```json
{
  "name": "Paradise Biryani House",
  "email": "chef@paradise.com",
  "password": "password123",
  "phone": "+91 98491 55001",
  "role": "donor",
  "organizationName": "Paradise Biryani & Banquet",
  "organizationType": "Restaurant",
  "address": "Plot 12, Hitech City Main Rd, Madhapur, Hyderabad",
  "latitude": 17.4483,
  "longitude": 78.3826,
  "avgDailyMeals": 60
}
```

---

## 🍲 2. Surplus Food Donations (`/donations`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/donations` | Public | Query available surplus listings (supports `?status=AVAILABLE&category=Vegetarian`) |
| `POST` | `/donations` | Donor | Create a new surplus food lot with countdown & allergens |
| `GET` | `/donations/my` | Donor | Get all listings posted by current donor |
| `GET` | `/donations/nearby` | Recipient | Geospatial proximity search within radius |
| `GET` | `/donations/:id` | Public | Get single donation details & donor info |
| `PATCH` | `/donations/:id` | Donor | Update donation portions, deadline, or notes |
| `DELETE` | `/donations/:id` | Donor/Admin | Cancel or delete donation |

---

## 🤝 3. Food Requests & Reservations (`/requests`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/requests` | Recipient | Claim / reserve surplus meals (with atomic availability check) |
| `GET` | `/requests/my` | Recipient/Donor | Retrieve current user's food requests |
| `GET` | `/requests/:id` | Private | View specific request details & status history |
| `PATCH` | `/requests/:id/accept` | Donor | Accept food request and trigger pickup token generation |
| `PATCH` | `/requests/:id/reject` | Donor | Reject request with reason (auto-restores inventory) |
| `PATCH` | `/requests/:id/cancel` | Recipient | Cancel reservation before pickup |

---

## 🔑 4. Cryptographic Pickup & Handover Protocol (`/pickup`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/pickup/:requestId/generate` | Private | Generate single-use 6-digit OTP and QR token |
| `POST` | `/pickup/:requestId/verify` | Volunteer | Verify recipient's 6-digit OTP at physical delivery |
| `POST` | `/pickup/:requestId/confirm` | Volunteer | Finalize delivery handover, record rating & remarks |

---

## 📊 5. Public Directory & Impact Telemetry (`/dashboard`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/dashboard/impact` | Public | Telemetry metrics: meals served, EPA CO₂ offsets, locality breakdown |
| `GET` | `/dashboard/organizations` | Public | Directory of verified donors, NGOs, and volunteer fleet |
| `GET` | `/dashboard/donor` | Donor | Donor metrics, pending claims, and active listings |
| `GET` | `/dashboard/recipient` | Recipient | Matched food, accepted pickups, and claim history |
| `GET` | `/dashboard/volunteer` | Volunteer | Transit dispatch tasks, pickup routes, and delivery log |

---

## 🛡️ 6. Platform Administration (`/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/admin/stats` | Admin | Real-time platform metrics and counts |
| `GET` | `/admin/users` | Admin | User registry with verification and suspension status |
| `PATCH` | `/admin/users/:id/verify` | Admin | Toggle partner organization verification badge |
| `PATCH` | `/admin/users/:id/suspend` | Admin | Suspend or unsuspend account |
| `GET` | `/admin/listings` | Admin | View all system listings with moderation control |
| `DELETE` | `/admin/listings/:id` | Admin | Force remove unsafe or invalid food listing |
| `GET` | `/admin/reports` | Admin | View dispute and safety reports |
| `PATCH` | `/admin/reports/:id/resolve`| Admin | Mark safety dispute as resolved |

---

## 🔔 7. Real-Time Push Events (Socket.IO)

- `notification`: Emitted to personal user rooms upon status changes.
- `new_donation`: Broadcast when a donor posts surplus matching nearby shelters.
- `pickup_verified`: Notifies the recipient when the volunteer verifies their OTP code.
