🏠 Rumi Room Rental Backend — Setup Instructions
------------------------------------

This project contains the backend infrastructure for the Rumi Room Rental platform.
<br>
<br>
It includes:
- Firebase Authentication (email/password, phone, Google login)
- MySQL database (user, roles, profiles)
- Flyway migrations for database schema versioning
- Spring Boot backend

This README will help you set up your environment, run the backend, and test the connections.

_Addition_ : I need your email addresses, to add you'll to the Firebase project.

1️⃣ **Prerequisites**
------------------------------------
- MySQL 8+ running locally or remote 
- Firebase service account JSON downloaded, from the project I created.
- IDE (IntelliJ recommended)

MySql - Xampp or MySQL server,
<br>
_I use mySQL server + mySQL workbench_
<br>

2️⃣ **Steps to follow to get the Backend Database running**
---------------

1)Environment Variables<br>
------------------------------------
Create a .env file or use system environment variables.

Required variables:
- **MySQL** :
<br>DB_URL=jdbc:mysql://localhost:3306 _(your mysql port, usually - localhost:3306)_<br>
DB_USERNAME=root _(usually root)_ <br>
DB_PASSWORD= your database password
- **Firebase Service Account**

  Set the environment variable:

  FIREBASE_CREDENTIALS=C:\path\to\firebase-service.json

**Download this JSON file from your Firebase project:**  
Firebase Console → Project Settings → Service Accounts → Generate new private key

> ⚠️ **Notes (Very Important)**  
> `FIREBASE_CREDENTIALS` must point to the Firebase JSON file path on your machine.


Notes (very important):
<br>
FIREBASE_CREDENTIALS must point to the **Firebase JSON file path on your machine**.
<br>
<br>
Store this file locally in a folder in Documents and copy the path and create the env variable FIREBASE_CREDENTIALS
- **IMPORTANT : Do not commit this JSON to Git**

Make sure .env variables are set.<br><br>
How to set the env variables ?
<br>
Here you go,<br>
In Command prompt :

Windows example:<br>
setx DB_URL "jdbc:mysql://localhost:3306"<br>
setx DB_USERNAME "root"<br>
setx DB_PASSWORD "root123"<br>
setx FIREBASE_CREDENTIALS "C:\path\to\firebase.json"<br>
Example information here, give your correct infor and set.<br><BR>
**IMPORTANT : Please restart your IDE after creating the environmental variables on the system.**

2)Flyway Database Migration
------------------------------------
Flyway will automatically create the database schema and tables if they don’t exist.

Default tables created:
- roles
- users
- rentee_profiles
- renter_profiles
- flyway_schema_history

Roles inserted: admin, rentee, renter

**Important : Run "CREATE DATABASE rumi_rental_db" sql statement to create the database on your sql server, before running the application.**

3)Finally Run Spring Boot:
------------------------------------
mvn spring-boot:run

4)Testing Database & Firebase
------------------------------------
1. Test MySQL Tables
GET http://localhost:8080/test/mysql/tables

- Expected output:
<br>MySQL Connected ✅ | Tables: roles, users, rentee_profiles, renter_profiles

2. Test MySQL Tables
GET http://localhost:8080/test/mysql/database

- Expected output:<br>
MySQL Connected ✅ | rumi_rental_db

3. Test Firebase Initialization
GET http://localhost:8080/test/firebase

- Expected output:
<br>Firebase Connected ✅ | App name: [DEFAULT]

3️⃣ Notes on Usage
------------------------------------
- User registration & login handled by Firebase.
- Database stores user metadata and profile information.
- Database are created using Flyway (Database Migration)
- Database are created using versioning, so with new versions we can add, update or remove as we go on.
- All role-specific info is in separate profile tables:
<br>rentee_profiles, <br>renter_profiles
- Use profile_completed & phone_verified flags to control first-time flows.

4️⃣ Best Practices
------------------------------------

- Never commit firebase-service.json to Git.
- Use .env or system variables for credentials.
<br>

For production hosting:
- Use secure DB credentials (never default root).
- Use cloud-hosted MySQL (e.g., AWS RDS, Google Cloud SQL).
- Use Firebase for all authentication — backend verifies tokens.

5️⃣ Finally What to do
------------------------------------
1. Give me your email I will add you to the Firebase project.
2. Download the Firebase service account JSON from the Firebase project.
3. Store the Json file away from the GitHub Repo, store it locally somewhere _(e.g.Documents/folder)_.
4. Now set-up the mySQL server and workbench or go with Xampp _(phpmyadmin)_.
5. Now create the environmental variables _(DB_URL, DB_USERNAME, DB_PASSWORD, FIREBASE_CREDENTIALS)_.
6. Next restart your IDE.
7. Now go to mySQL and Create a Database for Rumi with this name rumi_rental_db - use this name only _(CREATE DATABASE rumi_rental_db)_.
8. Now run the Spring Boot application.
9. Next test the endpoints to verify, database creation success.
10. Now start working with the database and the system.