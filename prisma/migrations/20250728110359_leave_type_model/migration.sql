-- CreateEnum
CREATE TYPE "LeaveRolloverType" AS ENUM ('none', 'partial_roll_over', 'full_roll_over');

-- AlterEnum
ALTER TYPE "USER_ACCOUNT_STATUS" ADD VALUE 'On_Leave';

-- CreateTable
CREATE TABLE "leave_types" (
    "id" SERIAL NOT NULL,
    "leave_type" TEXT NOT NULL,
    "leave_hours" INTEGER NOT NULL DEFAULT 0,
    "leave_rollover_type" "LeaveRolloverType" NOT NULL DEFAULT 'none',
    "carry_over_limit" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'Active',
    "employment_status_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "business_id" INTEGER,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "leave_types" ADD CONSTRAINT "leave_types_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_types" ADD CONSTRAINT "leave_types_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
