import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  // Universal Categories (ALL regions)
  { name: "Groceries", icon: "🛒", color: "#22c55e", region: null },
  { name: "Medical", icon: "🏥", color: "#ef4444", region: null },
  { name: "Insurance", icon: "🛡️", color: "#8b5cf6", region: null },
  { name: "Mortgage", icon: "🏠", color: "#f59e0b", region: null },
  { name: "Rent", icon: "🏢", color: "#d97706", region: null },
  { name: "Car", icon: "🚙", color: "#6366f1", region: null },
  { name: "Gas/Petrol", icon: "⛽", color: "#71717a", region: null },
  { name: "Parking", icon: "🅿️", color: "#3b82f6", region: null },
  { name: "School Payment", icon: "🎓", color: "#7c3aed", region: null },
  { name: "Utilities", icon: "💡", color: "#eab308", region: null },
  { name: "DTE/Electricity", icon: "⚡", color: "#facc15", region: null },
  { name: "Water", icon: "💧", color: "#0ea5e9", region: null },
  { name: "Internet", icon: "📶", color: "#06b6d4", region: null },
  { name: "Phone", icon: "📱", color: "#14b8a6", region: null },
  { name: "Shopping", icon: "🛍️", color: "#ec4899", region: null },
  { name: "Entertainment", icon: "🎬", color: "#f97316", region: null },
  { name: "Dining", icon: "🍽️", color: "#14b8a6", region: null },
  { name: "Subscriptions", icon: "📺", color: "#a855f7", region: null },
  { name: "Gym/Fitness", icon: "💪", color: "#10b981", region: null },
  { name: "Childcare", icon: "👶", color: "#f472b6", region: null },
  { name: "Pets", icon: "🐾", color: "#fb923c", region: null },
  { name: "Travel", icon: "✈️", color: "#0284c7", region: null },
  { name: "Personal Care", icon: "💇", color: "#c084fc", region: null },
  { name: "Clothing", icon: "👕", color: "#f43f5e", region: null },
  { name: "Gifts", icon: "🎁", color: "#e11d48", region: null },
  { name: "Donations", icon: "❤️", color: "#be123c", region: null },
  { name: "Taxes", icon: "📋", color: "#334155", region: null },
  { name: "Other", icon: "📦", color: "#64748b", region: null },
  
  // US Specific
  { name: "Uber", icon: "🚕", color: "#000000", region: "US" },
  { name: "Uber Eats", icon: "🍔", color: "#0ea5e9", region: "US" },
  { name: "Lyft", icon: "🚗", color: "#ff00bf", region: "US" },
  { name: "DoorDash", icon: "🥡", color: "#ff3008", region: "US" },
  { name: "Grubhub", icon: "🍱", color: "#f63440", region: "US" },
  { name: "Amazon", icon: "📦", color: "#ff9900", region: "US" },
  { name: "Costco", icon: "🏪", color: "#005daa", region: "US" },
  { name: "Walmart", icon: "🛒", color: "#0071ce", region: "US" },
  { name: "Target", icon: "🎯", color: "#cc0000", region: "US" },
  { name: "Home Depot", icon: "🔨", color: "#f96302", region: "US" },
  { name: "HOA Fees", icon: "🏘️", color: "#475569", region: "US" },
  { name: "401k/Retirement", icon: "💰", color: "#16a34a", region: "US" },
  { name: "Student Loans", icon: "📚", color: "#7c3aed", region: "US" },
  
  // Indonesia Specific
  { name: "Gojek", icon: "🏍️", color: "#10b981", region: "INDONESIA" },
  { name: "Grab", icon: "🚗", color: "#00b14f", region: "INDONESIA" },
  { name: "Tokopedia", icon: "🛒", color: "#42b549", region: "INDONESIA" },
  { name: "Shopee", icon: "🛍️", color: "#ee4d2d", region: "INDONESIA" },
  { name: "GoFood", icon: "🍜", color: "#00aa5b", region: "INDONESIA" },
  { name: "GrabFood", icon: "🍲", color: "#00b14f", region: "INDONESIA" },
  { name: "Bluebird", icon: "🚙", color: "#0066b3", region: "INDONESIA" },
  { name: "PLN/Listrik", icon: "⚡", color: "#0066b3", region: "INDONESIA" },
  { name: "PDAM/Air", icon: "💧", color: "#0ea5e9", region: "INDONESIA" },
  { name: "Indihome", icon: "📶", color: "#e31937", region: "INDONESIA" },
  { name: "Telkomsel", icon: "📱", color: "#e31937", region: "INDONESIA" },
  { name: "BPJS", icon: "🏥", color: "#00965e", region: "INDONESIA" },
  { name: "Zakat", icon: "🕌", color: "#059669", region: "INDONESIA" },
  { name: "Sekolah", icon: "🎓", color: "#7c3aed", region: "INDONESIA" },
  { name: "Pembantu/ART", icon: "🏠", color: "#f59e0b", region: "INDONESIA" },
  { name: "Tol/E-Money", icon: "🛣️", color: "#3b82f6", region: "INDONESIA" },
  
  // Singapore Specific
  { name: "Grab SG", icon: "🚗", color: "#00b14f", region: "SINGAPORE" },
  { name: "Gojek SG", icon: "🏍️", color: "#10b981", region: "SINGAPORE" },
  { name: "foodpanda", icon: "🐼", color: "#d70f64", region: "SINGAPORE" },
  { name: "Deliveroo", icon: "🛵", color: "#00ccbc", region: "SINGAPORE" },
  { name: "NTUC FairPrice", icon: "🛒", color: "#003da5", region: "SINGAPORE" },
  { name: "Cold Storage", icon: "🛒", color: "#002b5c", region: "SINGAPORE" },
  { name: "Sheng Siong", icon: "🛒", color: "#e31837", region: "SINGAPORE" },
  { name: "HDB Fees", icon: "🏢", color: "#005bbb", region: "SINGAPORE" },
  { name: "SP Services", icon: "💡", color: "#00a0e3", region: "SINGAPORE" },
  { name: "Singtel", icon: "📱", color: "#ed1c24", region: "SINGAPORE" },
  { name: "StarHub", icon: "📶", color: "#009639", region: "SINGAPORE" },
  { name: "EZ-Link/Transit", icon: "🚇", color: "#00a550", region: "SINGAPORE" },
  { name: "CPF", icon: "💰", color: "#003da5", region: "SINGAPORE" },
  { name: "Medisave", icon: "🏥", color: "#00965e", region: "SINGAPORE" },
  
  // Europe Specific
  { name: "Uber EU", icon: "🚕", color: "#000000", region: "EUROPE" },
  { name: "Bolt", icon: "🚗", color: "#34d186", region: "EUROPE" },
  { name: "Deliveroo EU", icon: "🛵", color: "#00ccbc", region: "EUROPE" },
  { name: "Just Eat", icon: "🍔", color: "#ff8000", region: "EUROPE" },
  { name: "Glovo", icon: "🛵", color: "#ffc244", region: "EUROPE" },
  { name: "Carrefour", icon: "🛒", color: "#004e9f", region: "EUROPE" },
  { name: "Tesco", icon: "🛒", color: "#00539f", region: "EUROPE" },
  { name: "Lidl", icon: "🛒", color: "#0050aa", region: "EUROPE" },
  { name: "Aldi", icon: "🛒", color: "#00005f", region: "EUROPE" },
  { name: "EDF/Energy", icon: "⚡", color: "#ff6600", region: "EUROPE" },
  { name: "Council Tax", icon: "🏛️", color: "#475569", region: "EUROPE" },
  { name: "NHS/Healthcare", icon: "🏥", color: "#005eb8", region: "EUROPE" },
  { name: "TV License", icon: "📺", color: "#000000", region: "EUROPE" },
  { name: "Train/Metro", icon: "🚇", color: "#e31837", region: "EUROPE" },
  
  // Australia Specific
  { name: "Uber AU", icon: "🚕", color: "#000000", region: "AUSTRALIA" },
  { name: "DiDi", icon: "🚗", color: "#ff7a00", region: "AUSTRALIA" },
  { name: "Menulog", icon: "🍔", color: "#ff8000", region: "AUSTRALIA" },
  { name: "DoorDash AU", icon: "🥡", color: "#ff3008", region: "AUSTRALIA" },
  { name: "Woolworths", icon: "🛒", color: "#125933", region: "AUSTRALIA" },
  { name: "Coles", icon: "🛒", color: "#ed1c24", region: "AUSTRALIA" },
  { name: "Bunnings", icon: "🔨", color: "#00833e", region: "AUSTRALIA" },
  { name: "AGL/Energy", icon: "⚡", color: "#e31937", region: "AUSTRALIA" },
  { name: "Origin Energy", icon: "💡", color: "#ff6600", region: "AUSTRALIA" },
  { name: "Telstra", icon: "📱", color: "#0064d2", region: "AUSTRALIA" },
  { name: "Optus", icon: "📶", color: "#00a651", region: "AUSTRALIA" },
  { name: "Opal Card", icon: "🚇", color: "#00a5e3", region: "AUSTRALIA" },
  { name: "Medicare", icon: "🏥", color: "#00965e", region: "AUSTRALIA" },
  { name: "Super/Retirement", icon: "💰", color: "#16a34a", region: "AUSTRALIA" },
  { name: "Strata Fees", icon: "🏢", color: "#475569", region: "AUSTRALIA" },
];

async function main() {
  console.log("Seeding categories...");
  
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { icon: category.icon, color: category.color, region: category.region },
      create: category,
    });
  }
  
  console.log(`${categories.length} categories seeded successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });