-- AlterTable
ALTER TABLE "User"
ADD COLUMN "allowWeekendActivityCreation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "activityReminders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "weeklyDigest" BOOLEAN NOT NULL DEFAULT false;
