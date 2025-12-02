-- CreateTable
CREATE TABLE "education_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "degree" TEXT NOT NULL,
    "field_of_study" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT,
    "is_currently_studying" BOOLEAN NOT NULL DEFAULT false,
    "grade" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "education_history_user_id_idx" ON "education_history"("user_id");

-- AddForeignKey
ALTER TABLE "education_history" ADD CONSTRAINT "education_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
