import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { AMAZON_CATALOG, EBAY_CATALOG } from "../src/lib/catalog";
import { getCategory } from "../src/lib/categories";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@flipbridge.app";
const DEMO_PASSWORD = "demo1234";

type SeedDeal = {
  status: string;
  ebayIndex: number;
  notes: string;
  otherCost: number;
  fulfillmentType: "FBA" | "FBM";
};

const SEED_DEALS: SeedDeal[] = [
  {
    status: "RESEARCHING",
    ebayIndex: 0,
    notes: "Confirm serial and battery health before sending to FBA.",
    otherCost: 0,
    fulfillmentType: "FBA",
  },
  {
    status: "WATCHING",
    ebayIndex: 1,
    notes: "Watching two more Duo 6qt listings. Buy if under $48 shipped.",
    otherCost: 0,
    fulfillmentType: "FBA",
  },
  {
    status: "BUYING",
    ebayIndex: 2,
    notes: "Offer sent. Sealed box — high confidence match.",
    otherCost: 2.5,
    fulfillmentType: "FBA",
  },
  {
    status: "LISTED",
    ebayIndex: 3,
    notes: "FBA inbound created. Used-Good listing.",
    otherCost: 0,
    fulfillmentType: "FBA",
  },
  {
    status: "SOLD",
    ebayIndex: 4,
    notes: "Sold in 6 days. Repeatable SKU.",
    otherCost: 0,
    fulfillmentType: "FBA",
  },
  {
    status: "RESEARCHING",
    ebayIndex: 5,
    notes: "Thin after 8% electronics fee + FBA. Only works FBM local.",
    otherCost: 0,
    fulfillmentType: "FBM",
  },
  {
    status: "WATCHING",
    ebayIndex: 6,
    notes: "Heavy inbound. Need a cheaper freight quote.",
    otherCost: 8,
    fulfillmentType: "FBA",
  },
  {
    status: "RESEARCHING",
    ebayIndex: 7,
    notes: "Fees eat this. Keep as a cautionary example.",
    otherCost: 0,
    fulfillmentType: "FBA",
  },
];

async function main() {
  const passwordHash = await hash(DEMO_PASSWORD, 10);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: "Jordan Hale", passwordHash },
    create: {
      email: DEMO_EMAIL,
      name: "Jordan Hale",
      passwordHash,
    },
  });

  await prisma.settings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      fulfillmentPreference: "FBA",
      defaultReferralFee: 15,
      defaultFbaFee: 4.75,
      defaultFbmShipping: 6.5,
      defaultPrepCost: 1,
      currency: "USD",
    },
  });

  const existing = await prisma.deal.count({ where: { userId: user.id } });
  if (existing > 0) {
    console.log(`Demo user ready (${existing} deals already seeded).`);
    return;
  }

  for (const seed of SEED_DEALS) {
    const ebay = EBAY_CATALOG[seed.ebayIndex];
    const amazon = AMAZON_CATALOG.find((item) => item.asin === ebay.suggestedAsin);
    if (!ebay || !amazon) continue;

    const category = getCategory(amazon.category);
    const fulfillmentFee =
      seed.fulfillmentType === "FBA" ? category.typicalFbaFee : 7.25;

    await prisma.deal.create({
      data: {
        userId: user.id,
        status: seed.status,
        ebayUrl: ebay.url,
        ebayTitle: ebay.title,
        ebayCondition: ebay.condition,
        ebayPrice: ebay.price,
        ebayShipping: ebay.shipping,
        amazonAsin: amazon.asin,
        amazonTitle: amazon.title,
        amazonPrice: amazon.price,
        amazonCategory: amazon.category,
        fulfillmentType: seed.fulfillmentType,
        referralFeePercent: category.referralFeePercent,
        fulfillmentFee,
        prepCost: 1,
        otherCost: seed.otherCost,
        notes: seed.notes,
      },
    });
  }

  console.log("Seeded demo user demo@flipbridge.app / demo1234 with pipeline deals.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
