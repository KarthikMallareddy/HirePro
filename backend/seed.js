// seed.js — Run with: node seed.js
// Seeds all campus placement drive data into HirePro via the REST API

const data = [
  {
    company: "HCLTech",
    role: "BTech CSE, IT, ECE, EEE 2027 POB",
    jobLink: "",
    salaryExpectation: "4.5L | Full Time",
    applicationDate: "2026-10-15",
    status: "Applied",
    interviewDates: [],
    notes: "Apply Before: 16 Oct 2026 | Type: Full Time | Drive Status: Open For Applications"
  },
  {
    company: "Boeing India",
    role: "6-Month Internship | MTech, BTech 2027 POB",
    jobLink: "",
    salaryExpectation: "40K/month | Intern Leads to Full Time",
    applicationDate: "2026-10-14",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 15 Oct 2026 | Stipend: 40K/month | Drive Status: Closed For Applications"
  },
  {
    company: "SaasAnt Infotech",
    role: "Software Engineer Trainee 2027 POB",
    jobLink: "",
    salaryExpectation: "6L | Stipend: 20K/month",
    applicationDate: "2026-10-13",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 15 Oct 2026 | Type: Intern Leads to Full Time | Drive Status: Closed For Applications"
  },
  {
    company: "Insight Global",
    role: "AI/ML Engineer Trainee & Full Stack Engineer Trainee 2027 POB",
    jobLink: "",
    salaryExpectation: "6L | Stipend: 30K/month",
    applicationDate: "2026-10-06",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 7 Oct 2026 | Type: Intern Leads to Full Time | Drive Status: Closed For Applications"
  },
  {
    company: "APTIV",
    role: "Associate Embedded Software Engineer 2027 POB (B.Tech & M.Tech)",
    jobLink: "",
    salaryExpectation: "0-9.5L | Stipend: 35K/month",
    applicationDate: "2026-06-08",
    status: "Interview",
    interviewDates: [],
    notes: "Apply Before: 6 Oct 2026 | Type: Intern Leads to Full Time | Drive Status: In Progress"
  },
  {
    company: "Pie Infotech",
    role: "Opportunity for B.Tech, M.Tech & MCA 2027 POB",
    jobLink: "",
    salaryExpectation: "7.5L-10L | Stipend: 28K-30K/month",
    applicationDate: "2026-10-03",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 5 Oct 2026 | Type: Intern + Full Time | Drive Status: Cancelled"
  },
  {
    company: "Havells",
    role: "B.Tech & M.Tech CSE, Electrical & Electronics 2027 POB",
    jobLink: "",
    salaryExpectation: "7L-8L | Stipend: 25K/month",
    applicationDate: "2026-10-01",
    status: "Interview",
    interviewDates: [],
    notes: "Apply Before: 3 Oct 2026 | Type: Intern Leads to Full Time | Drive Status: In Progress"
  },
  {
    company: "Microchip Technology",
    role: "PolarFire FPGA Design Contest 2026-27",
    jobLink: "",
    salaryExpectation: "Prize Money | Hackathon",
    applicationDate: "2026-09-03",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 3 Oct 2026 | Type: Hackathon | Drive Status: Closed For Applications"
  },
  {
    company: "Aditya Birla (ABMCPL)",
    role: "BTech / MTech 2027 batch",
    jobLink: "",
    salaryExpectation: "10L | Stipend: 25K/month",
    applicationDate: "2026-09-30",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 1 Oct 2026 | Type: Intern Leads to Full Time | Drive Status: Closed For Applications"
  },
  {
    company: "NxtWave",
    role: "B.Tech CSE and allied branches 2027 POB",
    jobLink: "",
    salaryExpectation: "0-7L | Stipend: 25K/month",
    applicationDate: "2026-09-28",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 30 Sept 2026 | Type: Intern Leads to Full Time | Drive Status: Closed For Applications"
  },
  {
    company: "Target in India",
    role: "Apprenticeship Program | MTech, BTech, MCA, MSc 2027 POB",
    jobLink: "",
    salaryExpectation: "15K-30K/month | Apprenticeship",
    applicationDate: "2026-09-17",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 30 Sept 2026 | Type: Apprenticeship | Drive Status: Closed For Applications"
  },
  {
    company: "Myntra",
    role: "B.Tech (CSE, AI/ML, IT only) 2027 POB",
    jobLink: "",
    salaryExpectation: "Stipend: 70K/month | Intern Leads to Full Time",
    applicationDate: "2026-09-25",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 28 Sept 2026 | Type: Intern Leads to Full Time | Drive Status: Closed For Applications"
  },
  {
    company: "Daimler India (DICV)",
    role: "BTech 2027 batch",
    jobLink: "",
    salaryExpectation: "7.5L | Full Time",
    applicationDate: "2026-09-23",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 25 Sept 2026 | Type: Full Time | Drive Status: Closed For Applications"
  },
  {
    company: "IBM (CIC)",
    role: "B.Tech & M.Tech CSE related and MCA 2027 POB",
    jobLink: "",
    salaryExpectation: "4.5L | Full Time",
    applicationDate: "2026-09-24",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 25 Sept 2026 | Type: Full Time | Drive Status: Closed For Applications"
  },
  {
    company: "Larsen & Toubro",
    role: "B.Tech/M.Tech 2027 POB",
    jobLink: "",
    salaryExpectation: "6L-8.6L | Full Time",
    applicationDate: "2026-09-22",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 25 Sept 2026 | Type: Full Time | Drive Status: Closed For Applications"
  },
  {
    company: "LTIMindTree (LTM)",
    role: "T-School Early Career Hiring 2027 Batch",
    jobLink: "",
    salaryExpectation: "4.0L | Full Time",
    applicationDate: "2026-09-23",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 25 Sept 2026 | Type: Full Time | Drive Status: Closed For Applications"
  },
  {
    company: "Infosys",
    role: "Systems Engineer (Trainee) | B.Tech, M.Tech, MCA & M.Sc 2027 POB",
    jobLink: "",
    salaryExpectation: "3.6L | Full Time",
    applicationDate: "2026-09-22",
    status: "Interview",
    interviewDates: [],
    notes: "Apply Before: 25 Sept 2026 | Type: Full Time | Drive Status: In Progress"
  },
  {
    company: "RGBSI",
    role: "Mechanical Engineer",
    jobLink: "",
    salaryExpectation: "4.5L-5L | Full Time",
    applicationDate: "2026-09-21",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 25 Sept 2026 | Type: Full Time | Drive Status: Closed For Applications"
  },
  {
    company: "IDFC First Bank",
    role: "Application Engineer | B.Tech CSE, CSE-AIE & CSE-CYS | 2026 POB",
    jobLink: "",
    salaryExpectation: "16L | Stipend: 40K/month",
    applicationDate: "2025-08-14",
    status: "Offer",
    interviewDates: [],
    notes: "Apply Before: 23 Sept 2026 | Type: Intern Leads to Full Time | Drive Status: Completed With Hiring"
  },
  {
    company: "Safran Engineering Services India",
    role: "Recruitment for 2027 POB",
    jobLink: "",
    salaryExpectation: "6L | Full Time",
    applicationDate: "2026-09-19",
    status: "Rejected",
    interviewDates: [],
    notes: "Apply Before: 21 Sept 2026 | Type: Full Time | Drive Status: Closed For Applications"
  }
];

// ── Insert all records via the REST API ────────────
const BASE = "http://localhost:5000/api/applications";

async function seed() {
  console.log(`Seeding ${data.length} placement drive records...\n`);
  let ok = 0, fail = 0;

  for (const entry of data) {
    try {
      const res = await fetch(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      });
      const json = await res.json();
      if (res.ok) {
        console.log(`✅ ${entry.company}`);
        ok++;
      } else {
        console.log(`❌ ${entry.company} — ${json.message}`);
        fail++;
      }
    } catch (err) {
      console.log(`❌ ${entry.company} — ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone! ${ok} inserted, ${fail} failed.`);
}

seed();
