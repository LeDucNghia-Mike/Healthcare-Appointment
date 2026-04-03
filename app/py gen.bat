@echo off
cd /d "%~dp0"

:: Set UTF-8
chcp 65001 >nul

echo Processing PY files...

(
for /r %%f in (*.py) do (
    echo ===== %%f =====
    type "%%f"
    echo.
)
) > note_py.txt

echo Done! Python files exported to note_py.txt


pause