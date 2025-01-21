import imp
import os
import sys

# Ensure the app's directory is in the Python path
sys.path.insert(0, os.path.dirname(__file__))

wsgi = imp.load_source("wsgi" , "app.py")
# Define the WSGI application entry point
# This is required by Passenger
application = wsgi.app
