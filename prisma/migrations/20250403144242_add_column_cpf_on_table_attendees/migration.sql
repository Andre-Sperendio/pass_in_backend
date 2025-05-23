/*
  Warnings:

  - Added the required column `cpf` to the `attendees` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attendees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" TEXT NOT NULL,
    CONSTRAINT "attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_attendees" ("created_at", "email", "event_id", "id", "name") SELECT "created_at", "email", "event_id", "id", "name" FROM "attendees";
DROP TABLE "attendees";
ALTER TABLE "new_attendees" RENAME TO "attendees";
CREATE UNIQUE INDEX "attendees_cpf_key" ON "attendees"("cpf");
CREATE UNIQUE INDEX "attendees_event_id_email_key" ON "attendees"("event_id", "email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
