/*
  Warnings:

  - You are about to drop the `ButtonContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Container` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImageOnButton` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SectionsOnPages` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sectionContentValueId]` on the table `Nav` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sectionContentValueId` to the `Nav` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Button" DROP CONSTRAINT "Button_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_SectionsId_fkey";

-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_asideId_fkey";

-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_carouselId_fkey";

-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_footerId_fkey";

-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_headerId_fkey";

-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_listId_fkey";

-- DropForeignKey
ALTER TABLE "ImageOnButton" DROP CONSTRAINT "ImageOnButton_buttonContentId_fkey";

-- DropForeignKey
ALTER TABLE "ImageOnButton" DROP CONSTRAINT "ImageOnButton_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_footerId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_headerId_fkey";

-- DropForeignKey
ALTER TABLE "SectionsOnPages" DROP CONSTRAINT "SectionsOnPages_pageId_pagePath_fkey";

-- DropForeignKey
ALTER TABLE "SectionsOnPages" DROP CONSTRAINT "SectionsOnPages_sectionId_fkey";

-- AlterTable
ALTER TABLE "Aside" ALTER COLUMN "style" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Carousel" ALTER COLUMN "style" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Footer" ALTER COLUMN "style" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Header" ALTER COLUMN "style" DROP NOT NULL;

-- AlterTable
ALTER TABLE "List" ALTER COLUMN "style" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Nav" ADD COLUMN     "sectionContentValueId" INTEGER NOT NULL,
ALTER COLUMN "style" DROP NOT NULL;

-- AlterTable
ALTER TABLE "NavItem" ALTER COLUMN "order" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "footerId" DROP NOT NULL,
ALTER COLUMN "headerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SectionsContent" ALTER COLUMN "style" DROP NOT NULL;

-- DropTable
DROP TABLE "ButtonContent";

-- DropTable
DROP TABLE "Container";

-- DropTable
DROP TABLE "ImageOnButton";

-- DropTable
DROP TABLE "SectionsOnPages";

-- CreateTable
CREATE TABLE "HeaderContainer" (
    "id" SERIAL NOT NULL,
    "order" INTEGER,
    "style" JSONB,
    "SectionsId" INTEGER NOT NULL,

    CONSTRAINT "HeaderContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterContainer" (
    "id" SERIAL NOT NULL,
    "order" INTEGER,
    "style" JSONB,
    "SectionsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FooterContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsideContainer" (
    "id" SERIAL NOT NULL,
    "order" INTEGER,
    "style" JSONB,
    "SectionsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AsideContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionsOnPage" (
    "id" SERIAL NOT NULL,
    "pageId" INTEGER NOT NULL,
    "pagePath" TEXT NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "path" TEXT NOT NULL DEFAULT '[pagePath]#[slug]',
    "subPage" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SectionsOnPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarouselContainer" (
    "id" SERIAL NOT NULL,
    "order" INTEGER,
    "style" JSONB,
    "SectionsId" INTEGER NOT NULL,
    "carouselId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarouselContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListContainer" (
    "id" SERIAL NOT NULL,
    "order" INTEGER,
    "style" JSONB,
    "SectionsId" INTEGER NOT NULL,
    "listId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ButtonLinkContent" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "icon" TEXT,

    CONSTRAINT "ButtonLinkContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageOnButtonLink" (
    "id" SERIAL NOT NULL,
    "imageId" INTEGER NOT NULL,
    "fatherId" INTEGER NOT NULL,

    CONSTRAINT "ImageOnButtonLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HeaderToHeaderContainer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FooterToFooterContainer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AsideToAsideContainer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageOnButtonLink_fatherId_key" ON "ImageOnButtonLink"("fatherId");

-- CreateIndex
CREATE UNIQUE INDEX "_HeaderToHeaderContainer_AB_unique" ON "_HeaderToHeaderContainer"("A", "B");

-- CreateIndex
CREATE INDEX "_HeaderToHeaderContainer_B_index" ON "_HeaderToHeaderContainer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FooterToFooterContainer_AB_unique" ON "_FooterToFooterContainer"("A", "B");

-- CreateIndex
CREATE INDEX "_FooterToFooterContainer_B_index" ON "_FooterToFooterContainer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AsideToAsideContainer_AB_unique" ON "_AsideToAsideContainer"("A", "B");

-- CreateIndex
CREATE INDEX "_AsideToAsideContainer_B_index" ON "_AsideToAsideContainer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Nav_sectionContentValueId_key" ON "Nav"("sectionContentValueId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_name_key" ON "Page"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- AddForeignKey
ALTER TABLE "HeaderContainer" ADD CONSTRAINT "HeaderContainer_SectionsId_fkey" FOREIGN KEY ("SectionsId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FooterContainer" ADD CONSTRAINT "FooterContainer_SectionsId_fkey" FOREIGN KEY ("SectionsId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsideContainer" ADD CONSTRAINT "AsideContainer_SectionsId_fkey" FOREIGN KEY ("SectionsId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nav" ADD CONSTRAINT "Nav_sectionContentValueId_fkey" FOREIGN KEY ("sectionContentValueId") REFERENCES "SectionsContentValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES "Header"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_footerId_fkey" FOREIGN KEY ("footerId") REFERENCES "Footer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionsOnPage" ADD CONSTRAINT "SectionsOnPage_pageId_pagePath_fkey" FOREIGN KEY ("pageId", "pagePath") REFERENCES "Page"("id", "path") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionsOnPage" ADD CONSTRAINT "SectionsOnPage_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarouselContainer" ADD CONSTRAINT "CarouselContainer_SectionsId_fkey" FOREIGN KEY ("SectionsId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarouselContainer" ADD CONSTRAINT "CarouselContainer_carouselId_fkey" FOREIGN KEY ("carouselId") REFERENCES "Carousel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListContainer" ADD CONSTRAINT "ListContainer_SectionsId_fkey" FOREIGN KEY ("SectionsId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListContainer" ADD CONSTRAINT "ListContainer_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Button" ADD CONSTRAINT "Button_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ButtonLinkContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ButtonLinkContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageOnButtonLink" ADD CONSTRAINT "ImageOnButtonLink_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageOnButtonLink" ADD CONSTRAINT "ImageOnButtonLink_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "ButtonLinkContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HeaderToHeaderContainer" ADD CONSTRAINT "_HeaderToHeaderContainer_A_fkey" FOREIGN KEY ("A") REFERENCES "Header"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HeaderToHeaderContainer" ADD CONSTRAINT "_HeaderToHeaderContainer_B_fkey" FOREIGN KEY ("B") REFERENCES "HeaderContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FooterToFooterContainer" ADD CONSTRAINT "_FooterToFooterContainer_A_fkey" FOREIGN KEY ("A") REFERENCES "Footer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FooterToFooterContainer" ADD CONSTRAINT "_FooterToFooterContainer_B_fkey" FOREIGN KEY ("B") REFERENCES "FooterContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AsideToAsideContainer" ADD CONSTRAINT "_AsideToAsideContainer_A_fkey" FOREIGN KEY ("A") REFERENCES "Aside"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AsideToAsideContainer" ADD CONSTRAINT "_AsideToAsideContainer_B_fkey" FOREIGN KEY ("B") REFERENCES "AsideContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
