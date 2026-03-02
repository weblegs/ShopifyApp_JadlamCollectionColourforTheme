-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMPTZ,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMPTZ,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryDetail" (
    "id" SERIAL NOT NULL,
    "mainCategory" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "headerColor" TEXT NOT NULL,

    CONSTRAINT "CategoryDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandCount" (
    "id" SERIAL NOT NULL,
    "vendorName" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "BrandCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompleteKit" (
    "id" SERIAL NOT NULL,
    "collectionHandle" TEXT NOT NULL,
    "collectionName" TEXT NOT NULL,
    "mainProductTitle" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "skus" TEXT NOT NULL,

    CONSTRAINT "CompleteKit_pkey" PRIMARY KEY ("id")
);
