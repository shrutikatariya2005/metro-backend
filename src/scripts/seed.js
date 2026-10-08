// src/scripts/seed.js
// ══════════════════════════════════════════════════════════════════════════════
// Full-data seed: Stations · Routes · Fares · Schedules · Users · Bookings
//                 Tickets · Feedback · Payments (for admin reports)
// ══════════════════════════════════════════════════════════════════════════════
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import Station from "../models/Station.model.js";
import Route from "../models/Route.model.js";
import Fare from "../models/Fare.model.js";
import Schedule from "../models/Schedule.model.js";
import Booking from "../models/Booking.model.js";
import Ticket from "../models/Ticket.model.js";
import Feedback from "../models/Feedback.model.js";
import Payment from "../models/Payment.model.js";

dotenv.config();

// ── Fare slab (mirrors real Sitilink logic) ───────────────────────────────────
// ≤4km → ₹5 | ≤8km → ₹10 | ≤12km → ₹15 | ≤16km → ₹20 | >16km → ₹25
const slabFare = (km) => {
  if (km <= 4)  return 5;
  if (km <= 8)  return 10;
  if (km <= 12) return 15;
  if (km <= 16) return 20;
  return 25;
};

const pad = (n) => String(n).padStart(2, "0");

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate a reference code
let refCounter = 1;
const makeRef = (prefix) => `${prefix}-${Date.now()}-${String(refCounter++).padStart(4, "0")}`;

// ── Today's date string ───────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];

// ── Past date string (daysAgo days ago) ──────────────────────────────────────
const pastDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

