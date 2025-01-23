import sharp from "sharp";
export async function compressBase64Image(base64Image) {
    try {
        // Split the Base64 string to separate metadata and content
        const [prefix, base64Data] = base64Image.split(",");
        // Decode the Base64 string to a buffer
        const imageBuffer = Buffer.from(base64Data, "base64");
        // Compress the image using Sharp
        const compressedBuffer = await sharp(imageBuffer)
            .resize({ width: 800 }) // Resize to a maximum width of 800px
            .jpeg({ quality: 80 }) // Compress with JPEG quality of 80%
            .png({ quality: 80 }) // Compress with PNG quality of 80%
            .toBuffer();
        // Convert the compressed buffer back to a Base64 string
        const compressedBase64 = `${prefix},${compressedBuffer.toString("base64")}`;
        return compressedBase64;
    }
    catch (error) {
        console.error("Error compressing image:", error);
        throw new Error("Failed to compress image.");
    }
}
