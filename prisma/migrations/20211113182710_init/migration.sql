/*
  Warnings:

  - You are about to drop the `Object` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ObjectImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ObjectImage" DROP CONSTRAINT "ObjectImage_objectId_fkey";

-- DropTable
DROP TABLE "Object";

-- DropTable
DROP TABLE "ObjectImage";

-- CreateTable
CREATE TABLE "object" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "object_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objectImage" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "objectId" INTEGER NOT NULL,

    CONSTRAINT "objectImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "objectImage" ADD CONSTRAINT "objectImage_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "object"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