// ── Build timestamp in the past ───────────────────────────────────────────────
const pastTimestamp = (daysAgo, hoursOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursOffset);
  return d;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  Connected to MongoDB Atlas...");

    // ── Wipe ALL collections ────────────────────────────────────────────────
    await Promise.all([
      User.deleteMany({}),
      Station.deleteMany({}),
      Route.deleteMany({}),
      Fare.deleteMany({}),
      Schedule.deleteMany({}),
      Booking.deleteMany({}),
      Ticket.deleteMany({}),
      Feedback.deleteMany({}),
      Payment.deleteMany({}),
    ]);
    console.log("🗑️   Cleared all existing data.");

    // ════════════════════════════════════════════════════════════════════════
    // STAFF ACCOUNTS
    // ════════════════════════════════════════════════════════════════════════
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@metro.com",
      passwordHash: "password",
      role: "admin",
      contact: "9876543210",
      isActive: true,
    });

    console.log("👤  Staff accounts created.");

    // ════════════════════════════════════════════════════════════════════════
    // PASSENGER USERS — realistic Surat names & documents
    // ════════════════════════════════════════════════════════════════════════
    const generatePAN = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const nums = "0123456789";
      let pan = "";
      for (let i = 0; i < 5; i++) pan += chars.charAt(Math.floor(Math.random() * chars.length));
      for (let i = 0; i < 4; i++) pan += nums.charAt(Math.floor(Math.random() * nums.length));
      pan += chars.charAt(Math.floor(Math.random() * chars.length));
      return pan;
    };

    const generateAadhar = () => {
      let aadhar = "";
      for (let i = 0; i < 12; i++) aadhar += Math.floor(Math.random() * 10);
      return aadhar;
    };

    const passengersData = [
      { name: "Priya Sharma",    email: "priya.sharma@gmail.com",    contact: "9998887771", dob: "1995-03-14", address: "Vesu, Surat", qualification: "B.Tech" },
      { name: "Rahul Patel",     email: "rahul.patel@gmail.com",     contact: "9998887772", dob: "1990-07-22", address: "Adajan, Surat", qualification: "MBA" },
      { name: "Anjali Mehta",    email: "anjali.mehta@gmail.com",    contact: "9998887773", dob: "1998-11-05", address: "Varachha, Surat", qualification: "B.Com" },
      { name: "Vikram Desai",    email: "vikram.desai@gmail.com",    contact: "9998887774", dob: "1985-01-30", address: "Piplod, Surat", qualification: "Ph.D" },
      { name: "Kavya Joshi",     email: "kavya.joshi@gmail.com",     contact: "9998887775", dob: "2000-06-18", address: "Katargam, Surat", qualification: "B.Sc" },
      { name: "Amit Shah",       email: "amit.shah@gmail.com",       contact: "9998887776", dob: "1992-09-25", address: "City Light, Surat", qualification: "M.Com" },
      { name: "Nisha Trivedi",   email: "nisha.trivedi@gmail.com",   contact: "9998887777", dob: "1997-04-12", address: "Udhna, Surat", qualification: "B.A" },
      { name: "Rohan Kapoor",    email: "rohan.kapoor@gmail.com",    contact: "9998887778", dob: "1988-12-08", address: "Althan, Surat", qualification: "B.E" },
      { name: "Sonal Rao",       email: "sonal.rao@gmail.com",       contact: "9998887779", dob: "2001-02-27", address: "Bhatar, Surat", qualification: "BBA" },
      { name: "Deepak Gupta",    email: "deepak.gupta@gmail.com",    contact: "9998887780", dob: "1993-08-15", address: "Pal, Surat", qualification: "MCA" },
      { name: "Meena Pillai",    email: "meena.pillai@gmail.com",    contact: "9998887781", dob: "1996-05-03", address: "Dumas Road, Surat", qualification: "B.Tech" },
      { name: "Arjun Nair",      email: "arjun.nair@gmail.com",      contact: "9998887782", dob: "1989-10-20", address: "Rander, Surat", qualification: "MBA" },
      { name: "Tanvi Singh",     email: "tanvi.singh@gmail.com",     contact: "9998887783", dob: "1999-07-09", address: "Amroli, Surat", qualification: "B.Com" },
      { name: "Karan Malhotra",  email: "karan.malhotra@gmail.com",  contact: "9998887784", dob: "1994-03-28", address: "Athwa Lines, Surat", qualification: "B.Arch" },
      { name: "Pooja Iyer",      email: "pooja.iyer@gmail.com",      contact: "9998887785", dob: "2002-01-14", address: "Majura Gate, Surat", qualification: "B.Sc" },
    ].map(p => ({ ...p, pan: generatePAN(), aadhar: generateAadhar() }));

    const passengers = [];
    for (const p of passengersData) {
      const user = await User.create({ ...p, passwordHash: "password", role: "passenger", isActive: true });
      passengers.push(user);
    }
    console.log(`👥  ${passengers.length} passenger accounts created.`);

    // ════════════════════════════════════════════════════════════════════════
    // STATIONS
    // ════════════════════════════════════════════════════════════════════════
    const stationsData = [
      { stationCode: "UDW", stationName: "Udhna Darwaja",        location: "Udhna, Surat",         zone: "South" },
      { stationCode: "UDS", stationName: "Udhna Station",        location: "Udhna, Surat",         zone: "South" },
      { stationCode: "AMB", stationName: "Amroli",               location: "Amroli, Surat",        zone: "South" },
      { stationCode: "KTL", stationName: "Kim Terminal",         location: "Kim, Surat",           zone: "South" },
      { stationCode: "SAC", stationName: "Sachin GIDC Naka",     location: "Sachin, Surat",        zone: "South" },
      { stationCode: "SNP", stationName: "Sarthana Nature Park", location: "Sarthana, Surat",      zone: "East" },
      { stationCode: "SJN", stationName: "Sarthana Jakat Naka",  location: "Sarthana, Surat",      zone: "East" },
      { stationCode: "VAR", stationName: "Varachha",             location: "Varachha, Surat",      zone: "East" },
      { stationCode: "KTW", stationName: "Katargam",             location: "Katargam, Surat",      zone: "Central" },
      { stationCode: "RLY", stationName: "Surat Railway Station",location: "City Centre, Surat",   zone: "Central" },
      { stationCode: "ONG", stationName: "ONGC Colony",          location: "Magdalla, Surat",      zone: "West" },
      { stationCode: "ADJ", stationName: "Adajan BRTS",          location: "Adajan, Surat",        zone: "West" },
      { stationCode: "PAL", stationName: "Pal RTO",              location: "Pal, Surat",           zone: "West" },
      { stationCode: "VES", stationName: "Vesu",                 location: "Vesu, Surat",          zone: "South-West" },
      { stationCode: "ALT", stationName: "Althan",               location: "Althan, Surat",        zone: "South-West" },
      { stationCode: "ATW", stationName: "Athwa Gate",           location: "Athwa, Surat",         zone: "Central" },
      { stationCode: "NAN", stationName: "Nanpura",              location: "Nanpura, Surat",       zone: "Central" },
      { stationCode: "CRL", stationName: "Canal Road",           location: "Canal Road, Surat",    zone: "Central" },
      { stationCode: "PST", stationName: "Parle Point",          location: "Athwa, Surat",         zone: "Central" },
      { stationCode: "BHT", stationName: "Bhatar",               location: "Bhatar, Surat",        zone: "East" },
      { stationCode: "KMS", stationName: "Kamrej Terminal",      location: "Kamrej, Surat",        zone: "East" },
      { stationCode: "JPR", stationName: "Jahangirpura",         location: "Jahangirpura, Surat",  zone: "North" },
      { stationCode: "SDB", stationName: "Surat Diamond Bourse", location: "Khajod, Surat",        zone: "South-West" },
      { stationCode: "VED", stationName: "Ved Road",             location: "Piplod, Surat",        zone: "South" },
    ];

    const stations = {};
    for (const s of stationsData) {
      stations[s.stationCode] = await Station.create(s);
    }
    console.log(`🚉  ${stationsData.length} stations created.`);

    // ════════════════════════════════════════════════════════════════════════
    // ROUTES
    // ════════════════════════════════════════════════════════════════════════
    const routesData = [
      { src: "UDW", dst: "UDS", distKm: 2,  stops: 2,  mins: 6,  routeNo: "11" },
      { src: "UDW", dst: "AMB", distKm: 5,  stops: 4,  mins: 14, routeNo: "11" },
      { src: "UDW", dst: "KTL", distKm: 10, stops: 7,  mins: 25, routeNo: "11" },
      { src: "UDW", dst: "SAC", distKm: 14, stops: 10, mins: 35, routeNo: "11" },
      { src: "UDS", dst: "SAC", distKm: 12, stops: 8,  mins: 30, routeNo: "11" },
      { src: "SNP", dst: "SJN", distKm: 2,  stops: 2,  mins: 6,  routeNo: "12" },
      { src: "SNP", dst: "VAR", distKm: 5,  stops: 4,  mins: 13, routeNo: "12" },
      { src: "SNP", dst: "KTW", distKm: 9,  stops: 6,  mins: 22, routeNo: "12" },
      { src: "SNP", dst: "RLY", distKm: 13, stops: 9,  mins: 32, routeNo: "12" },
      { src: "SNP", dst: "ONG", distKm: 20, stops: 13, mins: 50, routeNo: "12" },
      { src: "RLY", dst: "ONG", distKm: 7,  stops: 5,  mins: 18, routeNo: "12" },
      { src: "VAR", dst: "RLY", distKm: 8,  stops: 5,  mins: 20, routeNo: "12" },
      { src: "KMS", dst: "BHT", distKm: 6,  stops: 4,  mins: 15, routeNo: "17A" },
      { src: "KMS", dst: "RLY", distKm: 12, stops: 8,  mins: 30, routeNo: "17A" },
      { src: "KMS", dst: "ADJ", distKm: 18, stops: 12, mins: 45, routeNo: "17A" },
      { src: "KMS", dst: "PAL", distKm: 22, stops: 15, mins: 55, routeNo: "17A" },
      { src: "RLY", dst: "ADJ", distKm: 6,  stops: 4,  mins: 16, routeNo: "17A" },
      { src: "ADJ", dst: "PAL", distKm: 4,  stops: 3,  mins: 10, routeNo: "17A" },
      { src: "RLY", dst: "ATW", distKm: 3,  stops: 3,  mins: 9,  routeNo: "C1" },
      { src: "RLY", dst: "NAN", distKm: 2,  stops: 2,  mins: 6,  routeNo: "C1" },
      { src: "ATW", dst: "PST", distKm: 3,  stops: 3,  mins: 9,  routeNo: "C1" },
      { src: "ATW", dst: "CRL", distKm: 2,  stops: 2,  mins: 7,  routeNo: "C2" },
      { src: "CRL", dst: "VAR", distKm: 7,  stops: 5,  mins: 18, routeNo: "C2" },
      { src: "VED", dst: "VES", distKm: 5,  stops: 4,  mins: 13, routeNo: "S1" },
      { src: "VED", dst: "ALT", distKm: 8,  stops: 6,  mins: 20, routeNo: "S1" },
      { src: "VED", dst: "SDB", distKm: 11, stops: 8,  mins: 27, routeNo: "S1" },
      { src: "VES", dst: "SDB", distKm: 6,  stops: 4,  mins: 15, routeNo: "S1" },
      { src: "ALT", dst: "SDB", distKm: 4,  stops: 3,  mins: 10, routeNo: "S1" },
      { src: "PST", dst: "VES", distKm: 7,  stops: 5,  mins: 18, routeNo: "S2" },
      { src: "PST", dst: "ONG", distKm: 5,  stops: 4,  mins: 13, routeNo: "S2" },
      { src: "JPR", dst: "KTW", distKm: 6,  stops: 4,  mins: 15, routeNo: "N1" },
      { src: "JPR", dst: "RLY", distKm: 10, stops: 7,  mins: 25, routeNo: "N1" },
      { src: "JPR", dst: "VAR", distKm: 8,  stops: 5,  mins: 20, routeNo: "N1" },
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

    // ── FARES ────────────────────────────────────────────────────────────────
    for (const r of routes) {
      await Fare.create({ route: r.route._id, baseFare: slabFare(r.distKm), taxRate: 0 });
    }
    console.log("💰  Fares set (Sitilink slab: ₹5/₹10/₹15/₹20/₹25).");

    // ── SCHEDULES ────────────────────────────────────────────────────────────
    const buildSchedules = (routeId, firstDep, lastDep, intervalMins, travelMins) => {
      const schedules = [];
      let [h, m] = firstDep.split(":").map(Number);
      const [lh, lm] = lastDep.split(":").map(Number);
      while (h * 60 + m <= lh * 60 + lm) {
        const dep = `${pad(h)}:${pad(m)}`;
        const arrTotal = h * 60 + m + travelMins;
        const arr = `${pad(Math.floor(arrTotal / 60))}:${pad(arrTotal % 60)}`;
        schedules.push({ route: routeId, departureTime: dep, arrivalTime: arr, daysOfWeek: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] });
        m += intervalMins;
        h += Math.floor(m / 60);
        m = m % 60;
      }
      return schedules;
    };

    const schedulesByRoute = {};
    let totalSchedules = 0;
    for (const r of routes) {
      const peak1   = buildSchedules(r.route._id, "06:00", "10:00", 15, r.mins);
      const offPeak = buildSchedules(r.route._id, "10:15", "16:45", 25, r.mins);
      const peak2   = buildSchedules(r.route._id, "17:00", "21:00", 15, r.mins);
      const evening = buildSchedules(r.route._id, "21:15", "22:00", 30, r.mins);
      const all = [...peak1, ...offPeak, ...peak2, ...evening];
      const inserted = await Schedule.insertMany(all);
      schedulesByRoute[r.route._id.toString()] = inserted;
      totalSchedules += all.length;
    }
    console.log(`🕐  ${totalSchedules} schedules created.`);

    // ════════════════════════════════════════════════════════════════════════
    // BOOKINGS · TICKETS · PAYMENTS · FEEDBACK
    // ════════════════════════════════════════════════════════════════════════
    const paymentMethods = ["upi", "card", "upi", "wallet", "cash"];
    const feedbackComments = [
      "Very comfortable journey, clean bus!",
      "Punctual service, reached on time.",
      "AC was not working properly.",
      "Great service, easy to book online.",
      "Driver was very polite and helpful.",
      "Bus was a bit crowded during peak hours.",
      "Excellent cleanliness maintained.",
      "Smooth ride, no complaints.",
      "Seat was comfortable, good experience.",
      "App is easy to use, will book again.",
      "Good value for money.",
      "Bus was 5 minutes late but overall fine.",
    ];

    let totalBookings = 0;
    let totalTickets  = 0;
    let totalPayments = 0;
    let totalFeedback = 0;

    // Track which (user+route+date) combos we've used to avoid duplicate constraint
    const usedCombos = new Set();

    // Generate 500 confirmed bookings spread across 60 days
    const bookingTargets = 500;
    let attempts = 0;

    while (totalBookings < bookingTargets && attempts < 3000) {
      attempts++;
      const passenger = pick(passengers);
      const routeEntry = pick(routes);
      const daysAgo = randInt(0, 59);
      const tDate = pastDate(daysAgo);

      const comboKey = `${passenger._id}-${routeEntry.route._id}-${tDate}-${totalBookings}`;
      if (usedCombos.has(comboKey)) continue;
      usedCombos.add(comboKey);

      const passengerCount = randInt(1, 4);
      const fare = slabFare(routeEntry.distKm) * passengerCount;
      const bookingRef = makeRef("BKG");

      const createdAt = pastTimestamp(daysAgo, randInt(1, 14));
      const booking = await Booking.create({
        bookingRef,
        user: passenger._id,
        route: routeEntry.route._id,
        schedule: pick(schedulesByRoute[routeEntry.route._id.toString()] || [undefined])?._id || undefined,
        passengerCount,
        fareAmount: fare,
        travelDate: tDate,
        status: "confirmed",
        paymentId: `pay_seed_${totalBookings + 1}`,
        orderId: `order_seed_${totalBookings + 1}`,
        createdAt,
        updatedAt: createdAt,
      });

      const validUntil = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000);
      const ticket = await Ticket.create({
        ticketRef: makeRef("TKT"),
        booking: booking._id,
        issuedAt: createdAt,
        validUntil,
        status: daysAgo === 0 ? "active" : "expired",
        createdAt,
        updatedAt: createdAt,
      });
      totalTickets++;

      await Payment.create({
        booking: booking._id,
        amount: fare,
        method: pick(paymentMethods),
        status: "completed",
        transactionId: `txn_seed_${totalBookings + 1}`,
        createdAt,
        updatedAt: createdAt,
      });
      totalPayments++;

      if (Math.random() < 0.3) {
        const rating = pick([3, 4, 4, 4, 5, 5, 5]); 
        await Feedback.create({
          user: passenger._id,
          rating,
          comments: pick(feedbackComments),
          createdAt,
          updatedAt: createdAt,
        });
        totalFeedback++;
      }

      totalBookings++;
    }

    // Add 15 pending_payment bookings for today
    for (let i = 0; i < 15; i++) {
      const passenger = pick(passengers);
      const routeEntry = pick(routes);
      const passengerCount = randInt(1, 2);
      const fare = slabFare(routeEntry.distKm) * passengerCount;
      const bookingRef = makeRef("BKG");
      
      await Booking.create({
        bookingRef,
        user: passenger._id,
        route: routeEntry.route._id,
        passengerCount,
        fareAmount: fare,
        travelDate: todayStr(),
        status: "pending_payment",
      });
      totalBookings++;
    }

    console.log(`🎫  ${totalBookings} bookings created (${totalBookings - 10} confirmed + 10 pending).`);
    console.log(`🎟️   ${totalTickets} tickets issued.`);
    console.log(`💳  ${totalPayments} payment records created.`);
    console.log(`💬  ${totalFeedback} feedback entries created.`);

    console.log("\n🎉  Seeding completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("   Admin login       : admin@metro.com / password");
    console.log("   Passenger logins  : priya.sharma@gmail.com / password");
    console.log("                       rahul.patel@gmail.com / password");
    console.log("                       (all 15 passengers use: password)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    process.exit(0);
  } catch (error) {
    console.error("❌  Seeding failed:", error.message);
    console.error(error);
    process.exit(1);
  }
};

seedData();
