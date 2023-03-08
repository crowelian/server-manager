# server-manager
Server Manager with Java, Spring Boot and Angular

## Description
A list of servers ip addresses. Can be pinged.

## Usage
1. start the Docker database container
2. start the Java backend
3. start the Angular frontend

## Postgres
login to bash
```bash
# login to postgres
psql -U postgres

# create database
CREATE DATABASE postgresservers;

# connect to the server database
\c postgresservers
```