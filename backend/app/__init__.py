from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .models import db, User, List, Item
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app) 

    db.init_app(app)

    with app.app_context():
        from . import routes  # Import routes
        db.create_all()


    # Import and register the Blueprint from routes.py
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app
