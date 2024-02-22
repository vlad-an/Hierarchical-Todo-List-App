from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .models import db
from dotenv import load_dotenv
import os

def create_app():
    load_dotenv()  # Load environment variables
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///todo.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
    CORS(app) 
         #resources={r"/api/*": {"origins": "http://localhost:3000"}})
    db.init_app(app)
    migrate = Migrate(app, db)  # Initialize Flask-Migrate
    jwt = JWTManager(app)

    with app.app_context():
        db.create_all()
        from .routes import api
        app.register_blueprint(api, url_prefix='/api')

    return app
