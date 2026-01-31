-- AlterTable
ALTER TABLE "attendances" ADD COLUMN     "employeeUserId" INTEGER;

-- CreateTable
CREATE TABLE "employee_payroll_components" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "component_id" INTEGER NOT NULL,
    "value" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "effective_from" DATE NOT NULL,
    "effective_to" DATE,
    "is_override" BOOLEAN NOT NULL DEFAULT false,
    "assigned_by" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_payroll_components_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "employee_payroll_components_user_id_idx" ON "employee_payroll_components"("user_id");

-- CreateIndex
CREATE INDEX "employee_payroll_components_component_id_idx" ON "employee_payroll_components"("component_id");

-- CreateIndex
CREATE INDEX "employee_payroll_components_user_id_is_active_idx" ON "employee_payroll_components"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "employee_payroll_components_effective_from_effective_to_idx" ON "employee_payroll_components"("effective_from", "effective_to");

-- CreateIndex
CREATE UNIQUE INDEX "employee_payroll_components_user_id_component_id_effective__key" ON "employee_payroll_components"("user_id", "component_id", "effective_from");

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_employeeUserId_fkey" FOREIGN KEY ("employeeUserId") REFERENCES "employees"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_payroll_components" ADD CONSTRAINT "employee_payroll_components_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "employees"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_payroll_components" ADD CONSTRAINT "employee_payroll_components_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "payroll_components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_payroll_components" ADD CONSTRAINT "employee_payroll_components_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
