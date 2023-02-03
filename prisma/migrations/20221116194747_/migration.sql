-- DropForeignKey
ALTER TABLE "ImageOnSectionsContent" DROP CONSTRAINT "ImageOnSectionsContent_imageId_fkey";

-- AddForeignKey
ALTER TABLE "ImageOnSectionsContent" ADD CONSTRAINT "ImageOnSectionsContent_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
