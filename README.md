# server-manager
Server Manager with Java, Spring Boot and Angular

## Description
A list of servers ip addresses. So not really a "Server Manager" but a list of servers / devices with
the ability to ping a server / device.

## TODO
- FIX image fetch in ServerResource.java (the hack)
- add different image to differentiate server or device
- use env variables in angular & java for ports

## Usage
### Dev
1. start the Docker database container

2. start the Java backend
```bash
run from IDE of choice
```
3. start the Angular frontend
```bash
cd <to/the/folder>
ng serve
```

### Prod
1. start the Docker database container

2. Package the app and start the Java backend
```bash
java -jar <package-name>
```
3. build the Angular frontend and upload etc...
```bash
cd <to/the/folder>
ng build
```

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