@echo off
cd /d "%~dp0"

:: Set UTF-8
chcp 65001 >nul

echo ===============================
echo LISTING ALL PY FILES (UTF-8)
echo ===============================
echo.

(
for /r %%f in (*.py) do (
    echo ===== FILE: %%f =====
    type "%%f"
    echo.
)
) > all_python_files.txt

echo Done! Output saved to all_python_files.txt
pause