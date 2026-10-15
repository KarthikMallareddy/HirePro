// ─────────────────────────────────────────────────
//  seed_accounts.js — Creates Karthik & Navadeep accounts
//  and populates each with their custom placement records.
// ─────────────────────────────────────────────────

const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
const DB_NAME   = process.env.DB_NAME   || "hirepro_db";

// ── 1. Karthik's Application Records ──────────────
const karthikApplications = [
  {
    company: "HyperVerge",
    role: "B.Tech 2027 POB",
    salaryExpectation: "10L-16L | Stipend: 35K-45K/month",
    applicationDate: "2026-09-10",
    status: "Interview",
    notes: "Apply Before: 14 Sept 2026 | Type: Intern Leads to Full Time | Drive: In Progress"
  },
  {
    company: "MAKO IT LAB",
    role: "B.Tech 2027 - Intern leads to FTE",
    salaryExpectation: "6L | Stipend: 15K/month",
    applicationDate: "2026-09-11",
    status: "Interview",
    interviewDates: ["2026-09-16"],
    notes: "Apply Before: 12 Sept 2026 | Visit: 16 Sept 2026 Tentative | Drive: In Progress"
  },
  {
    company: "Autodesk",
    role: "Intern SDE & Intern Software QA Engineer | B.Tech 2027",
    salaryExpectation: "Stipend: 45K-65K/month | Intern Leads to FTE",
    applicationDate: "2026-09-09",
    status: "Rejected",
    notes: "Apply Before: 11 Sept 2026 | Drive Status: Closed For Applications"
  },
  {
    company: "GEP",
    role: "B.Tech, MCA & M.Sc 2027 POB",
    salaryExpectation: "4L | Full Time",
    applicationDate: "2026-09-07",
    status: "Offer",
    notes: "Apply Before: 8 Sept 2026 | Drive Status: Completed With Hiring"
  },
  {
    company: "SAP Labs",
    role: "SAP Hackfest Hackathon South & East Region 2026",
    salaryExpectation: "Prize Money | Hackathon",
    applicationDate: "2026-08-30",
    status: "Rejected",
    notes: "Apply Before: 6 Sept 2026 | Drive Status: Closed For Applications"
  },
  {
    company: "Payatu",
    role: "Security Consulting for BTech 2027 batch",
    salaryExpectation: "6L-9L | Stipend: 25K-30K/month",
    applicationDate: "2026-09-03",
    status: "Offer",
    notes: "Apply Before: 4 Sept 2026 | Drive Status: Completed With Hiring"
  },
  {
    company: "Eurofins IT Solutions",
    role: "Eurofins IT Solutions for BTech 2027 batch",
    salaryExpectation: "6L | Stipend: 15K/month",
    applicationDate: "2026-09-03",
    status: "Offer",
    notes: "Apply Before: 4 Sept 2026 | Drive Status: Completed With Hiring"
  },
  {
    company: "GE Aerospace",
    role: "MTech / B.Tech - DS Interns 2027 POB",
    salaryExpectation: "Stipend: 40K-100K/month | Regular Intern",
    applicationDate: "2026-09-02",
    status: "Rejected",
    notes: "Apply Before: 3 Sept 2026 | Drive Status: Closed For Applications"
  },
  {
    company: "Tiger Analytics",
    role: "Trainee Software Engineer | B.Tech & M.Tech 2027 POB",
    salaryExpectation: "7.5L | Full Time",
    applicationDate: "2026-09-02",
    status: "Rejected",
    notes: "Apply Before: 3 Sept 2026 | Drive Status: Closed For Applications"
  },
  {
    company: "Constelli Signals",
    role: "B.Tech 2027 POB",
    salaryExpectation: "5.5L-8L | Stipend: 18K/month",
    applicationDate: "2026-08-31",
    status: "Interview",
    notes: "Apply Before: 2 Sept 2026 | Drive Status: In Progress"
  },
  {
    company: "Goldman Sachs",
    role: "Internship role for B.Tech 2027 POB",
    salaryExpectation: "Stipend: 95.8K/month | Regular Intern",
    applicationDate: "2026-08-27",
    status: "Offer",
    notes: "Apply Before: 28 Aug 2026 | Drive Status: Completed With Hiring"
  },
  {
    company: "IBM",
    role: "IBM CIO : B.Tech, M.Tech, MCA & M.Sc 2027 POB",
    salaryExpectation: "10.8L | Stipend: 30K-40K/month",
    applicationDate: "2026-08-18",
    status: "Offer",
    notes: "Apply Before: 28 Aug 2026 | Drive Status: Completed With Hiring"
  },
  {
    company: "Amazon",
    role: "Engineering students with disabilities 2027 POB",
    salaryExpectation: "Intern Leads to Full Time",
    applicationDate: "2026-08-27",
    status: "Rejected",
    notes: "Apply Before: 28 Aug 2026 | Drive Status: Closed For Applications"
  },
  {
    company: "Evobi Automations",
    role: "B.Tech 2027 POB",
    salaryExpectation: "6L | Stipend: 25K/month",
    applicationDate: "2026-08-25",
    status: "Offer",
    notes: "Apply Before: 26 Aug 2026 | Drive Status: Completed With Hiring"
  },
  {
    company: "NxtWave",
    role: "B.Tech CSE & related branches 2027 POB",
    salaryExpectation: "7L-20L | Stipend: 30K-40K/month",
    applicationDate: "2026-08-22",
    status: "Rejected",
    notes: "Apply Before: 25 Aug 2026 | Drive Status: Closed For Applications"
  }
];

