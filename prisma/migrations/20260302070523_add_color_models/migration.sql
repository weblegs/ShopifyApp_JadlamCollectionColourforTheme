-- CreateTable
CREATE TABLE "CategoryDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mainCategory" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "headerColor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BrandCount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendorName" TEXT NOT NULL,
    "count" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CompleteKit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "collectionHandle" TEXT NOT NULL,
    "collectionName" TEXT NOT NULL,
    "mainProductTitle" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "skus" TEXT NOT NULL
);
