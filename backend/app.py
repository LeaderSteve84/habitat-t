#!/usr/bin/env python3
"""module for flask application"""
from app import create_app

# create the flask application
app = create_app()


if __name__ == "__main__":
    app.run()
