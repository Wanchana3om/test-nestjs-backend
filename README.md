
## Test Project (Backend)

Test Project เป็น Project เกี่ยวกับ Community ที่สามารถสร้าง Blog เพื่อ Post หรือ Comment ซึ่งทุกคนสามารถมาสนทนากันได้ โดยส่วนนี้จะเป็นส่วนของ Backend โดย [Nest](https://github.com/nestjs/nest) framework

## Prerequisites

ในการพัฒนาครั้งนี้ใช้เป็น node v18.19.0

## Installation

1.  ขั้นตอนเเรกในการติดตั้ง Project ทำการโคลน Project จาก GitHub

```bash
$ git clone https://github.com/Wanchana3om/test-nestjs-backend.git
```

```bash
$ cd test-nestjs-backend
```

```bash
$ npm install
```

2. ทำการสร้างไฟล์ .env ขึ้นมาเเล้ว config ตามรูปด้านล่าง

```bash
DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
APP_NAME=""
JWT_SECRET=
```

- config database ที่ใช้ในการเชื่อมต่อ เเละ JWT_SECRET คือรหัสที่ใช้ในการ config JSON Web Tokens ตัวอย่างเช่น JWT_SECRET=yourSecretKeyHere

3. หลังจากทำการเชื่อมต่อ database เรียบร้อยเเล้ว ให้ทำการ run migration เพื่อ migrate table

```bash
$ npm run typeorm migration:run
```

4. ทำการ run project

```bash
$ npm run start:dev
```

## Application Architecture

ในส่วนของ Architecture

<img  src="./public/Screenshot 2567-06-04 at 19.27.18.png"  alt="schema"  width="400"/>

จากรูปข้างต้นจะเห็นว่า มีการแยกโฟลเดอร์อย่างชัดเจน

- โฟลเดอร์ enities ที่ใช้ในการจัดเก็บ ไฟล์ entity ต่างๆ
- โฟลเดอร์  http ที่ภายในจะเก็บ api แยกเส้นกันไว้ ในที่นี้จะมี api ฝั่ง blog และ user ซึ่งภายในจะมีไฟล์ controller, service และ modul 
- โฟลเดอร์ dto ที่เก็บไฟล์ dto ของแต่ละ controller 
- โฟลเดอร์ resource เก็บไฟล์ที่ใช้ในการปั้น resource ที่ต้องการ
- โฟลเดอร์ test ภายในจะแยก unit test ระหว่าง controller และ service อย่างชัดเจน

- ในส่วนของ database table มีการออกแบบ relation ตามรูปข้างล่างนี้
  <img src="./public/Screenshot%202567-06-04%20at%2018.05.30.png" alt="schema" width="600"/>

## Libraries/Packages

ในส่วนของ Libraries หรือ Packages ที่ใช้จะมี

```bash
 @nestjs/typeorm
```

- เป็น Libraries ที่สะดวกในการ migrate table หรืออยากจะอัพเดท table แล้วยังทำให้จัดการกับ model table เเละ การ query ได้ง่ายมาก

```bash
  @nestjs/jwt
  @nestjs/passport
  passport-jwt
```

- นอกจากจะ create token ยังสามารถใช้ jwt strategy เป็นเหมือนระบบ Authentication Middleware คอยตรวจสอบ ว่า request ที่แนบมานั้นมี token แนบมาด้วยรึปล่าวเป็นระบบป้องกันความภัยระดับนึง

## Run Unit Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Credit

[Wanchana Inmasom](https://github.com/Wanchana3om)
