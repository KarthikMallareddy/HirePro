// ─────────────────────────────────────────────
//  HirePro Backend — Job Application Tracker
//  server.js (with JWT & bcrypt Authentication)
// ─────────────────────────────────────────────

require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");

const app  = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL  = process.env.MONGO_URL || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DB_NAME    = process.env.DB_NAME || "hirepro_db";
const JWT_SECRET = process.env.JWT_SECRET || "hirepro_jwt_secret_key_2026";

// ── Middleware ──────────────────────────────────
app.use(express.json());   // parse incoming JSON bodies
app.use(cors());           // allow requests from React frontend

// ── Authentication Middleware ───────────────────
// Verifies Bearer token sent in Authorization header
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user   = decoded;      // { id, email, name }
    req.userId = decoded.id;   // string representation of user's MongoDB _id
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

// ── MongoDB Connection & Server Bootstrap ────────
async function startServer() {
  try {
    // 1. Connect to MongoDB
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    // 2. Collections
    const db           = client.db(DB_NAME);
    const users        = db.collection("users");
    const applications = db.collection("applications");

    // Helper: list of permitted stages
    const VALID_STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

    // ── Pre-seed Demo User for quick login ──────
    const demoEmail = "demo@hirepro.com";
    let demoUser = await users.findOne({ email: demoEmail });
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const res = await users.insertOne({
        name: "Demo Candidate",
        email: demoEmail,
        password: hashedPassword,
        createdAt: new Date()
      });
      demoUser = { _id: res.insertedId, email: demoEmail, name: "Demo Candidate" };
      console.log("👤 Created default demo user (demo@hirepro.com / password123)");
    }

    // Attach any existing records (e.g. seeded placement drives) to demo user
    await applications.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: demoUser._id.toString() } }
    );

    // ════════════════════════════════════════════════
    //  ROOT ROUTE — GET /
    //  Health check & API documentation endpoint
    // ════════════════════════════════════════════════
    app.get("/", (req, res) => {
      res.status(200).json({
        status: "online",
        message: "HirePro REST API Server is running! 🚀",
        frontendUrl: "http://localhost:5173",
        note: "To view the user interface dashboard, open http://localhost:5173 in your browser.",
        endpoints: {
          auth: [
            "POST /api/auth/register",
            "POST /api/auth/login",
            "GET  /api/auth/me"
          ],
          applications: [
            "GET    /api/applications",
            "GET    /api/applications/stats",
            "POST   /api/applications",
            "PATCH  /api/applications/:id/status",
            "PATCH  /api/applications/:id",
            "DELETE /api/applications/:id"
          ]
        }
      });
    });

    // ════════════════════════════════════════════════
    //  AUTH ROUTE 1 — POST /api/auth/register
    //  Registers a new user and returns JWT token
    // ════════════════════════════════════════════════
    app.post("/api/auth/register", async (req, res) => {
      try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
          return res.status(400).json({ message: "Name, email, and password are required." });
        }
        if (password.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const existing = await users.findOne({ email: normalizedEmail });
        if (existing) {
          return res.status(400).json({ message: "An account with this email already exists." });
        }

        // Hash password with salt rounds = 10
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          createdAt: new Date()
        };

        const result = await users.insertOne(newUser);
        const userId = result.insertedId.toString();

        // Sign JWT token valid for 7 days
        const token = jwt.sign(
          { id: userId, email: normalizedEmail, name: newUser.name },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.status(201).json({
          message: "Account created successfully",
          token,
          user: { id: userId, name: newUser.name, email: normalizedEmail }
        });
      } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Server error during registration." });
      }
    });

    // ════════════════════════════════════════════════
    //  AUTH ROUTE 2 — POST /api/auth/login
    //  Validates credentials and returns JWT token
    // ════════════════════════════════════════════════
    app.post("/api/auth/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required." });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find user by email
        const user = await users.findOne({ email: normalizedEmail });
        if (!user) {
          return res.status(401).json({ message: "Invalid email or password." });
        }

        // Compare bcrypt password hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid email or password." });
        }

        const userId = user._id.toString();

        // Generate token
        const token = jwt.sign(
          { id: userId, email: user.email, name: user.name },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.status(200).json({
          message: "Login successful",
          token,
          user: { id: userId, name: user.name, email: user.email }
        });
      } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login." });
      }
    });

    // ════════════════════════════════════════════════
    //  AUTH ROUTE 3 — GET /api/auth/me
    //  Returns currently authenticated user profile
    // ════════════════════════════════════════════════
    app.get("/api/auth/me", authenticate, async (req, res) => {
      try {
        const user = await users.findOne(
          { _id: new ObjectId(req.userId) },
          { projection: { password: 0 } } // Exclude password hash
        );
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({
          id: user._id.toString(),
          name: user.name,
          email: user.email
        });
      } catch (err) {
        console.error("Auth me error:", err);
        res.status(500).json({ message: "Server error." });
      }
    });

    // ════════════════════════════════════════════════
    //  PROTECTED ROUTE 1 — GET /api/applications
    //  Returns applications belonging to logged-in user
    // ════════════════════════════════════════════════
    app.get("/api/applications", authenticate, async (req, res) => {
      try {
        const { status, sort } = req.query;

        // Scope queries to only the current authenticated user's records
        const filter = { userId: req.userId };
        if (status) filter.status = status;

        const sortOption = sort === "company"
          ? { company: 1 }          // alphabetical
          : { applicationDate: -1 }; // newest first

        const list = await applications.find(filter).sort(sortOption).toArray();
        res.status(200).json(list);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching applications." });
      }
    });

    // ════════════════════════════════════════════════
    //  PROTECTED ROUTE 2 — GET /api/applications/stats
    //  Aggregates counts by stage for the logged-in user
    // ════════════════════════════════════════════════
    app.get("/api/applications/stats", authenticate, async (req, res) => {
      try {
        const pipeline = [
          { $match: { userId: req.userId } }, // only user's documents
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          }
        ];

        const grouped = await applications.aggregate(pipeline).toArray();

        const stats = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0, total: 0 };
        grouped.forEach(({ _id, count }) => {
          if (_id in stats) stats[_id] = count;
          stats.total += count;
        });

        res.status(200).json(stats);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching stats." });
      }
    });

    // ════════════════════════════════════════════════
    //  PROTECTED ROUTE 3 — POST /api/applications
    //  Creates new application associated with user
    // ════════════════════════════════════════════════
    app.post("/api/applications", authenticate, async (req, res) => {
      try {
        const {
          company,
          role,
          jobLink,
          salaryExpectation,
          applicationDate,
          status,
          interviewDates,
          notes
        } = req.body;

        if (!company || !role || !status) {
          return res.status(400).json({
            message: "Company, role, and status are required."
          });
        }
        if (!VALID_STATUSES.includes(status)) {
          return res.status(400).json({
            message: `Status must be one of: ${VALID_STATUSES.join(", ")}`
          });
        }

        const newApplication = {
          userId:            req.userId, // binds record to user
          company:           company.trim(),
          role:              role.trim(),
          jobLink:           jobLink || "",
          salaryExpectation: salaryExpectation || "",
          applicationDate:   applicationDate || new Date().toISOString(),
          status,
          interviewDates:    interviewDates || [],
          notes:             notes || "",
          createdAt:         new Date()
        };

        const result = await applications.insertOne(newApplication);

        res.status(201).json({
          message: "Application added successfully",
          id: result.insertedId
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error creating application." });
      }
    });

    // ════════════════════════════════════════════════
    //  PROTECTED ROUTE 4 — PATCH /api/applications/:id/status
    //  Updates only status field of user's application
    // ════════════════════════════════════════════════
    app.patch("/api/applications/:id/status", authenticate, async (req, res) => {
      try {
        const { id }     = req.params;
        const { status } = req.body;

        if (!VALID_STATUSES.includes(status)) {
          return res.status(400).json({
            message: `Status must be one of: ${VALID_STATUSES.join(", ")}`
          });
        }

        const result = await applications.updateOne(
          { _id: new ObjectId(id), userId: req.userId }, // ownership check
          { $set: { status } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Application not found or unauthorized." });
        }

        res.status(200).json({ message: "Status updated successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating status." });
      }
    });

    // ════════════════════════════════════════════════
    //  PROTECTED ROUTE 5 — PATCH /api/applications/:id
    //  Updates full details of user's application
    // ════════════════════════════════════════════════
    app.patch("/api/applications/:id", authenticate, async (req, res) => {
      try {
        const { id } = req.params;
        const updates = req.body;

        delete updates._id;
        delete updates.userId; // user cannot reassign ownership

        if (updates.status && !VALID_STATUSES.includes(updates.status)) {
          return res.status(400).json({
            message: `Status must be one of: ${VALID_STATUSES.join(", ")}`
          });
        }

        const result = await applications.updateOne(
          { _id: new ObjectId(id), userId: req.userId },
          { $set: updates }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Application not found or unauthorized." });
        }

        res.status(200).json({ message: "Application updated successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating application." });
      }
    });

    // ════════════════════════════════════════════════
    //  PROTECTED ROUTE 6 — DELETE /api/applications/:id
    //  Deletes application owned by the user
    // ════════════════════════════════════════════════
    app.delete("/api/applications/:id", authenticate, async (req, res) => {
      try {
        const { id } = req.params;

        const result = await applications.deleteOne({
          _id: new ObjectId(id),
          userId: req.userId
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Application not found or unauthorized." });
        }

        res.status(200).json({ message: "Application deleted successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting application." });
      }
    });

    // ── Start listening ─────────────────────────────
    app.listen(PORT, () => {
      console.log(`🚀 Server running with Auth at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
