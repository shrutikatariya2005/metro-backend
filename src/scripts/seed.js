// src/scripts/seed.js
// ══════════════════════════════════════════════════════════════════════════════
// Real-world Surat Sitilink BRTS data seed
// Stations, routes, fares and schedules based on actual Surat BRTS corridors.
// Fare structure: distance slabs (₹5 min, ₹5 per 4 km slab approx.)
// ══════════════════════════════════════════════════════════════════════════════
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import Station from "../models/Station.model.js";
import Route from "../models/Route.model.js";
import Fare from "../models/Fare.model.js";
import Schedule from "../models/Schedule.model.js";

dotenv.config();

// ── Fare slab calculator (mirrors real Sitilink logic) ────────────────────────
// ≤4 km → ₹5  |  ≤8 km → ₹10  |  ≤12 km → ₹15  |  ≤16 km → ₹20  |  >16 km → ₹25
const slabFare = (km) => {
  if (km <= 4)  return 5;
  if (km <= 8)  return 10;
  if (km <= 12) return 15;
  if (km <= 16) return 20;
  return 25;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  Connected to MongoDB Atlas...");

    // ── Wipe existing data ──────────────────────────────────────────────────
    await Promise.all([
      User.deleteMany({}),
      Station.deleteMany({}),
      Route.deleteMany({}),
      Fare.deleteMany({}),
      Schedule.deleteMany({}),
    ]);
    console.log("🗑️   Cleared existing data.");

    // ── Staff accounts ──────────────────────────────────────────────────────
    await User.create({
      name: "Admin User",
      email: "admin@metro.com",
      passwordHash: "password",
      role: "admin",
    });
    await User.create({
      name: "Manager User",
      email: "manager@metro.com",
      passwordHash: "password",
      role: "manager",
    });
    console.log("👤  Staff accounts created.");

    // ────────────────────────────────────────────────────────────────────────
    // STATIONS — Real Surat Sitilink BRTS stops
    // ────────────────────────────────────────────────────────────────────────
    const stationsData = [
      // Corridor 1 — Udhna Darwaja → Sachin GIDC (Route 11)
      { stationCode: "UDW", stationName: "Udhna Darwaja", location: "Udhna, Surat", zone: "South" },
      { stationCode: "UDS", stationName: "Udhna Station", location: "Udhna, Surat", zone: "South" },
      { stationCode: "AMB", stationName: "Amroli", location: "Amroli, Surat", zone: "South" },
      { stationCode: "KTL", stationName: "Kim Terminal", location: "Kim, Surat", zone: "South" },
      { stationCode: "SAC", stationName: "Sachin GIDC Naka", location: "Sachin, Surat", zone: "South" },

      // Corridor 2 — Sarthana Nature Park → ONGC Colony (Route 12)
      { stationCode: "SNP", stationName: "Sarthana Nature Park", location: "Sarthana, Surat", zone: "East" },
      { stationCode: "SJN", stationName: "Sarthana Jakat Naka", location: "Sarthana, Surat", zone: "East" },
      { stationCode: "VAR", stationName: "Varachha", location: "Varachha, Surat", zone: "East" },
      { stationCode: "KTW", stationName: "Katargam", location: "Katargam, Surat", zone: "Central" },
      { stationCode: "RLY", stationName: "Surat Railway Station", location: "City Centre, Surat", zone: "Central" },
      { stationCode: "ONG", stationName: "ONGC Colony", location: "Magdalla, Surat", zone: "West" },

      // Corridor 3 — Adajan → Pal (Route 17A)
      { stationCode: "ADJ", stationName: "Adajan BRTS", location: "Adajan, Surat", zone: "West" },
      { stationCode: "PAL", stationName: "Pal RTO", location: "Pal, Surat", zone: "West" },
      { stationCode: "VES", stationName: "Vesu", location: "Vesu, Surat", zone: "South-West" },
      { stationCode: "ALT", stationName: "Althan", location: "Althan, Surat", zone: "South-West" },

      // Corridor 4 — City Centre Stops
      { stationCode: "ATW", stationName: "Athwa Gate", location: "Athwa, Surat", zone: "Central" },
      { stationCode: "NAN", stationName: "Nanpura", location: "Nanpura, Surat", zone: "Central" },
      { stationCode: "CRL", stationName: "Canal Road", location: "Canal Road, Surat", zone: "Central" },
      { stationCode: "PST", stationName: "Parle Point", location: "Athwa, Surat", zone: "Central" },
      { stationCode: "BHT", stationName: "Bhatar", location: "Bhatar, Surat", zone: "East" },

      // Extra notable stops
      { stationCode: "KMS", stationName: "Kamrej Terminal", location: "Kamrej, Surat", zone: "East" },
      { stationCode: "JPR", stationName: "Jahangirpura", location: "Jahangirpura, Surat", zone: "North" },
      { stationCode: "SDB", stationName: "Surat Diamond Bourse", location: "Khajod, Surat", zone: "South-West" },
      { stationCode: "VED", stationName: "Ved Road", location: "Piplod, Surat", zone: "South" },
    ];

    const stations = {};
    for (const s of stationsData) {
      stations[s.stationCode] = await Station.create(s);
    }
    console.log(`🚉  ${stationsData.length} stations created.`);

    // ────────────────────────────────────────────────────────────────────────
    // ROUTES — Real Surat BRTS corridors
    // Format: { src, dst, distKm, stops, mins, routeNo }
    // ────────────────────────────────────────────────────────────────────────
    const routesData = [
      // ── Corridor 1: Route 11 — Udhna Darwaja ↔ Sachin GIDC ──────────────
      { src: "UDW", dst: "UDS", distKm: 2,  stops: 2, mins: 6,  routeNo: "11" },
      { src: "UDW", dst: "AMB", distKm: 5,  stops: 4, mins: 14, routeNo: "11" },
      { src: "UDW", dst: "KTL", distKm: 10, stops: 7, mins: 25, routeNo: "11" },
      { src: "UDW", dst: "SAC", distKm: 14, stops: 10, mins: 35, routeNo: "11" },
      { src: "UDS", dst: "SAC", distKm: 12, stops: 8, mins: 30, routeNo: "11" },

      // ── Corridor 2: Route 12 — Sarthana ↔ ONGC Colony ───────────────────
      { src: "SNP", dst: "SJN", distKm: 2,  stops: 2, mins: 6,  routeNo: "12" },
      { src: "SNP", dst: "VAR", distKm: 5,  stops: 4, mins: 13, routeNo: "12" },
      { src: "SNP", dst: "KTW", distKm: 9,  stops: 6, mins: 22, routeNo: "12" },
      { src: "SNP", dst: "RLY", distKm: 13, stops: 9, mins: 32, routeNo: "12" },
      { src: "SNP", dst: "ONG", distKm: 20, stops: 13, mins: 50, routeNo: "12" },
      { src: "RLY", dst: "ONG", distKm: 7,  stops: 5, mins: 18, routeNo: "12" },
      { src: "VAR", dst: "RLY", distKm: 8,  stops: 5, mins: 20, routeNo: "12" },

      // ── Corridor 3: Route 17A — Kamrej ↔ Pal RTO ────────────────────────
      { src: "KMS", dst: "BHT", distKm: 6,  stops: 4, mins: 15, routeNo: "17A" },
      { src: "KMS", dst: "RLY", distKm: 12, stops: 8, mins: 30, routeNo: "17A" },
      { src: "KMS", dst: "ADJ", distKm: 18, stops: 12, mins: 45, routeNo: "17A" },
      { src: "KMS", dst: "PAL", distKm: 22, stops: 15, mins: 55, routeNo: "17A" },
      { src: "RLY", dst: "ADJ", distKm: 6,  stops: 4, mins: 16, routeNo: "17A" },
      { src: "ADJ", dst: "PAL", distKm: 4,  stops: 3, mins: 10, routeNo: "17A" },

      // ── City Centre Connections ───────────────────────────────────────────
      { src: "RLY", dst: "ATW", distKm: 3,  stops: 3, mins: 9,  routeNo: "C1" },
      { src: "RLY", dst: "NAN", distKm: 2,  stops: 2, mins: 6,  routeNo: "C1" },
      { src: "ATW", dst: "PST", distKm: 3,  stops: 3, mins: 9,  routeNo: "C1" },
      { src: "ATW", dst: "CRL", distKm: 2,  stops: 2, mins: 7,  routeNo: "C2" },
      { src: "CRL", dst: "VAR", distKm: 7,  stops: 5, mins: 18, routeNo: "C2" },

      // ── South-West Corridor — VED / Vesu / Althan / SDB ─────────────────
      { src: "VED", dst: "VES", distKm: 5,  stops: 4, mins: 13, routeNo: "S1" },
      { src: "VED", dst: "ALT", distKm: 8,  stops: 6, mins: 20, routeNo: "S1" },
      { src: "VED", dst: "SDB", distKm: 11, stops: 8, mins: 27, routeNo: "S1" },
      { src: "VES", dst: "SDB", distKm: 6,  stops: 4, mins: 15, routeNo: "S1" },
      { src: "ALT", dst: "SDB", distKm: 4,  stops: 3, mins: 10, routeNo: "S1" },
      { src: "PST", dst: "VES", distKm: 7,  stops: 5, mins: 18, routeNo: "S2" },
      { src: "PST", dst: "ONG", distKm: 5,  stops: 4, mins: 13, routeNo: "S2" },

      // ── North Corridor ────────────────────────────────────────────────────
      { src: "JPR", dst: "KTW", distKm: 6,  stops: 4, mins: 15, routeNo: "N1" },
      { src: "JPR", dst: "RLY", distKm: 10, stops: 7, mins: 25, routeNo: "N1" },
      { src: "JPR", dst: "VAR", distKm: 8,  stops: 5, mins: 20, routeNo: "N1" },
    ];

    const routes = [];
    for (const r of routesData) {
      const route = await Route.create({
        sourceStation: stations[r.src]._id,
        destinationStation: stations[r.dst]._id,
        distanceKm: r.distKm,
        stops: r.stops,
        estimatedTimeMinutes: r.mins,
        routeNumber: r.routeNo,
      });
      routes.push({ route, ...r });
    }
    console.log(`🛣️   ${routesData.length} routes created.`);

    // ── FARES — Slab-based (same as real Sitilink) ──────────────────────────
    for (const r of routes) {
      await Fare.create({
        route: r.route._id,
        baseFare: slabFare(r.distKm),
        taxRate: 0, // Sitilink has no GST on local bus fares
      });
    }
    console.log("💰  Fares set using Sitilink slab structure (₹5/₹10/₹15/₹20/₹25).");

    // ── SCHEDULES — Realistic Sitilink operating hours (06:00 – 22:00) ──────
    // Generate schedules every 15 min for peak (06:00–10:00, 17:00–21:00)
    // and every 25 min for off-peak
    const buildSchedules = (routeId, firstDep, lastDep, intervalMins, travelMins) => {
      const schedules = [];
      let [h, m] = firstDep.split(":").map(Number);
      const [lh, lm] = lastDep.split(":").map(Number);
      while (h * 60 + m <= lh * 60 + lm) {
        const dep = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const arrTotal = h * 60 + m + travelMins;
        const arr = `${String(Math.floor(arrTotal / 60)).padStart(2, "0")}:${String(arrTotal % 60).padStart(2, "0")}`;
        schedules.push({ route: routeId, departureTime: dep, arrivalTime: arr, daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] });
        m += intervalMins;
        h += Math.floor(m / 60);
        m = m % 60;
      }
      return schedules;
    };

    let totalSchedules = 0;
    for (const r of routes) {
      // Peak: every 15 min | Off-peak: every 25 min
      const peak1 = buildSchedules(r.route._id, "06:00", "10:00", 15, r.mins);
      const offPeak = buildSchedules(r.route._id, "10:15", "16:45", 25, r.mins);
      const peak2 = buildSchedules(r.route._id, "17:00", "21:00", 15, r.mins);
      const evening = buildSchedules(r.route._id, "21:15", "22:00", 30, r.mins);

      const all = [...peak1, ...offPeak, ...peak2, ...evening];
      await Schedule.insertMany(all);
      totalSchedules += all.length;
    }
    console.log(`🕐  ${totalSchedules} schedules created (peak 15-min, off-peak 25-min intervals).`);

    console.log("\n🎉  Seeding completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("   Admin login  : admin@metro.com / password");
    console.log("   Manager login: manager@metro.com / password");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    process.exit(0);
  } catch (error) {
    console.error("❌  Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
