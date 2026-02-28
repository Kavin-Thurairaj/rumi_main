# 🏠 Room Rental Backend `v2`

> **Next-generation backend service for the Room Rental Project.** <br> Built with **React** (Frontend) + **Spring Boot** (Backend) and powered by **PostgreSQL** via **Supabase**.

---

## 📚 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Language** | ![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=flat&logo=openjdk&logoColor=white) |
| **Framework** | ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=springboot&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) |
| **Hosting** | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) |
| **Build Tool** | ![Maven](https://img.shields.io/badge/Apache%20Maven-C71A36?style=flat&logo=Apache%20Maven&logoColor=white) |

---

## 🚀 Getting Started

Follow these steps carefully to connect your local environment to the **shared TEST development database**.

> [!IMPORTANT]  
> **Security Rules:**
> * Use **ONLY** the development database: `rumi-rental-db-test`.
> * **NEVER** commit your `env.properties` file to GitHub.
> * **NO CHANGES** needed for `application.properties`.

---

## 🛠 Database Setup (Supabase)

### 1️⃣ Access & Connection
* **Accept Invite:** Check your email for the Supabase workspace invitation.
* **Get JDBC URL:** 1. Open [Supabase Dashboard](https://supabase.com/dashboard) → `rumi-rental-db-test` (from the Projects).
    2. Click **Connect** (top-right corner).
    3. Choose **Connection Type: JDBC** and **Method: Session Pooler**.
    4. Copy the URL (e.g., `jdbc:postgresql://xxxxx.supabase.co:5432/postgres`).

### 2️⃣ Credentials
* **Get Password:** Will be given by me to the team.
* Copy the database password for the next step.

---

## 📂 Environment Configuration

> [!WARNING]  
> This project uses `env.properties`, **NOT** `.env`. You must create this manually in the root directory.

### 3️⃣ Create `env.properties`
rumi_backend_v2 → New → File → Name it (**env.properties**)

Place this file in the **root folder** ( will appear above `src` and `pom.xml` after created):

```text
rumi_backend_v2/
 ├── src
 ├── env.properties   <-- 📄 Create this file here
 └── pom.xml
```
### 4️⃣ Add Credentials
Inside `env.properties`, add the following lines (replace with your actual values):

```properties
DB_URL=your_copied_jdbc_url
DB_USERNAME=the_database_username (In the link you copied from Supabase)
DB_PASSWORD=your_database_password (I have provided it to you)
```

## ⚙️ Project Status (Already Configured)
The following configurations are hardcoded—no action needed:

1. **PostgreSQL Dependency: Drivers and JPA dialects are pre-installed (I have done it for you).**

2. **Datasource Mapping: <br>application.properties is already linked to your environment variables:**

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```
> [!IMPORTANT]
> 
> **You do not have to do any configuration just create the env.properties file.**

### 5️⃣ Remove Old Environment Variables (If Any)

If you previously configured MySQL or another database:

1. Go to Edit System Environment Variables (Search in the Windows Search Bar)
2. Click Environment Variables
3. Delete the following variables (if they exist):
   - DB_URL
   - DB_USERNAME
   - DB_PASSWORD
   - FIREBASE_CREDENTIALS
4. Click OK

> [!IMPORTANT]
> 
> **🔁 Restart IntelliJ after deleting them**

## Finally What to do
### ▶️ How to Run
1. Pull 🔄 the latest code from main branch.
2. Create 📄 the env.properties file correctly as instructed above.
3. Run ▶️ the Spring Boot application.

### ✅ Expected Result 
Application starts on port 8080 (default) without datasource errors.

### 🛠 Troubleshooting
If you see...Try this...Connection Refused → Verify you are using the Session Pooler (Port 5432).

Property not found → Ensure the file name is exactly env.properties (lowercase).

## 👥 Team Workflow

### 1. Pull 🔄 | 2. Configure Env ⚙️ | 3. Run ▶️ | 4. Code 💻