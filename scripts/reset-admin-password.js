const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema (inline for the script)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  nic: String,
  mobile: String,
  address: String,
  password: String,
  role: String,
  profilePicture: String,
  isActive: Boolean,
  managingDepartments: [String],
  workshops: [mongoose.Schema.Types.ObjectId],
  employees: [mongoose.Schema.Types.ObjectId],
  permissions: [String]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function resetAdminPassword() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  try {
    colorLog('cyan', '🔑 Admin Password Reset Tool');
    colorLog('blue', '══════════════════════════════\n');

    // Connect to database
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    await mongoose.connect(MONGODB_URI);
    colorLog('green', '✅ Connected to MongoDB\n');

    // Find all admin users
    const admins = await User.find({ role: 'admin' }).select('name email nic');
    
    if (admins.length === 0) {
      colorLog('red', '❌ No admin users found in the database');
      process.exit(1);
    }

    colorLog('yellow', '📋 Available admin users:');
    admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.name} (${admin.email})`);
    });

    const selection = await question('\n🔍 Select admin number to reset password: ');
    const selectedIndex = parseInt(selection) - 1;

    if (selectedIndex < 0 || selectedIndex >= admins.length) {
      throw new Error('Invalid selection');
    }

    const selectedAdmin = admins[selectedIndex];
    const newPassword = await question('\n🔐 Enter new password: ');

    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    await User.findByIdAndUpdate(selectedAdmin._id, {
      password: hashedPassword
    });

    colorLog('green', '\n✅ Password reset successfully!');
    console.log(`\n📋 Updated Admin: ${selectedAdmin.name}`);
    console.log(`   Email: ${selectedAdmin.email}`);
    console.log(`   New Password: ${newPassword}`);

    rl.close();

  } catch (error) {
    colorLog('red', `\n❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    colorLog('blue', '\n🔌 Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  resetAdminPassword();
}