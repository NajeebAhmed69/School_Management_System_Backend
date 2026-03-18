require("dotenv").config();
const mongoose = require("mongoose");
const Role = require("../models/Role");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

const roles = [
  { name: "superadmin", permissions: [] },
  { name: "admin", permissions: [] },
  { name: "teacher", permissions: [] },
  { name: "student", permissions: [] },
  { name: "parent", permissions: [] },
];

async function run() {
  try {
    await connectDB(process.env.MONGO_URI);

    // create/update roles
    for (const r of roles) {
      await Role.updateOne({ name: r.name }, { $set: r }, { upsert: true });
    }
    console.log("Roles seeded");

    // create superadmin
    const superRole = await Role.findOne({ name: "superadmin" });
    const hashed = await bcrypt.hash("supersecret", 10);
    await User.updateOne(
      { email: "super@school.com" },
      { $set: { name: "Super Admin", email: "super@school.com", password: hashed, role: superRole._id } },
      { upsert: true }
    );
    console.log("Super admin seeded (email: super@school.com, password: supersecret)");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();