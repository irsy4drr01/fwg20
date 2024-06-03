import { v2 as Cloudinary, ConfigOptions } from "cloudinary";

const cloudConfig: ConfigOptions = {
    cloud_name: process.env.CLOUDE_NAME,
    api_key: process.env.CLOUDE_KEY,
    secure: true,
};

Cloudinary.config(cloudConfig);

export default Cloudinary;