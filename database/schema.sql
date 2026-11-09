-- Ocean Paradise Resort - MySQL schema (MySQL 8+ / MariaDB 10.5+)
-- Run with: npm run setup (in /backend)  or  mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS ocean_paradise
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ocean_paradise;

CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(150) NULL,
  password_hash VARCHAR(255) NOT NULL,
  last_login    DATETIME NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS packages (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  category      ENUM('room','package') NOT NULL DEFAULT 'room',
  description   TEXT NOT NULL,
  price         DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_note    VARCHAR(80) NULL,              -- e.g. "per night", "per couple / 3 nights"
  image_url     VARCHAR(500) NOT NULL,
  features      JSON NULL,                     -- array of included facilities
  special_offer VARCHAR(255) NULL,
  is_featured   TINYINT(1) NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_pkg_active (is_active, sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS promotions (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(150) NOT NULL,
  category       ENUM('seasonal','holiday','event') NOT NULL DEFAULT 'seasonal',
  description    TEXT NOT NULL,
  discount_label VARCHAR(60) NULL,             -- e.g. "20% OFF"
  image_url      VARCHAR(500) NOT NULL,
  valid_from     DATE NULL,
  valid_until    DATE NULL,
  is_active      TINYINT(1) NOT NULL DEFAULT 1,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_promo_active (is_active, valid_until)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gallery (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(150) NOT NULL,
  category   ENUM('rooms','beach','pool','restaurant','activities') NOT NULL,
  image_url  VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_gallery_cat (category)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  phone      VARCHAR(40)  NULL,
  message    TEXT NOT NULL,
  is_read    TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Key/value store for editable website text, contact info, social links, JSON lists
CREATE TABLE IF NOT EXISTS site_content (
  content_key   VARCHAR(80) PRIMARY KEY,
  content_value MEDIUMTEXT NULL,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
