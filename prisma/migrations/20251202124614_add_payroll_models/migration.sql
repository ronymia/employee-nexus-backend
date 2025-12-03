-- CreateEnum
CREATE TYPE "PayrollCycleStatus" AS ENUM ('DRAFT', 'PROCESSING', 'APPROVED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayrollFrequency" AS ENUM ('WEEKLY', 'BI_WEEKLY', 'SEMI_MONTHLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "ComponentType" AS ENUM ('EARNING', 'DEDUCTION', 'EMPLOYER_COST');

-- CreateEnum
CREATE TYPE "CalculationType" AS ENUM ('FIXED_AMOUNT', 'PERCENTAGE_OF_BASIC', 'PERCENTAGE_OF_GROSS', 'HOURLY_RATE');

-- CreateEnum
CREATE TYPE "PayrollItemStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'ON_HOLD', 'CANCELLED');

-- AlterTable
ALTER TABLE "leaves" ALTER COLUMN "status" SET DEFAULT 'pending_approve';

-- CreateTable
CREATE TABLE "payroll_components" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "component_type" "ComponentType" NOT NULL,
    "calculation_type" "CalculationType" NOT NULL,
    "default_value" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_taxable" BOOLEAN NOT NULL DEFAULT true,
    "is_statutory" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER,
    "business_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_cycles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "frequency" "PayrollFrequency" NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "status" "PayrollCycleStatus" NOT NULL DEFAULT 'DRAFT',
    "total_gross_pay" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_deductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_net_pay" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_employees" INTEGER NOT NULL DEFAULT 0,
    "approved_by" INTEGER,
    "approved_at" TIMESTAMP(3),
    "processed_by" INTEGER,
    "processed_at" TIMESTAMP(3),
    "notes" TEXT,
    "business_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_items" (
    "id" SERIAL NOT NULL,
    "payroll_cycle_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "basic_salary" DOUBLE PRECISION NOT NULL,
    "gross_pay" DOUBLE PRECISION NOT NULL,
    "total_deductions" DOUBLE PRECISION NOT NULL,
    "net_pay" DOUBLE PRECISION NOT NULL,
    "working_days" INTEGER NOT NULL,
    "present_days" DOUBLE PRECISION NOT NULL,
    "absent_days" DOUBLE PRECISION NOT NULL,
    "leave_days" DOUBLE PRECISION NOT NULL,
    "overtime_hours" DOUBLE PRECISION,
    "status" "PayrollItemStatus" NOT NULL DEFAULT 'PENDING',
    "payment_method" TEXT,
    "bank_account" TEXT,
    "transaction_ref" TEXT,
    "paid_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_item_components" (
    "id" SERIAL NOT NULL,
    "payroll_item_id" INTEGER NOT NULL,
    "component_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "calculation_base" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_item_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payslip_adjustments" (
    "id" SERIAL NOT NULL,
    "payroll_item_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payslip_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payroll_components_business_id_idx" ON "payroll_components"("business_id");

-- CreateIndex
CREATE INDEX "payroll_components_component_type_idx" ON "payroll_components"("component_type");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_components_code_business_id_key" ON "payroll_components"("code", "business_id");

-- CreateIndex
CREATE INDEX "payroll_cycles_business_id_idx" ON "payroll_cycles"("business_id");

-- CreateIndex
CREATE INDEX "payroll_cycles_status_idx" ON "payroll_cycles"("status");

-- CreateIndex
CREATE INDEX "payroll_cycles_period_start_period_end_idx" ON "payroll_cycles"("period_start", "period_end");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_cycles_name_business_id_key" ON "payroll_cycles"("name", "business_id");

-- CreateIndex
CREATE INDEX "payroll_items_payroll_cycle_id_idx" ON "payroll_items"("payroll_cycle_id");

-- CreateIndex
CREATE INDEX "payroll_items_user_id_idx" ON "payroll_items"("user_id");

-- CreateIndex
CREATE INDEX "payroll_items_status_idx" ON "payroll_items"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_items_payroll_cycle_id_user_id_key" ON "payroll_items"("payroll_cycle_id", "user_id");

-- CreateIndex
CREATE INDEX "payroll_item_components_payroll_item_id_idx" ON "payroll_item_components"("payroll_item_id");

-- CreateIndex
CREATE INDEX "payroll_item_components_component_id_idx" ON "payroll_item_components"("component_id");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_item_components_payroll_item_id_component_id_key" ON "payroll_item_components"("payroll_item_id", "component_id");

-- CreateIndex
CREATE INDEX "payslip_adjustments_payroll_item_id_idx" ON "payslip_adjustments"("payroll_item_id");

-- AddForeignKey
ALTER TABLE "payroll_components" ADD CONSTRAINT "payroll_components_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_cycles" ADD CONSTRAINT "payroll_cycles_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_payroll_cycle_id_fkey" FOREIGN KEY ("payroll_cycle_id") REFERENCES "payroll_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_item_components" ADD CONSTRAINT "payroll_item_components_payroll_item_id_fkey" FOREIGN KEY ("payroll_item_id") REFERENCES "payroll_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_item_components" ADD CONSTRAINT "payroll_item_components_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "payroll_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslip_adjustments" ADD CONSTRAINT "payslip_adjustments_payroll_item_id_fkey" FOREIGN KEY ("payroll_item_id") REFERENCES "payroll_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
