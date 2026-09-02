-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "newsletterTitle",
DROP COLUMN "trustStats",
ADD COLUMN     "dayImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "eveningImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "heroImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "usps" TEXT[] DEFAULT ARRAY[]::TEXT[];

