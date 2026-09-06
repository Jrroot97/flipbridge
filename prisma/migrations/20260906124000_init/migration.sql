-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fulfillmentPreference" TEXT NOT NULL DEFAULT 'FBA',
    "defaultReferralFee" DOUBLE PRECISION NOT NULL DEFAULT 15,
    "defaultFbaFee" DOUBLE PRECISION NOT NULL DEFAULT 4.75,
    "defaultFbmShipping" DOUBLE PRECISION NOT NULL DEFAULT 6.5,
    "defaultPrepCost" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "currency" TEXT NOT NULL DEFAULT 'USD',

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RESEARCHING',
    "ebayUrl" TEXT,
    "ebayTitle" TEXT NOT NULL,
    "ebayCondition" TEXT NOT NULL DEFAULT 'Used',
    "ebayPrice" DOUBLE PRECISION NOT NULL,
    "ebayShipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amazonAsin" TEXT,
    "amazonTitle" TEXT NOT NULL,
    "amazonPrice" DOUBLE PRECISION NOT NULL,
    "amazonCategory" TEXT NOT NULL DEFAULT 'Home & Kitchen',
    "fulfillmentType" TEXT NOT NULL DEFAULT 'FBA',
    "referralFeePercent" DOUBLE PRECISION NOT NULL,
    "fulfillmentFee" DOUBLE PRECISION NOT NULL,
    "prepCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE INDEX "Deal_userId_status_idx" ON "Deal"("userId", "status");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
