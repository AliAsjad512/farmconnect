# 🌾 FarmConnect – Docker Network Practice Lab

A hands-on project for learning Docker networking. You'll see how:
- Containers on the **same** network talk to each other by **service name** (DNS)
- Containers on **different** networks are completely **invisible** to each other
- Only what you explicitly `ports:` is reachable from your host machine

---

## Project Layout

```
farmconnect/
├── docker-compose.yml   ← defines the network + all services
├── db/
│   └── init.sql         ← seed data loaded on first start
└── api/
    ├── Dockerfile
    ├── package.json
    └── server.js        ← Express API, connects to "db" by name
```

---

## Networks at a Glance

```
HOST MACHINE
│
│  port 3000 published ──────────────────────────┐
│                                                 │
│  ┌──────────── farmconnect-net ──────────────┐  │
│  │                                           │  │
│  │   farmconnect-api  ←──DNS──→  farmconnect-db│  │
│  │   (hostname: api)             (hostname: db)│  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌──────── other-project-net ──────────────┐    │
│  │                                         │    │
│  │   other-project-container               │    │
│  │   ✗ cannot reach "db" or "api"          │    │
│  │                                         │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

---

## Quick Start

```bash
# 1. Build & start everything
docker compose up --build

# 2. Hit the API
curl http://localhost:3000/health
curl http://localhost:3000/farms

# 3. Add a farm
curl -X POST http://localhost:3000/farms \
  -H "Content-Type: application/json" \
  -d '{"name":"Sunset Ranch","location":"Texas","crop":"Wheat"}'
```

---

## 🔬 Networking Exercises

Work through these in order. Each one teaches a concrete networking concept.

---

### Exercise 1 – Inspect the Network
```bash
# See all Docker networks on your machine
docker network ls

# Inspect the FarmConnect network (note the subnet and connected containers)
docker network inspect farmconnect-net

# Confirm the outsider is on a DIFFERENT network
docker network inspect other-project-net
```
**What to notice:** `farmconnect-net` lists two containers; `other-project-net` lists only the outsider.

---

### Exercise 2 – Docker DNS (name → IP)
```bash
# Shell into the API container
docker exec -it farmconnect-api sh

# Resolve "db" using Docker's built-in DNS
nslookup db
# ➜ returns the container's internal IP (e.g. 172.18.0.3)

ping db       # works! same network
exit
```
**Key insight:** `db` resolves because Docker runs a DNS server at 127.0.0.11 inside every container on a user-defined network.

---

### Exercise 3 – Prove Isolation
```bash
# Shell into the OUTSIDER container (different network)
docker exec -it other-project-container sh

# Try to reach the DB by name – should FAIL
nslookup db        # ✗ NXDOMAIN – DNS can't see it
ping db            # ✗ unknown host
ping farmconnect-db  # ✗ also fails

# Try the API – also fails (no route)
wget -qO- http://api:3000/health
exit
```
**Key insight:** Network isolation means zero DNS visibility AND zero routing.

---

### Exercise 4 – Connect the Outsider to FarmConnect Network
```bash
# Attach the outsider to farmconnect-net at runtime
docker network connect farmconnect-net other-project-container

# Now it can see both services!
docker exec -it other-project-container sh
nslookup db         # ✅ resolves now
nslookup api        # ✅ resolves too
wget -qO- http://api:3000/farms
exit

# Disconnect it again
docker network disconnect farmconnect-net other-project-container
```

---

### Exercise 5 – Port Publishing vs. Internal Port
```bash
# The DB has NO ports: published → you can't reach it from your host
psql -h localhost -U farm_user farmconnect   # ✗ connection refused

# But the API CAN reach the DB (same network, no publish needed)
docker exec farmconnect-api node -e "
  const {Pool}=require('pg');
  const p=new Pool({connectionString:process.env.DATABASE_URL});
  p.query('SELECT count(*) FROM farms').then(r=>console.log(r.rows));
"

# Now temporarily publish the DB port to your host
docker run --rm -it \
  --network farmconnect-net \
  -e PGPASSWORD=farm_pass \
  postgres:16-alpine \
  psql -h db -U farm_user -d farmconnect -c "SELECT * FROM farms;"
```

---

### Exercise 6 – Create Your Own Network from Scratch
```bash
# Create a brand-new bridge network
docker network create --driver bridge my-test-net

# Run a temporary nginx on it
docker run -d --name test-nginx --network my-test-net nginx:alpine

# Can the API reach it? (NO – different network)
docker exec farmconnect-api wget -qO- http://test-nginx

# Connect the API container to BOTH networks simultaneously
docker network connect my-test-net farmconnect-api

# Now it works!
docker exec farmconnect-api wget -qO- http://test-nginx | head -5

# Clean up
docker network disconnect my-test-net farmconnect-api
docker stop test-nginx && docker rm test-nginx
docker network rm my-test-net
```

---

### Exercise 7 – See the Internal DNS Server
```bash
docker exec -it farmconnect-api sh

# Docker's embedded DNS always lives at 127.0.0.11
cat /etc/resolv.conf
# nameserver 127.0.0.11

# Query it directly
nslookup api 127.0.0.11
nslookup db  127.0.0.11
exit
```

---

## API Reference

| Method | URL | Description |
|--------|-----|-------------|
| GET | /health | DB ping + network info |
| GET | /farms | List all farms |
| GET | /farms/:id | Get one farm |
| POST | /farms | Create a farm `{name, location, crop}` |
| DELETE | /farms/:id | Delete a farm |

---

## Tear Down

```bash
docker compose down          # stop containers, keep volume
docker compose down -v       # stop + delete DB volume (fresh start)
```
