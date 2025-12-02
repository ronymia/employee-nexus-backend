-- CreateTable
CREATE TABLE "job_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "job_title" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "employment_type" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT,
    "responsibilities" TEXT,
    "achievements" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_history_user_id_idx" ON "job_history"("user_id");

-- AddForeignKey
ALTER TABLE "job_history" ADD CONSTRAINT "job_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
