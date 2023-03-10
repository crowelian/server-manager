# server-manager
Server Manager with Java, Spring Boot and Angular

## Description
A list of servers ip addresses. So not really a "Server Manager" but a list of servers / devices with
the ability to ping a server / device.

## TODO
- FIX image fetch in ServerResource.java (the hack)
- add different image to differentiate server or device

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