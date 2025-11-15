@echo off
call .\venv\Scripts\activate
python manage.py test --verbosity 2 --noinput
pause