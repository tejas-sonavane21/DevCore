# Vercel Serverless Function Entry Point
# This file is required by Vercel to run Python functions

import sys
import os

# Add the backend directory to the Python path so we can import from it
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import create_app

# Vercel expects a WSGI application object named 'app'
app = create_app('production')

# For Vercel serverless, we also need to export the handler
# Vercel will automatically detect this as a Flask/WSGI app
