import express from "express";
import { Request, Response } from "express-serve-static-core";
import * as dotenv from "dotenv";
import morgan from "morgan";

// load env ke project (sedini mungkin => maka diletakkan di awal)
dotenv.config();

import router from "./src/routes"


// buat aplikasi express
const app = express();

// pasang parser u/ JSON dan form encode
app.use(express.json());
app.use(express.urlencoded({extended: false}))
// false => objek normal
// true  => objek dalam objek

// logger
const logger = morgan("dev");
app.use(logger);

// buat handler u/ rute API
// app.METHOD
// url
// protocol://host:port/endpoint

// handler/middleware => fungsi yg memiliki 3 parameter
//                       request    => melambangkan object request
//                       response   => melambangkan object response
//                       next       => fungsi yg digunakan u/ middleware selanjutnya

// 1. fungsi anonim  => app.get("/", (3 parameter) => {})
// 2. fungsi bernama => dianjurkan
app.get("/", (req: Request, res: Response) => {
    res.send("OK");
});
// http://localhost:8000/

// get => pariadik ke 2 adalah handler (bisa 1 atau lebih)
//        jika lebih akan jalan dr handler 1 sampai terakhir (menggunakan fungsi next)
//        setelah ","

// pasang router ke app
app.use(router)


// pasangkan port ke express
// port
// - bisa langsung deklarasi        => const PORT = 8000;
// - bisa menggunakan environment

const PORT = process.env.PORT || 8000;

// pasang PORT to express
app.listen(PORT, () => {
    // parameter ke 2 => cb
    console.log(`Server is Running on PORT ${PORT}`);
});



