# LeetLab
LeetLab is a web-based coding platform inspired by LeetCode.

## Steps to Use Prisma ORM with PostgreSQL

### 1. Install Prisma
```bash
npm i prisma
```

### 2. Install Prisma Client
```bash
npm i @prisma/client
```

### 3. Initialize Prisma
```bash
npx prisma init
```
After running this command, a `schema.prisma` file will be created inside the `prisma` folder.

### 4. Run PostgreSQL Locally with Docker or Use a Cloud Database

This command will work if Docker is installed on your PC:

```bash
docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USER=myuser -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres
```

Explanation:
- `--name my-postgres`: Names the container `my-postgres`.
- `-e POSTGRES_PASSWORD=mysecretpassword`: Sets the PostgreSQL password.
- `-e POSTGRES_USER=myuser`: (optional) Sets a custom user (default is `postgres`).
- `-e POSTGRES_DB=mydatabase`: (optional) Creates a database with the name `mydatabase`.
- `-p 5432:5432`: Maps the container's port 5432 to host port 5432.
- `-d postgres`: Runs the container in detached mode (background) using the latest Postgres image.

**DATABASE_URL format:**
```
postgresql://<username>:<password>@<host>:<port>/<database>
```

Based on the Docker command:

```bash
DATABASE_URL=postgresql://myuser:mysecretpassword@localhost:5432/mydatabase
```

### 5. Create User Model in `schema.prisma`
Example:

```prisma
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

### 6. Generate Prisma Client
```bash
npx prisma generate
```

### 7. Create a `libs/db.js` File for Prisma Client Instance
Example `src/libs/db.js`:

```javascript
import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

> Now, you can import `prisma` and use it like:
> - `prisma.user.findUnique`
> - `prisma.user.create`
> - etc.

### 8. Migrate Prisma Models to PostgreSQL
```bash
npx prisma migrate dev
```
If any issue occurs, you can reset the migration with:
```bash
npx prisma migrate reset
```

### 9. Sync Prisma Schema with Database
```bash
npx prisma db push
```
