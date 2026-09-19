# Music Web V1 (มือถือ/Termux)

โปรเจกต์นี้เป็นตัวอย่างเว็บที่มี **ระบบคีย์ตรวจสอบจากไฟล์ JSON**, หน้าเล่น YouTube ด้วย Embed และ Playlist ส่วนตัวของผู้ใช้

> หมายเหตุ: เวอร์ชันนี้ตั้งใจไม่ทำฟังก์ชันดึง/แปลงเพลงจาก YouTube เป็นไฟล์ MP3/MP4 โดยตรง ให้ใช้สำหรับเนื้อหาที่คุณมีสิทธิ์ใช้งาน และใช้ YouTube Embed สำหรับการเล่น

## ติดตั้งบน Termux

```bash
pkg update
pkg install nodejs
cd ~/music-web-v1
npm install
npm start
```

แล้วเปิดเบราว์เซอร์ไปที่:

```text
http://127.0.0.1:3000
```

คีย์เริ่มต้น:

```text
DEMO-1234-ABCD
```

## เปลี่ยน/เพิ่มคีย์

ไฟล์อยู่ที่:

```text
data/keys.json
```

หรือสร้างจากหน้าเว็บในส่วน `จัดการคีย์ (ตัวอย่าง)`

## เอาขึ้นออนไลน์ฟรี

นำโค้ดชุดนี้ไป deploy บนบริการโฮสต์ Node.js ที่มี free tier ได้ แต่ควรเพิ่มระบบแอดมินและไม่เปิด `/api/keys` ให้คนทั่วไปเห็นก่อนใช้งานจริง

## โครงสร้าง

```text
music-web-v1/
├─ data/
│  └─ keys.json
├─ public/
│  ├─ index.html
│  ├─ style.css
│  └─ app.js
├─ package.json
├─ server.js
└─ README-TH.md
```
