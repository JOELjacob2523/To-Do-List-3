/* This is for MsSQL*/
CREATE TABLE List (
ListID BIGINT IDENTITY (1,1) PRIMARY KEY,
Subject VARCHAR(255),
Description VARCHAR(255),
Date DATE,
Time TIME,
userID BIGINT FOREIGN KEY REFERENCES users(userID)
);

CREATE TABLE users (
  userID BIGINT IDENTITY (1,1) PRIMARY KEY,
  username VARCHAR(255) NULL,
  password VARCHAR(255) NULL,
  token VARCHAR (MAX) NULL
);

/* This is for MySQL*/
CREATE TABLE users (
  userID BIGINT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NULL,
  password VARCHAR(255) NULL,
  token TEXT NULL,
  PRIMARY KEY (userID)
);

CREATE TABLE List (
  ListID BIGINT NOT NULL AUTO_INCREMENT,
  Subject VARCHAR(255),
  Description VARCHAR(255),
  Date DATE,
  Time TIME,
  userID BIGINT,
  FOREIGN KEY(userID) REFERENCES users(userID),
  PRIMARY KEY (ListID)
);

