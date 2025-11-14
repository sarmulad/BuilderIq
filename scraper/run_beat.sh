#!/bin/bash
celery -A celery_app beat --loglevel=info
