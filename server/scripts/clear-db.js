import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("🗑️  Clearing all data...");

  try {
    // Delete in correct order (child to parent due to foreign keys)
    await prisma.message.deleteMany();
    console.log("✅ Deleted all messages");

    await prisma.chat.deleteMany();
    console.log("✅ Deleted all chats");

    await prisma.user.deleteMany();
    console.log("✅ Deleted all users");

    console.log("🎉 Database cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
