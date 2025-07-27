/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `service_plans` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "system_modules" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_plan_modules" (
    "service_plan_id" INTEGER NOT NULL,
    "system_module_id" INTEGER NOT NULL,
    "is_enabled" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "business_modules" (
    "service_plan_id" INTEGER NOT NULL,
    "system_module_id" INTEGER NOT NULL,
    "is_enabled" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "system_modules_name_key" ON "system_modules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "service_plan_modules_service_plan_id_system_module_id_key" ON "service_plan_modules"("service_plan_id", "system_module_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_modules_service_plan_id_system_module_id_key" ON "business_modules"("service_plan_id", "system_module_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_plans_name_key" ON "service_plans"("name");

-- AddForeignKey
ALTER TABLE "service_plan_modules" ADD CONSTRAINT "service_plan_modules_service_plan_id_fkey" FOREIGN KEY ("service_plan_id") REFERENCES "service_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_plan_modules" ADD CONSTRAINT "service_plan_modules_system_module_id_fkey" FOREIGN KEY ("system_module_id") REFERENCES "system_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_modules" ADD CONSTRAINT "business_modules_service_plan_id_fkey" FOREIGN KEY ("service_plan_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_modules" ADD CONSTRAINT "business_modules_system_module_id_fkey" FOREIGN KEY ("system_module_id") REFERENCES "system_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
