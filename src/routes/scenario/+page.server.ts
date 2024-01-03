import { Storage } from '@google-cloud/storage';
import { GOOGLE_CLOUD_KEY_FILE } from '$env/static/private';

const storage = new Storage({ keyFile: GOOGLE_CLOUD_KEY_FILE });
const bucketName = 'lingoimages';

export async function load() {
    try {
        const [files] = await storage.bucket(bucketName).getFiles();

        const imageUrls = files
            .filter(file => file.name.endsWith('.png') || file.name.endsWith('.jpg'))
            .map(file => `https://storage.googleapis.com/${bucketName}/${file.name}`);

        console.log(imageUrls);

        return {
            imageUrls
        };
    } catch (error) {
        console.error('Error: ', error);
        return {
            imageUrls: []
        };
    }
}
