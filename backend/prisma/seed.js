import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🗑️  Clearing existing data...");
  try {
    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.user.deleteMany();
    console.log("✅ Existing data cleared");
  } catch (error) {
    console.log("⚠️  Note: Some tables may not exist yet, continuing...");
  }

  // Create test users
  console.log("👤 Creating users...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.create({
    data: {
      email: "alice@example.com",
      password: hashedPassword,
      name: "Alice Johnson",
    },
  });
  console.log(`✅ Created user: ${user1.email}`);

  const user2 = await prisma.user.create({
    data: {
      email: "bob@example.com",
      password: hashedPassword,
      name: "Bob Smith",
    },
  });
  console.log(`✅ Created user: ${user2.email}`);

  const user3 = await prisma.user.create({
    data: {
      email: "charlie@example.com",
      password: hashedPassword,
      name: "Charlie Davis",
    },
  });
  console.log(`✅ Created user: ${user3.email}`);

  // Create chats for user1 (Alice)
  console.log("💬 Creating chats and messages...");

  const chat1 = await prisma.chat.create({
    data: {
      title: "Getting Started with AI",
      userId: user1.id,
      messages: {
        create: [
          {
            role: "user",
            content: "Hello! Can you help me understand how AI works?",
          },
          {
            role: "model",
            content:
              "Of course! AI, or Artificial Intelligence, is a branch of computer science that aims to create machines capable of intelligent behavior. It involves teaching computers to learn from data, recognize patterns, and make decisions.",
          },
          {
            role: "user",
            content:
              "That sounds interesting! What are some practical applications?",
          },
          {
            role: "model",
            content:
              "AI has many practical applications including: virtual assistants (like me!), recommendation systems, autonomous vehicles, medical diagnosis, fraud detection, and natural language processing. The possibilities are constantly expanding!",
          },
        ],
      },
    },
  });
  console.log(`✅ Created chat: ${chat1.title}`);

  const chat2 = await prisma.chat.create({
    data: {
      title: "Cooking Tips",
      userId: user1.id,
      messages: {
        create: [
          {
            role: "user",
            content: "What are some tips for cooking pasta perfectly?",
          },
          {
            role: "model",
            content:
              "Here are some tips for perfect pasta: 1) Use plenty of salted water (1 liter per 100g pasta), 2) Don't add oil to the water, 3) Stir occasionally to prevent sticking, 4) Cook until al dente (firm to bite), 5) Save some pasta water for the sauce!",
          },
        ],
      },
    },
  });
  console.log(`✅ Created chat: ${chat2.title}`);

  const chat3 = await prisma.chat.create({
    data: {
      title: "JavaScript Best Practices",
      userId: user1.id,
      messages: {
        create: [
          {
            role: "user",
            content: "What are some JavaScript best practices I should follow?",
          },
          {
            role: "model",
            content:
              "Great question! Here are key JavaScript best practices: 1) Use const/let instead of var, 2) Use strict equality (===) over loose equality (==), 3) Handle errors with try-catch, 4) Use meaningful variable names, 5) Keep functions small and focused, 6) Use async/await for asynchronous code, 7) Avoid global variables.",
          },
          {
            role: "user",
            content: "What about performance optimization?",
          },
          {
            role: "model",
            content:
              "For performance: 1) Minimize DOM manipulation, 2) Use event delegation, 3) Debounce/throttle expensive operations, 4) Lazy load resources, 5) Use Web Workers for heavy computations, 6) Optimize loops and avoid nested loops when possible, 7) Use proper data structures (Map, Set, etc.).",
          },
        ],
      },
    },
  });
  console.log(`✅ Created chat: ${chat3.title}`);

  // Create chats for user2 (Bob)
  const chat4 = await prisma.chat.create({
    data: {
      title: "Travel Planning",
      userId: user2.id,
      messages: {
        create: [
          {
            role: "user",
            content: "I want to plan a trip to Japan. What should I know?",
          },
          {
            role: "model",
            content:
              "Japan is amazing! Here are some tips: 1) Best time to visit is spring (cherry blossoms) or fall (colorful foliage), 2) Get a JR Pass for unlimited train travel, 3) Learn basic Japanese phrases, 4) Try local cuisine, 5) Respect local customs (bow, remove shoes indoors), 6) Visit both modern cities (Tokyo) and traditional sites (Kyoto).",
          },
          {
            role: "user",
            content: "How many days should I spend there?",
          },
          {
            role: "model",
            content:
              "I recommend at least 10-14 days to experience Japan properly. This allows you to visit Tokyo (3-4 days), Kyoto (3-4 days), and other cities like Osaka, Nara, or Hiroshima. If you have less time, focus on 2-3 cities max to avoid rushing.",
          },
        ],
      },
    },
  });
  console.log(`✅ Created chat: ${chat4.title}`);

  const chat5 = await prisma.chat.create({
    data: {
      title: "Fitness Routine",
      userId: user2.id,
      messages: {
        create: [
          {
            role: "user",
            content: "I'm a beginner. How should I start working out?",
          },
          {
            role: "model",
            content:
              "Great decision to start! Here's a beginner plan: 1) Start with 20-30 minutes, 3 times per week, 2) Include cardio (walking, jogging), 3) Add bodyweight exercises (push-ups, squats, planks), 4) Always warm up and cool down, 5) Rest between workout days, 6) Stay consistent and gradually increase intensity.",
          },
        ],
      },
    },
  });
  console.log(`✅ Created chat: ${chat5.title}`);

  // Create chats for user3 (Charlie)
  const chat6 = await prisma.chat.create({
    data: {
      title: "Learning Python",
      userId: user3.id,
      messages: {
        create: [
          {
            role: "user",
            content: "I want to learn Python. Where should I start?",
          },
          {
            role: "model",
            content:
              "Python is a great choice! Start with: 1) Install Python from python.org, 2) Learn basics: variables, data types, loops, functions, 3) Practice with small projects, 4) Use resources like Python.org tutorial or Codecademy, 5) Try building a simple calculator or to-do app, 6) Join Python communities for help.",
          },
          {
            role: "user",
            content: "What can I build once I learn the basics?",
          },
          {
            role: "model",
            content:
              "Lots of options! You can build: 1) Web scrapers with BeautifulSoup, 2) Web apps with Flask or Django, 3) Data analysis with Pandas, 4) Automation scripts, 5) Games with Pygame, 6) APIs with FastAPI, 7) Machine learning models with scikit-learn. Start simple and gradually tackle complex projects!",
          },
        ],
      },
    },
  });
  console.log(`✅ Created chat: ${chat6.title}`);

  // Get statistics
  const userCount = await prisma.user.count();
  const chatCount = await prisma.chat.count();
  const messageCount = await prisma.message.count();

  console.log("\n📊 Seeding completed successfully!");
  console.log("═══════════════════════════════");
  console.log(`👥 Users created: ${userCount}`);
  console.log(`💬 Chats created: ${chatCount}`);
  console.log(`💭 Messages created: ${messageCount}`);
  console.log("═══════════════════════════════");
  console.log("\n🔑 Test Credentials:");
  console.log("Email: alice@example.com");
  console.log("Email: bob@example.com");
  console.log("Email: charlie@example.com");
  console.log("Password (all): password123");
  console.log("\n✅ You can now login with these credentials!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
