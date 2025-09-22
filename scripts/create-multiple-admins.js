const { createAdmin, connectToDatabase } = require('./create-admin');
require('dotenv').config();

// Multiple admin configurations
const adminConfigs = [
  {
    name: 'System Administrator',
    email: 'admin@silg.gov.lk',
    nic: '199012345678',
    mobile: '+94771234567',
    address: 'Ministry of Education, Isurupaya, Battaramulla, Sri Lanka',
    password: 'admin123456',
    role: 'admin',
    permissions: ['create_users', 'delete_users', 'manage_directors', 'manage_admins', 'system_settings', 'view_reports']
  },
  {
    name: 'Technical Administrator',
    email: 'tech.admin@silg.gov.lk',
    nic: '199112345679',
    mobile: '+94771234568',
    address: 'Ministry of Education, Isurupaya, Battaramulla, Sri Lanka',
    password: 'techadmin123',
    role: 'admin',
    permissions: ['system_settings', 'view_reports', 'manage_directors']
  },
  {
    name: 'Super Administrator',
    email: 'super.admin@silg.gov.lk',
    nic: '199212345680',
    mobile: '+94771234569',
    address: 'Ministry of Education, Isurupaya, Battaramulla, Sri Lanka',
    password: 'superadmin123',
    role: 'admin',
    permissions: ['create_users', 'delete_users', 'manage_directors', 'manage_admins', 'system_settings', 'view_reports', 'manage_institutions', 'backup_restore']
  }
];

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

async function createMultipleAdmins() {
  try {
    colorLog('magenta', '🚀 SILG Multiple Admin Creation Script');
    colorLog('blue', '════════════════════════════════════════\n');

    // Connect to database
    const connected = await connectToDatabase();
    if (!connected) {
      process.exit(1);
    }

    colorLog('cyan', `📝 Creating ${adminConfigs.length} admin users...\n`);

    const results = [];

    for (let i = 0; i < adminConfigs.length; i++) {
      const config = adminConfigs[i];
      colorLog('yellow', `⏳ Creating admin ${i + 1}/${adminConfigs.length}: ${config.name}`);
      
      try {
        const admin = await createAdmin(config);
        results.push({ success: true, admin: config, created: admin });
        colorLog('green', `✅ Successfully created: ${config.email}\n`);
      } catch (error) {
        results.push({ success: false, admin: config, error: error.message });
        colorLog('red', `❌ Failed to create: ${config.email} - ${error.message}\n`);
      }
    }

    // Summary
    colorLog('blue', '📊 Creation Summary:');
    colorLog('blue', '═══════════════════\n');

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    colorLog('green', `✅ Successfully created: ${successful.length}`);
    colorLog('red', `❌ Failed to create: ${failed.length}`);

    if (successful.length > 0) {
      colorLog('cyan', '\n🔐 Login Credentials for Created Admins:');
      successful.forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.admin.name}`);
        console.log(`   Email: ${result.admin.email}`);
        console.log(`   Password: ${result.admin.password}`);
      });
    }

    if (failed.length > 0) {
      colorLog('red', '\n❌ Failed Creations:');
      failed.forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.admin.name}`);
        console.log(`   Email: ${result.admin.email}`);
        console.log(`   Error: ${result.error}`);
      });
    }

    colorLog('yellow', '\n⚠️  Important: Please change all default passwords after first login!');

  } catch (error) {
    colorLog('red', '\n❌ Script failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    colorLog('blue', '\n🔌 Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  createMultipleAdmins();
}