const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema (inline for the script)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  nic: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'director', 'internal_auditor'],
    required: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  managingDepartments: [{
    type: String,
    trim: true
  }],
  workshops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop'
  }],
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  permissions: [{
    type: String
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

// Default admin data
const defaultAdminData = {
  name: 'System Administrator',
  email: 'admin@silg.gov.lk',
  nic: '199012345678',
  mobile: '+94771234567',
  address: 'Ministry of Education, Isurupaya, Battaramulla, Sri Lanka',
  password: 'admin123455',
  role: 'admin',
  permissions: [
    'create_users',
    'delete_users',
    'manage_directors',
    'manage_admins',
    'system_settings',
    'view_reports',
    'manage_institutions'
  ]
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function connectToDatabase() {
  try {
    const MONGODB_URI = "mongodb+srv://dimondswebdesign_db_user:1234@cluster0.hc9ek0l.mongodb.net/Student-Management-System?retryWrites=true&w=majority&appName=Cluster0";
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    await mongoose.connect(MONGODB_URI);
    colorLog('green', '✅ Connected to MongoDB successfully');
    return true;
  } catch (error) {
    colorLog('red', '❌ Failed to connect to MongoDB:');
    console.error(error.message);
    return false;
  }
}

async function createAdmin(adminData = defaultAdminData) {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [
        { email: adminData.email },
        { nic: adminData.nic }
      ]
    });

    if (existingAdmin) {
      colorLog('yellow', '⚠️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Role: ${existingAdmin.role}`);
      return existingAdmin;
    }

    // Create new admin
    const admin = new User(adminData);
    await admin.save();

    colorLog('green', '🎉 Admin user created successfully!');
    console.log('\n📋 Admin Details:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   NIC: ${admin.nic}`);
    console.log(`   Mobile: ${admin.mobile}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Password: ${adminData.password}`);
    console.log(`   Created: ${admin.createdAt}`);

    colorLog('cyan', '\n🔐 Login Credentials:');
    colorLog('bright', `   Email: ${admin.email}`);
    colorLog('bright', `   Password: ${adminData.password}`);

    colorLog('yellow', '\n⚠️  Important: Please change the default password after first login!');

    return admin;
  } catch (error) {
    colorLog('red', '❌ Failed to create admin user:');
    console.error(error.message);
    throw error;
  }
}

async function createCustomAdmin() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  try {
    colorLog('cyan', '\n📝 Create Custom Admin User');
    colorLog('yellow', '   (Press Enter to use default values)\n');

    const customAdmin = {
      name: await question(`Name [${defaultAdminData.name}]: `) || defaultAdminData.name,
      email: await question(`Email [${defaultAdminData.email}]: `) || defaultAdminData.email,
      nic: await question(`NIC [${defaultAdminData.nic}]: `) || defaultAdminData.nic,
      mobile: await question(`Mobile [${defaultAdminData.mobile}]: `) || defaultAdminData.mobile,
      address: await question(`Address [${defaultAdminData.address}]: `) || defaultAdminData.address,
      password: await question(`Password [${defaultAdminData.password}]: `) || defaultAdminData.password,
      role: 'admin',
      permissions: defaultAdminData.permissions
    };

    rl.close();

    return await createAdmin(customAdmin);
  } catch (error) {
    rl.close();
    throw error;
  }
}

async function main() {
  try {
    colorLog('magenta', '🚀 SILG Admin Creation Script');
    colorLog('blue', '═══════════════════════════════\n');

    // Connect to database
    const connected = await connectToDatabase();
    if (!connected) {
      process.exit(1);
    }

    // Get command line arguments
    const args = process.argv.slice(2);
    const isCustom = args.includes('--custom') || args.includes('-c');
    const isHelp = args.includes('--help') || args.includes('-h');

    if (isHelp) {
      console.log('\n📖 Usage:');
      console.log('   node scripts/create-admin.js           - Create admin with default values');
      console.log('   node scripts/create-admin.js --custom  - Create admin with custom values');
      console.log('   node scripts/create-admin.js --help    - Show this help message\n');
      process.exit(0);
    }

    let admin;
    if (isCustom) {
      admin = await createCustomAdmin();
    } else {
      admin = await createAdmin();
    }

    colorLog('green', '\n✅ Script completed successfully!');

  } catch (error) {
    colorLog('red', '\n❌ Script failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    colorLog('blue', '\n🔌 Database connection closed');
  }
}

// Handle script interruption
process.on('SIGINT', async () => {
  colorLog('yellow', '\n\n⚠️  Script interrupted by user');
  await mongoose.connection.close();
  process.exit(0);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createAdmin, connectToDatabase };