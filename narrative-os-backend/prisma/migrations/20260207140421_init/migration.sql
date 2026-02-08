-- CreateTable
CREATE TABLE "raw_text" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "narrative_unit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raw_text_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "entities" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "conflict" TEXT,
    "source_type" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "narrative_cluster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit_ids" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "narrative_index" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cluster_id" TEXT NOT NULL,
    "strength" REAL NOT NULL,
    "sentiment_score" REAL NOT NULL,
    "velocity" REAL NOT NULL,
    "media_coverage" REAL NOT NULL,
    "social_heat" REAL NOT NULL,
    "consistency" REAL NOT NULL,
    "lifecycle" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
