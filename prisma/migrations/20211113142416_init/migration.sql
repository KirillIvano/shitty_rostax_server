-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "image" VARCHAR NOT NULL,

    CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "shortDescription" VARCHAR NOT NULL,
    "image" VARCHAR NOT NULL DEFAULT E'',
    "description" VARCHAR NOT NULL DEFAULT E'',
    "price" INTEGER,
    "certificate" VARCHAR NOT NULL DEFAULT E'',
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
