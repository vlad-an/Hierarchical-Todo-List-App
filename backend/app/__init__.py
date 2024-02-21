from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .models import db, User, List, Item
from flask_cors import CORS
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a random secret key
    CORS(app)
    db.init_app(app)
    jwt = JWTManager(app)

    with app.app_context():
        from . import routes
        db.create_all()

    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app
