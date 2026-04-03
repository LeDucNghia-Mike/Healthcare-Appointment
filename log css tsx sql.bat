@echo off
cd /d "%~dp0"

:: Use UTF-8
chcp 65001 >nul

echo Processing TSX files...
(
for /r %%f in (*.tsx) do (
    echo ===== %%f =====
    type "%%f"
    echo.
)
) > note_tsx.txt

echo Processing CSS files...
(
for /r %%f in (*.css) do (
    echo ===== %%f =====
    type "%%f"
    echo.
)
) > note_css.txt

echo Processing SQL files...
(
for /r %%f in (*.sql) do (
    echo ===== %%f =====
    type "%%f"
    echo.
)
) > note_sql.txt

echo Done! All files exported.
pause