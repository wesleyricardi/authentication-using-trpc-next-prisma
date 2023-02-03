/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ButtonContent` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ButtonContent` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `CarouselSection` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CarouselSection` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ImageOnButton` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ImageOnButton` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ListItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ListItem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SectionsContentValue` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SectionsContentValue` table. All the data in the column will be lost.
  - You are about to drop the `CarouselTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GalleryType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SectionsContentType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Carousel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Gallery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `ListItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `SectionsContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Button" DROP CONSTRAINT "Button_sectionContentId_fkey";

-- DropForeignKey
ALTER TABLE "Carousel" DROP CONSTRAINT "Carousel_sectionContentId_fkey";

-- DropForeignKey
ALTER TABLE "Carousel" DROP CONSTRAINT "Carousel_typeId_fkey";

-- DropForeignKey
ALTER TABLE "CarouselSection" DROP CONSTRAINT "CarouselSection_SectionsId_fkey";

-- DropForeignKey
ALTER TABLE "CarouselSection" DROP CONSTRAINT "CarouselSection_carouselId_fkey";

-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_sectionContentId_fkey";

-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_typeId_fkey";

-- DropForeignKey
ALTER TABLE "ImageOnButton" DROP CONSTRAINT "ImageOnButton_buttonContentId_fkey";

-- DropForeignKey
ALTER TABLE "ImageOnSectionsContent" DROP CONSTRAINT "ImageOnSectionsContent_imageId_fkey";

-- DropForeignKey
ALTER TABLE "ImageOnSectionsContent" DROP CONSTRAINT "ImageOnSectionsContent_sectionContentValueId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_sectionContentId_fkey";

-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_sectionContentId_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_SectionsId_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_listId_fkey";

-- DropForeignKey
ALTER TABLE "SectionsContent" DROP CONSTRAINT "SectionsContent_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "SectionsContent" DROP CONSTRAINT "SectionsContent_typeId_fkey";

-- DropForeignKey
ALTER TABLE "SectionsContentValue" DROP CONSTRAINT "SectionsContentValue_sectionContentId_fkey";

-- DropForeignKey
ALTER TABLE "SectionsOnPages" DROP CONSTRAINT "SectionsOnPages_pageId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileImageId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_sectionContentId_fkey";

-- AlterTable
ALTER TABLE "ButtonContent" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Carousel" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CarouselSection" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ImageOnButton" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "ListItem" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SectionsContent" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SectionsContentValue" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profileImageId" DROP NOT NULL;

-- DropTable
DROP TABLE "CarouselTypes";

-- DropTable
DROP TABLE "GalleryType";

-- DropTable
DROP TABLE "SectionsContentType";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionsOnPages" ADD CONSTRAINT "SectionsOnPages_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionsContent" ADD CONSTRAINT "SectionsContent_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionsContentValue" ADD CONSTRAINT "SectionsContentValue_sectionContentId_fkey" FOREIGN KEY ("sectionContentId") REFERENCES "SectionsContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageOnSectionsContent" ADD CONSTRAINT "ImageOnSectionsContent_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageOnSectionsContent" ADD CONSTRAINT "ImageOnSectionsContent_sectionContentValueId_fkey" FOREIGN KEY ("sectionContentValueId") REFERENCES "SectionsContentValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_sectionContentId_fkey" FOREIGN KEY ("sectionContentId") REFERENCES "SectionsContentValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_sectionContentId_fkey" FOREIGN KEY ("sectionContentId") REFERENCES "SectionsContentValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carousel" ADD CONSTRAINT "Carousel_sectionContentId_fkey" FOREIGN KEY ("sectionContentId") REFERENCES "SectionsContentValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarouselSection" ADD CONSTRAINT "CarouselSection_carouselId_fkey" FOREIGN KEY ("carouselId") REFERENCES "Carousel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarouselSection" ADD CONSTRAINT "CarouselSection_SectionsId_fkey" FOREIGN KEY ("SectionsId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_sectionContentId_fkey" FOREIGN KEY ("sectionContentId") REFERENCES "SectionsContentValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_SectionsId_fkey" FOREIGN KEY ("SectionsId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Button" ADD CONSTRAINT "Button_sectionContentId_fkey" FOREIGN KEY ("sectionContentId") REFERENCES "SectionsContentValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageOnButton" ADD CONSTRAINT "ImageOnButton_buttonContentId_fkey" FOREIGN KEY ("buttonContentId") REFERENCES "ButtonContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_sectionContentId_fkey" FOREIGN KEY ("sectionContentId") REFERENCES "SectionsContentValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
