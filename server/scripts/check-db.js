import prisma from "../src/config/database.js";

async function checkConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Get database info
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log("📊 PostgreSQL version:", result[0].version);

    // Check tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    console.log("\n📋 Tables in database:");
    tables.forEach((table) => {
      console.log(`  - ${table.table_name}`);
    });

    // Count records
    const userCount = await prisma.user.count();
    const chatCount = await prisma.chat.count();
    const messageCount = await prisma.message.count();

    console.log("\n📈 Database Stats:");
    console.log(`  Users: ${userCount}`);
    console.log(`  Chats: ${chatCount}`);
    console.log(`  Messages: ${messageCount}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

checkConnection();
