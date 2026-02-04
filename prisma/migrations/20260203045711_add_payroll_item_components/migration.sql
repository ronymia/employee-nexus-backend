-- CreateTable
CREATE TABLE "payroll_item_components" (
    "id" SERIAL NOT NULL,
    "payroll_item_id" INTEGER NOT NULL,
    "payroll_component_id" INTEGER NOT NULL,
    "component_type" TEXT NOT NULL,
    "calculation_type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "calculated_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payroll_item_components_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payroll_item_components_payroll_item_id_idx" ON "payroll_item_components"("payroll_item_id");

-- CreateIndex
CREATE INDEX "payroll_item_components_payroll_component_id_idx" ON "payroll_item_components"("payroll_component_id");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_item_components_payroll_item_id_payroll_component_i_key" ON "payroll_item_components"("payroll_item_id", "payroll_component_id");

-- AddForeignKey
ALTER TABLE "payroll_item_components" ADD CONSTRAINT "payroll_item_components_payroll_item_id_fkey" FOREIGN KEY ("payroll_item_id") REFERENCES "payroll_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_item_components" ADD CONSTRAINT "payroll_item_components_payroll_component_id_fkey" FOREIGN KEY ("payroll_component_id") REFERENCES "payroll_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
