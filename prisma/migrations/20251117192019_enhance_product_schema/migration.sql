-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "priceCents" INTEGER NOT NULL,
    "originalPriceCents" INTEGER,
    "imageUrl" TEXT,
    "images" TEXT,
    "category" TEXT,
    "brand" TEXT,
    "widthCm" REAL,
    "heightCm" REAL,
    "depthCm" REAL,
    "weightKg" REAL,
    "material" TEXT,
    "color" TEXT,
    "size" TEXT,
    "variants" TEXT,
    "usage" TEXT,
    "careInstructions" TEXT,
    "warranty" TEXT,
    "deliveryTime" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOnSale" BOOLEAN NOT NULL DEFAULT false,
    "salePercentage" INTEGER,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("createdAt", "description", "id", "imageUrl", "name", "priceCents", "updatedAt") SELECT "createdAt", "description", "id", "imageUrl", "name", "priceCents", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
