CREATE TABLE IF NOT EXISTS rentee_profiles (
    user_id VARCHAR(128) PRIMARY KEY,
    preferred_location VARCHAR(255),
    gender ENUM('male','female','other'),
    date_of_birth DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);