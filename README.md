# server-manager
Server Manager with Java, Spring Boot and Angular

## Description
A list of servers ip addresses. So not really a "Server Manager" but a list of servers / devices with
the ability to ping a server / device.

## TODO
- FIX image fetch in ServerResource.java
- add different image to differentiate server or device
- check if ip is local or remote and show it eg. with color in ip column
- add link to ip = click to open in a new tab?

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