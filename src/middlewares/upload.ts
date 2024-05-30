// import multer, { Field, Options, diskStorage }  from "multer";

// const multerDisk: diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "/public/imgs");
//     },
//     filename: (req, file, cb) => {
//         // misal: image-timestamp.{jpg|png|jpeg}
//         const extName = path.extName(file.originalname);
//         const newFIleName = `image-${Date.now()}${extName}`
//         cb(null, newFIleName);
//     }
// });

// const multerOptions: Options = {
//     storage: multerDisk,
//     limits: {
//         fileSize: 1e6,
//     },
//     fileFilter: (req, file, cb) => {
//         const allowedExt = ["jpg", "png", "jpeg"];
//         const extName = path.extName(file.originalname);

//         if (!allowedExt.test(extName)) return cb(null, false);
//         cb(null, true);
//     },
// };

// const uploder = multer();

// export const singleUploader = (fieldName: string) => singleUploader.single(fieldName);
// export const multiUploader = (fieldName: string, maxCount: number, ) => uploader.array(fieldName, maxCount);
// export const multiFielduploader = (fieldCOnfig: field[]) => multiUploader.fields(fieldCOnfig);