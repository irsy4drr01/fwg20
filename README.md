Aplikasi Pemesanan
Aplikasi ini adalah sistem manajemen pesanan yang mencakup fitur-fitur seperti manajemen pengguna, produk, promo, dan pesanan.

Tabel Konten
    Instalasi
    Struktur Database
    API Endpoints
    Penggunaan


Struktur Database

Tabel users
sql
Salin kode
CREATE TABLE IF NOT EXISTS users (
    id SERIAL,
    uuid UUID DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT users_pk PRIMARY KEY (id)
);

Tabel product
sql
Salin kode
CREATE TABLE IF NOT EXISTS product (
    id SERIAL,
    uuid UUID DEFAULT gen_random_uuid(),
    product_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT product_pk PRIMARY KEY (id)
);

Tabel promo
sql
Salin kode
CREATE TABLE IF NOT EXISTS promo (
    id SERIAL,
    uuid UUID DEFAULT gen_random_uuid(),
    promo_code VARCHAR(255) NOT NULL,
    discount INT NOT NULL,
    min_purchase_amount INT DEFAULT 0,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT promo_pk PRIMARY KEY (id)
);

Tabel orders
sql
Salin kode
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL,
    order_number VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    promo_id INT,
    subtotal INT NOT NULL,
    total_amount INT NOT NULL,
    order_date TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT orders_pk PRIMARY KEY (id),
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT promo_fk FOREIGN KEY (promo_id) REFERENCES promo (id)
);

Tabel order_details
sql
Salin kode
CREATE TABLE IF NOT EXISTS order_details (
    orders_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT order_details_pk PRIMARY KEY (orders_id, product_id),
    CONSTRAINT product_fk FOREIGN KEY (product_id) REFERENCES product (id),
    CONSTRAINT orders_fk FOREIGN KEY (orders_id) REFERENCES orders (id)
);


API Endpoints

Users
GET /users: Mendapatkan semua pengguna
GET /users/:id: Mendapatkan satu pengguna berdasarkan ID
POST /users: Menambahkan pengguna baru
PUT /users/:id: Memperbarui pengguna berdasarkan ID
DELETE /users/:id: Soft delete pengguna berdasarkan ID

Products
GET /products: Mendapatkan semua produk
GET /products/:id: Mendapatkan satu produk berdasarkan ID
POST /products: Menambahkan produk baru
PUT /products/:id: Memperbarui produk berdasarkan ID
DELETE /products/:id: Soft delete produk berdasarkan ID

Promo
GET /promos: Mendapatkan semua promo
GET /promos/:id: Mendapatkan satu promo berdasarkan ID
POST /promos: Menambahkan promo baru
PUT /promos/:id: Memperbarui promo berdasarkan ID
DELETE /promos/:id: Soft delete promo berdasarkan ID

- Order
    - GET - /orders
        - Mendapatkan semua pesanan dengan nama pengguna dan promo
    - GET - /orders/:order_number
        - Mendapatkan satu pesanan berdasarkan nomor pesanan
    - POST /orders
        - Menambahkan pesanan baru
    - PUT /orders/:order_number
        - Memperbarui pesanan berdasarkan nomor pesanan
    - DELETE /orders/:order_number
        - Soft delete pesanan berdasarkan nomor pesanan

Penggunaan
Untuk menjalankan aplikasi, pastikan semua langkah instalasi telah dilakukan dengan benar.


Packages yang diperlukan (Menyesuaikan dengan kebutuhan project)


- express@4.19.2
- pg@8.11.5
- typescript@5.4.5


Instalasi

1. npm init => Buat project node
2. git init => setup git directory

3. instalasi packages (tahap I)
    - npm i express
        - express
    - npm i pg
        - pg
    - npm i dotenv
        - dotenv, u/ menggunakan env (environment)
    - npm i -D typescript
        - typescript (dev), karena akan membuat express menggunakan ts
    -   npm i -D nodemon
        - nodemon (dev), u/ running otomatis
    -   npm i -D ts-node
        - ts-node (dev), u/ menjalankan ts pada nodemon dengan cara melakukan transfer file menjadi js

4. buat tsconfig.json
    -   npx tsc --init
        - npx jika tanpa script (package.json)
        - npm namaDiScript

5. instalasi package (tahap II)
    - npm init @eslint/config@latest => eslint

6. buat file eslint config
    - eslint.config.js
7. buat folder src
8. buat folder dist

9. buat file .gitignore di root folder project
    - ignore folder "node_modules"
    - ignore folder "dist"

10. edit modules di tsconfig.json
    - "rootDir": "./",
    - "outDir": "./dist",
    - "noImplicitAny": true,
    - "strictNullChecks": true,
    - "strictFunctionTypes": true,

11. buat file => index.ts
12. edit file index.ts

13. instalasi package (tahap III)
    - npm i -D @types/express
    - npm i -D @types/pg


Menjalankan Aplikasi WEB

npx nodemon index.ts