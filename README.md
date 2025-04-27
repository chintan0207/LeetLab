# LeetLab
LeetLab is a web-based coding platform inspired by LeetCode


## Step for use prisma ORM with PostgresSQL
### 1. install prisma
```bash
npm i prisma
```
### 2. install prisma/client
```bash
npm i @prisma/client
```
### 3. intialize the prisma app
```bash
npx prisma init
```
after running this command schema.prisma file create inside prisma folder 

### 4. Run the postgres locally in docker or used cloud DB_URL

this command work if you install docker in pc

```bash
docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USER=myuser -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres
```
--name my-postgres: Names the container my-postgres
-e POSTGRES_PASSWORD=mysecretpassword: Sets the PostgreSQL password
-e POSTGRES_USER=myuser: (optional) Sets a custom user (default is postgres)
-e POSTGRES_DB=mydatabase: (optional) Creates a database with the name mydatabase
-p 5432:5432: Maps the container's port 5432 to host port 5432
-d postgres: Runs the container in detached mode (running in background) using the latest postgres image

DATABASE_URL = postgresql://<username>:<password>@<host>:<port>/<database>
Based on the Docker command I gave

```bash
DATABASE_URL = postgresql://myuser:mysecretpassword@localhost:5432/mydatabase
```
### 5. Create user model in schema.prisma file
for example
```bash
model User {
  id        String   @id @default(uuid())
  name      String?
  email     String   @unique
  image     String?
  role      UserRole @default(USER)
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  ADMIN
  USER
}
```
### 6. run the command for generate prisma file for prisma configuration
```bash
npx prisma generate
```
### 7. create src/libs folder for db.js file inside db file 
```bash
import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```
when we need to use simply import prisma and used like prisma.user.findUnique, prisma.user.create

### 8. This command convert or migrate prisma model code to postgres sql 
```bash
npx prisma migrate dev
```
if not working or any issue then run npx prisma migrate reset

### 9. To sync your Prisma schema with your database
```bash
npx prisma db push
```

