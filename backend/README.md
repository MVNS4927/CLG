# College Space Java Backend

Spring Boot backend for the CLG Space campus marketplace.

## Run

From this directory:

```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21'
.\mvnw.cmd spring-boot:run
```

The API runs at `http://localhost:8080` and the frontend can continue using `http://localhost:8080/api`.

## Database

The backend uses PostgreSQL by default:

- URL: `jdbc:postgresql://localhost:5433/CLG SPACE`
- Username: `postgres`
- Password: empty by default

Override `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD` as environment variables. Set `ADMIN_EMAILS` and `ADMIN_ACCESS_KEY` for the admin API.