// ── 2. Navadeep's Application Records ─────────────
const navadeepApplications = [
  {
    company: "Caterpillar",
    role: "Internship plus Full Time - Software & Robotics 2027 batch",
    salaryExpectation: "15.8L-17.7L | Stipend: 30K-40K/month",
    applicationDate: "2026-08-22",
    status: "Interview",
    interviewDates: ["2026-08-29"],
    notes: "Apply Before: 24 Aug 2026 | Visit: 29 Aug 2026 Tentative | Drive: In Progress"
  },
  {
    company: "Novo Nordisk",
    role: "B.Tech CSE & AIE Related 2027 POB",
    salaryExpectation: "Stipend: 40K/month | Regular Intern",
    applicationDate: "2026-08-22",
    status: "Rejected",
    notes: "Apply Before: 24 Aug 2026 | Drive Status: Closed For Applications"
  },
  {
    company: "Skylark Drones",
    role: "B.Tech & M.Tech 2027 POB",
    salaryExpectation: "5L-12L | Stipend: 25K-35K/month",
    applicationDate: "2026-07-17",
    status: "Rejected",
    notes: "Apply Before: 22 Aug 2026 | Drive Status: Closed For Applications"
  },
  {
    company: "NCompass",
    role: "B.Tech & MCA 2027 POB",
    salaryExpectation: "6.5L | Stipend: 15K/month",
    applicationDate: "2026-08-20",
    status: "Rejected",
    notes: "Apply Before: 21 Aug 2026 | Drive Status: Closed For Applications"
  },
  {
    company: "Accenture",
    role: "B.Tech / M.Tech / M.Sc / MCA 2027 POB",
    salaryExpectation: "4L-11L | Full Time",
    applicationDate: "2026-08-18",
    status: "Interview",
    notes: "Apply Before: 20 Aug 2026 | Drive Status: In Progress"
  },
  {
    company: "Honeywell",
    role: "Software Engineering Intern | B.Tech CSE 2027 POB",
    salaryExpectation: "10.2L | Stipend: 36K/month",
    applicationDate: "2026-08-19",
    status: "Offer",
    notes: "Apply Before: 20 Aug 2026 | Drive Status: Completed With Hiring"
  },
  {
    company: "Michelin India",
    role: "Industrial Engineering / Factory HR / Purchase Intern",
    salaryExpectation: "Stipend: 25K/month | Regular Intern",
    applicationDate: "2026-08-14",
    status: "Offer",
    notes: "Apply Before: 17 Aug 2026 | Drive Status: Completed With Hiring"
  },
  {
    company: "Amazon",
    role: "Non SDE roles 6-month Internship Jan-June 2027",
    salaryExpectation: "Stipend: 50K-70K/month | Intern Leads to FTE",
    applicationDate: "2026-08-11",
    status: "Rejected",
    notes: "Apply Before: 13 Aug 2026 | Drive Status: Closed For Applications"
  },
  {
    company: "Arista Networks",
    role: "TAC | B.Tech CS/IT/CIS/ECE 2027 POB",
    salaryExpectation: "10L-11L | Stipend: 65K/month",
    applicationDate: "2026-08-22",
    status: "Offer",
    notes: "Apply Before: 13 Aug 2026 | Drive Status: Completed With Hiring"
  },
  {
    company: "EY",
    role: "Intern+FTE Opportunity for B.Tech 2027 POB",
    salaryExpectation: "7.6L | Stipend: 23K/month",
    applicationDate: "2026-08-12",
    status: "Offer",
    notes: "Apply Before: 13 Aug 2026 | Drive Status: Completed With Hiring"
  },
  {
    company: "Cognizant",
    role: "Ace Team program 2027 - BTech/MTech 2027 batch",
    salaryExpectation: "12L-18L | Full Time",
    applicationDate: "2026-08-06",
    status: "Interview",
    notes: "Apply Before: 12 Aug 2026 | Drive Status: In Progress"
  },
  {
    company: "BNP Paribas",
    role: "B.Tech / MCA 2027 POB",
    salaryExpectation: "8.4L | Stipend: 50K/month",
    applicationDate: "2026-07-30",
    status: "Rejected",
    notes: "Apply Before: 8 Aug 2026 | Drive Status: Closed For Applications"
  },
  {
    company: "Caterpillar",
    role: "Internship plus Full Time - Mechanical, EEE, ECE 2027 batch",
    salaryExpectation: "15.8L-17.7L | Stipend: 30K-40K/month",
    applicationDate: "2026-08-07",
    status: "Offer",
    interviewDates: ["2026-08-14"],
    notes: "Apply Before: 8 Aug 2026 | Visit: 14 Aug 2026 Tentative | Drive: Completed With Hiring"
  },
  {
    company: "Amazon",
    role: "Software Engineering 2027 batch - B.Tech/M.Tech/M.Sc",
    salaryExpectation: "29.5L | Stipend: 130K/month",
    applicationDate: "2026-08-08",
    status: "Interview",
    notes: "Apply Before: 8 Aug 2026 | Type: Intern Leads to Full Time | Drive: In Progress"
  }
];

