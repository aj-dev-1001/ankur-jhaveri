@echo off
cd /d "%~dp0"
echo Starting local preview server...
echo Keep this window open while you test.
echo.
python serve.py 5501
pause
