@echo off
echo === MIGRACIÓN AUTOMATIZADA HEALTNG ===
echo.

mkdir public\documents public\images\banners public\images\backgrounds 2>nul
mkdir src\assets\images\icons src\assets\images\logos src\assets\fonts src\assets\data 2>nul
mkdir src\features\auth\components src\features\auth\hooks src\features\auth\pages src\features\auth\types 2>nul
mkdir src\features\provider\components src\features\provider\hooks src\features\provider\pages src\features\provider\types 2>nul
mkdir src\features\provider\components\dashboard src\features\provider\components\inventory src\features\provider\components\orders src\features\provider\components\prescriptions 2>nul
mkdir src\shared\components\ui\Button src\shared\components\ui\Input src\shared\components\ui\Modal src\shared\components\ui\Card src\shared\components\ui\Table 2>nul
mkdir src\shared\layouts\AuthLayout src\shared\layouts\DashboardLayout 2>nul
mkdir src\styles\base src\styles\components src\styles\themes src\styles\utilities 2>nul
mkdir tests\unit tests\integration tests\e2e tests\fixtures 2>nul

echo ✅ Estructura creada
echo 📁 Verificando carpetas criticas...

dir src\features /ad >nul 2>&1 && echo ✅ features/ OK || echo ❌ features/ fallo
dir src\shared /ad >nul 2>&1 && echo ✅ shared/ OK || echo ❌ shared/ fallo
dir src\assets /ad >nul 2>&1 && echo ✅ assets/ OK || echo ❌ assets/ fallo

echo.
echo 📊 Resumen de carpetas creadas:
tree src /f | find /c "/" >nul && echo ✅ Estructura completa || echo ⚠️  Estructura incompleta

pause
