import { Injectable } from "@nestjs/common";
import * as path from "node:path";
import * as fs from "node:fs";
import * as fsPromise from "node:fs/promises";

@Injectable()
export class FsHelper {
    async uploadFile(file: Express.Multer.File) {
        const uploadsFolder = path.join(process.cwd(), 'uploads');

        if (!fs.existsSync(uploadsFolder)) {
            fs.mkdirSync(uploadsFolder, { recursive: true });
        }

        const extension = path.extname(file.originalname); 
        const fileName = `${Date.now()}${extension}`;
        const absolutePath = path.join(uploadsFolder, fileName);

        await fsPromise.writeFile(absolutePath, file.buffer);
        return {
            message: "success",
            fileUrl: `/uploads/${fileName}`
        };
    }


    async deleteFile(filePath: string) {
        const cleanPath = filePath.replace(/^\/+/, ''); 
        const absolutePath = path.join(process.cwd(), cleanPath);

        if (fs.existsSync(absolutePath)) {
            await fsPromise.unlink(absolutePath);
        } else {
            console.warn(`Fayl topilmadi: ${absolutePath}`);
        }
    }

}

