/*
  Warnings:

  - A unique constraint covering the columns `[event_id,cpf]` on the table `attendees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "attendees_event_id_cpf_key" ON "attendees"("event_id", "cpf");