// ── Setup Function ────────────────────────────────
async function seedAccounts() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);
  const users = db.collection("users");
  const applications = db.collection("applications");

  console.log("Connected to MongoDB. Creating accounts...\n");

  // Helper to upsert a user and their applications
  async function setupUser(name, email, plainPassword, apps) {
    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Delete existing user if any to re-seed cleanly
    await users.deleteOne({ email: normalizedEmail });

    const userRes = await users.insertOne({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date()
    });

    const userId = userRes.insertedId.toString();

    // Remove any previous apps for this user
    await applications.deleteMany({ userId });

    // Insert user's apps with proper userId
    const appDocs = apps.map((app) => ({
      ...app,
      userId,
      jobLink: app.jobLink || "",
      interviewDates: app.interviewDates || [],
      createdAt: new Date()
    }));

    if (appDocs.length > 0) {
      await applications.insertMany(appDocs);
    }

    console.log(`✅ Created User: ${name}`);
    console.log(`   Email:    ${normalizedEmail}`);
    console.log(`   Password: ${plainPassword}`);
    console.log(`   Inserted: ${appDocs.length} applications\n`);
  }

  // 1. Setup Karthik
  await setupUser(
    "Karthik",
    "mrkarthik1811@gmail.com",
    "karthik123",
    karthikApplications
  );

  // 2. Setup Navadeep
  await setupUser(
    "Navadeep",
    "navadeep3108@gmail.com",
    "navadeep123",
    navadeepApplications
  );

  await client.close();
  console.log("All accounts and data populated successfully! 🎉");
}

seedAccounts().catch(console.error);
