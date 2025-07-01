import ImageKit from 'imagekit';
import { User } from '../controller/postController';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

const uploadImage = async (base64Image: string, email: string, folderPrefix: string) => {
  try {
    const folderName = `${email.replaceAll(/[^a-zA-Z0-9]/g, '_')}/images`;
    const result = await imagekit.upload({
      file: base64Image,
      fileName: folderName,
      folder: folderPrefix, // Create a folder based on the user's email
    });

    return result.url;
  } catch (err) {
    console.error('Upload failed:', err);
  }
};

export async function compressBase64Image(base64Image: string, user: User) {
  try {
    // Split the Base64 string to separate metadata and content
    const [prefix, base64Data] = base64Image.split(',');

    const folderPrefix = prefix.includes('image')
      ? `${user.email.replaceAll(/[^a-zA-Z0-9]/g, '_')}/images`
      : `${user.email.replaceAll(/[^a-zA-Z0-9]/g, '_')}/files`;

    // Decode the Base64 string to a buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Convert the compressed buffer back to a Base64 string
    const compressedBase64 = `${prefix},${imageBuffer.toString('base64')}`;
    // Upload the compressed image to ImageKit
    const uploadedUrl = await uploadImage(compressedBase64, user.email, folderPrefix);

    return uploadedUrl;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image.');
  }
}
