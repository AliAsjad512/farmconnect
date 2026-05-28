# 🌾 FarmConnect

**A full-stack farm management app built to learn Docker Networking from scratch.**

<img width="1830" height="866" alt="image" src="https://github.com/user-attachments/assets/2b0144c5-4166-469b-833f-05a76aa7b64a" />


---

## 🚀 What is FarmConnect?

FarmConnect is a full-stack application deployed entirely on Docker. It was built as a hands-on project to learn Docker networking — how containers communicate by name, how networks isolate services, and how to deploy a real app on AWS EC2.

---

## 🏗️ Architecture

```
Browser
   │
   ▼
React Frontend (port 80)
   │
   ▼
┌──────────── farmconnect-net ─────────────┐
│                                          │
│   Node.js / Express API  (port 5000)     │
│              │                           │
│              └──── Docker DNS ────►      │
│                    farmconnect-db        │
│                                          │
└──────────────────────────────────────────┘
         │
         ▼
   Supabase Cloud (PostgreSQL)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js + Express |
| Database | PostgreSQL (Supabase) |
| Containerization | Docker |
| Networking | Docker Bridge Network |
| Cloud | AWS EC2 |

---

## 📦 Project Structure

```
farmconnect/
├── api/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── db/
│   └── init.sql
└── docker-compose.yml
```

---

## 🔧 Setup & Deployment

### 1. Create Docker Network
```bash
docker network create --driver bridge farmconnect-net
```

### 2. Build & Run API
```bash
cd api
docker build -t farmconnect-api:latest .
docker run -d --name farmconnect-api \
  --network farmconnect-net \
  -p 5000:5000 \
  -e "DATABASE_URL=your_supabase_url" \
  farmconnect-api:latest
```

### 3. Verify Network
```bash
docker network inspect farmconnect-net
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | API + DB status |
| GET | /farms | List all farms |
| POST | /farms | Add a new farm |
| DELETE | /farms/:id | Delete a farm |

---

## 🔬 Key Docker Networking Concepts Learned

**1. Container DNS Resolution**
Containers on the same network talk by name — not IP:
```bash
# Inside the API container:
nslookup farmconnect-db
# Returns: 172.18.0.2
```

**2. Network Isolation**
Containers on different networks cannot see each other at all.

**3. Port Publishing**
Only the API exposes a port to the host. The DB is internal only.

---

## 🐛 Real Errors Solved

| Error | Fix |
|---|---|
| SSH Permission denied | Used HTTPS clone |
| `@` breaking terminal | Wrapped URL in quotes |
| Image not found | Built with `docker build` first |
| IPv6 not supported | Used Supabase Session Pooler |
| SSL certificate error | Added `rejectUnauthorized: false` |
| Wrong pooler host | Changed `aws-0` → `aws-1` |
| Table doesn't exist | Created table via Supabase SQL Editor |
| CORS blocking frontend | Added `cors` package to API |

---

## 📸 Screenshots

![FarmConnect Dashboard](farmconnect-screenshot.png)

---

## 👨‍💻 Author

Built by **Ali Asjad** — learned Docker networking from scratch in one day.

---

## ⭐ Give it a star if this helped you learn Docker networking!
