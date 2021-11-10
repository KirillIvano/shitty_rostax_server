-- CreateTable
CREATE TABLE "ObjectImage" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "objectId" INTEGER NOT NULL,

    CONSTRAINT "ObjectImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ObjectImage" ADD CONSTRAINT "ObjectImage_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
