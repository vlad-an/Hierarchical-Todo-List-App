# Import necessary modules from Flask and its extensions for the application setup
from flask import Flask  # Core Flask class used to instantiate the application
from flask_sqlalchemy import SQLAlchemy  # ORM extension for Flask to interact with SQL databases
from flask_migrate import Migrate  # Handles SQLAlchemy database migrations for Flask applications
from flask_cors import CORS  # Manages Cross-Origin Resource Sharing (CORS), allowing or restricting resource access
from flask_login import LoginManager  # Manages user sessions for authentication and authorization
from dotenv import load_dotenv  # Loads environment variables from a .env file into the application's environment
import os  # Provides a way of using operating system dependent functionality

# Initialize extensions without specific Flask application instances
db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()

def create_app():
    """
    Creates and configures an instance of the Flask application.

    Returns:
        app (Flask): The Flask application instance, fully configured.
    """
    load_dotenv()  # Load environment variables from .env file

    app = Flask(__name__)  # Instantiate the Flask application

    # Configure the application with necessary configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///todo.db')  # Database connection URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable modification tracking to save resources
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback_secret_key')  # Secret key for session management

    # Initialize CORS with default settings for the application to handle cross-origin requests
    CORS(app, supports_credentials=True)

    # Initialize extensions with the application instance
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    # Configure the login view, which is used for @login_required
    login_manager.login_view = 'auth.login'  # Specify the endpoint for unauthorized users

    # User loader callback for Flask-Login to load a user from the user ID stored in the session
    from .models import User  # Import User model for login_manager
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Import blueprints
    from .auth import auth as auth_blueprint  # Import authentication blueprint
    from .main import main as main_blueprint  # Import main functionality blueprint

    # Register blueprints with the application
    app.register_blueprint(auth_blueprint, url_prefix='/auth')  # Prefix all auth routes with /auth
    app.register_blueprint(main_blueprint)  # Main routes don't need a prefix

    # Ensure the database tables are created
    with app.app_context():
        db.create_all()

    return app  # Return the configured Flask application instance

