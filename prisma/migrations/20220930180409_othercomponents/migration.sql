/*
  Warnings:

  - You are about to drop the `CarouselSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,path]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `footerId` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headerId` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `style` to the `SectionsContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pagePath` to the `SectionsOnPages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `SectionsOnPages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CarouselSection" DROP CONSTRAINT "CarouselSection_SectionsId_fkey";

-- DropForeignKey
ALTER TABLE "CarouselSection" DROP CONSTRAINT "CarouselSection_carouselId_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_SectionsId_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_listId_fkey";

-- DropForeignKey
ALTER TABLE "SectionsOnPages" DROP CONSTRAINT "SectionsOnPages_pageId_fkey";

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "footerId" INTEGER NOT NULL,
ADD COLUMN     "headerId" INTEGER NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL DEFAULT '/pages/[slug]';

-- AlterTable
ALTER TABLE "SectionsContent" ADD COLUMN     "style" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "SectionsOnPages" ADD COLUMN     "pagePath" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL DEFAULT '[pagePath]#[slug]',
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "subPage" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "CarouselSection";

-- DropTable
DROP TABLE "ListItem";

-- CreateTable
CREATE TABLE "Header" (
    "id" SERIAL NOT NULL,
    "style" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Header_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Footer" (
    "id" SERIAL NOT NULL,
    "style" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Footer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aside" (
    "id" SERIAL NOT NULL,
    "style" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aside_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nav" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "style" JSONB NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Nav_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavItem" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "subPagesVisible" BOOLEAN NOT NULL DEFAULT false,
    "pageId" INTEGER NOT NULL,
    "navId" INTEGER NOT NULL,

    CONSTRAINT "NavItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Container" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "style" JSONB NOT NULL,
    "SectionsId" INTEGER NOT NULL,
    "headerId" INTEGER,
    "footerId" INTEGER,
    "asideId" INTEGER,
    "carouselId" INTEGER,
    "listId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AsideToPage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AsideToPage_AB_unique" ON "_AsideToPage"("A", "B");

-- CreateIndex
CREATE INDEX "_AsideToPage_B_index" ON "_AsideToPage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Page_id_path_key" ON "Page"("id", "path");

-- AddForeignKey
ALTER TABLE "NavItem" ADD CONSTRAINT "NavItem_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NavItem" ADD CONSTRAINT "NavItem_navId_fkey" FOREIGN KEY ("navId") REFERENCES "Nav"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES "Header"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_footerId_fkey" FOREIGN KEY ("footerId") REFERENCES "Footer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionsOnPages" ADD CONSTRAINT "SectionsOnPages_pageId_pagePath_fkey" FOREIGN KEY ("pageId", "pagePath") REFERENCES "Page"("id", "path") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_SectionsId_fkey" FOREIGN KEY ("SectionsId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES "Header"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_footerId_fkey" FOREIGN KEY ("footerId") REFERENCES "Footer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_asideId_fkey" FOREIGN KEY ("asideId") REFERENCES "Aside"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_carouselId_fkey" FOREIGN KEY ("carouselId") REFERENCES "Carousel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AsideToPage" ADD CONSTRAINT "_AsideToPage_A_fkey" FOREIGN KEY ("A") REFERENCES "Aside"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AsideToPage" ADD CONSTRAINT "_AsideToPage_B_fkey" FOREIGN KEY ("B") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
