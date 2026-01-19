/*
  Warnings:

  - A unique constraint covering the columns `[project_id,user_id,role]` on the table `project_members` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "project_members_project_id_user_id_key";

-- CreateIndex
CREATE INDEX "project_members_role_idx" ON "project_members"("role");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_project_id_user_id_role_key" ON "project_members"("project_id", "user_id", "role");
