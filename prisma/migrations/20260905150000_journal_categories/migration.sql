-- Journal-categorieën: eigen tabel, koppeling op Article, bestaande artikelen ingedeeld op hun oude tag-prefix.
CREATE TABLE "ArticleCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ArticleCategory_slug_key" ON "ArticleCategory"("slug");

ALTER TABLE "Article" ADD COLUMN "categoryId" TEXT;
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ArticleCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "ArticleCategory" ("id", "slug", "name", "description", "order") VALUES
  ('cat_leren',     'leren',     'Leren & techniek',   'Van je eerste start tot obstakels: hoe wakeboarden werkt en hoe je sneller vooruitgaat.', 0),
  ('cat_materiaal', 'materiaal', 'Materiaal',          'Boards, bindingen, helm, vest en wetsuit: wat je nodig hebt, wanneer, en wat je beter huurt.', 1),
  ('cat_turkije',   'turkije',   'Turkije & Antalya',  'Het weer, het park en de omgeving van onze reizen aan de Turkse Riviera.', 2),
  ('cat_reizen',    'reizen',    'Reizen & seizoen',   'Sportvakanties kiezen, het beste moment om te gaan en wat er in een reis zit.', 3),
  ('cat_nederland', 'nederland', 'Nederland',          'Cable parks en wakeboarden dicht bij huis.', 4);

-- Oude tags zoals "Turkije · 5 min": categorie uit de prefix, tag wordt alleen de leestijd.
UPDATE "Article" SET "categoryId" = 'cat_turkije'   WHERE "categoryId" IS NULL AND "tag" ILIKE 'Turkije%';
UPDATE "Article" SET "categoryId" = 'cat_materiaal' WHERE "categoryId" IS NULL AND "tag" ILIKE 'Materiaal%';
UPDATE "Article" SET "categoryId" = 'cat_leren'     WHERE "categoryId" IS NULL AND "tag" ILIKE 'Leren%';
UPDATE "Article" SET "categoryId" = 'cat_reizen'    WHERE "categoryId" IS NULL AND ("tag" ILIKE 'Reizen%' OR "tag" ILIKE 'Seizoen%');
UPDATE "Article" SET "categoryId" = 'cat_nederland' WHERE "categoryId" IS NULL AND "tag" ILIKE 'Nederland%';
UPDATE "Article" SET "tag" = trim(split_part("tag", '·', 2)) WHERE "tag" LIKE '%·%';
