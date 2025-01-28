@echo off
echo Setting up the Notes App...

:: PostgreSQL Path
set PSQL_PATH=D:\Postgresql\bin

:: Database Variables
set DB_NAME=notes_app
set DB_USER=postgres
set DB_PASSWORD=postgres
set SQL_FILE=backend\db\schema.sql

:: Check if PostgreSQL is available
if not exist "%PSQL_PATH%\psql.exe" (
    echo Error: PostgreSQL is not installed in the specified path: %PSQL_PATH%.
    exit /b
)

:: Check if the database already exists
echo Checking if the database already exists...
"%PSQL_PATH%\psql" -U %DB_USER% -d postgres -c "SELECT 1 FROM pg_database WHERE datname='%DB_NAME%';" > nul 2>&1

if %errorlevel% equ 0 (
    echo The database %DB_NAME% already exists. Continuing...
) else (
    echo Creating database %DB_NAME%...
    "%PSQL_PATH%\psql" -U %DB_USER% -d postgres -c "CREATE DATABASE %DB_NAME%;"
)

:: Execute schema.sql if tables do not exist
if exist %SQL_FILE% (
    echo Setting up the database schema...
    "%PSQL_PATH%\psql" -U %DB_USER% -d %DB_NAME% -f %SQL_FILE%
) else (
    echo Error: The schema.sql file was not found at %SQL_FILE%.
    exit /b
)

:: Start the backend
echo Starting the backend...
cd backend
start cmd /k "npm start"
cd ..

:: Wait a few seconds before starting the frontend
timeout /t 5 /nobreak >nul

:: Open VS Code in the frontend folder
echo Opening Visual Studio Code in the frontend folder...
cd frontend
start code .

:: Display an alert message
powershell -Command "& {Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('Setup completed successfully! Click "Go Live" in VS Code to access the application.', 'Setup Complete', 'OK', [System.Windows.Forms.MessageBoxIcon]::Information)}"

exit
