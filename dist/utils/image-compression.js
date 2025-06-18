import sharp from "sharp";
import ImageKit from "imagekit";
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});
const uploadImage = async (base64Image, email, prompt) => {
    try {
        const folderName = `${email.replaceAll(/[^a-zA-Z0-9]/g, "_")}/images`;
        console.log(folderName);
        const result = await imagekit.upload({
            file: base64Image,
            fileName: folderName,
            folder: `${email.replaceAll(/[^a-zA-Z0-9]/g, "_")}/images`, // Create a folder based on the user's email
        });
        return result.url;
    }
    catch (err) {
        console.error("Upload failed:", err);
    }
};
export async function compressBase64Image(base64Image, user, prompt) {
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
        // Upload the compressed image to ImageKit
        const uploadedUrl = await uploadImage(compressedBase64, user.email, prompt);
        return uploadedUrl;
    }
    catch (error) {
        console.error("Error compressing image:", error);
        throw new Error("Failed to compress image.");
    }
}
