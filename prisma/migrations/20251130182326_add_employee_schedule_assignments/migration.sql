-- CreateTable
CREATE TABLE "employee_schedule_assignments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "work_schedule_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "assigned_by" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_schedule_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "employee_schedule_assignments_user_id_idx" ON "employee_schedule_assignments"("user_id");

-- CreateIndex
CREATE INDEX "employee_schedule_assignments_work_schedule_id_idx" ON "employee_schedule_assignments"("work_schedule_id");

-- CreateIndex
CREATE INDEX "employee_schedule_assignments_user_id_is_active_idx" ON "employee_schedule_assignments"("user_id", "is_active");

-- AddForeignKey
ALTER TABLE "employee_schedule_assignments" ADD CONSTRAINT "employee_schedule_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_schedule_assignments" ADD CONSTRAINT "employee_schedule_assignments_work_schedule_id_fkey" FOREIGN KEY ("work_schedule_id") REFERENCES "work_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_schedule_assignments" ADD CONSTRAINT "employee_schedule_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
