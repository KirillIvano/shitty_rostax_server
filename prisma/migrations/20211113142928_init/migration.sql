-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);
