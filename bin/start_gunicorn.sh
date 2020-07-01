#!/bin/bash
source /home/mark/test.hrsmnt.ru/env/bin/activate
exec gunicorn -c "/home/mark/test.hrsmnt.ru/hrsmnt/gunicorn_config.py" hrsmnt.wsgi
