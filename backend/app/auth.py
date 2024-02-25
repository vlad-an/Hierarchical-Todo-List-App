# Import necessary modules and objects from Flask and its extensions
from flask import Blueprint, request, jsonify, session  # Flask components for handling requests, responses, and sessions
from werkzeug.security import generate_password_hash, check_password_hash  # Utilities for hashing and checking passwords
from flask_login import login_user, current_user, logout_user, login_required  # Flask-Login functions for managing user sessions

# Import the User model and database instance from the local package
from .models import User
from . import db

# Create a Blueprint named 'auth' for organizing authentication routes
auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    """
    Endpoint for user registration. Creates a new user with the provided email and password.
    """
    # Extract email and password from the request body
    email = request.json.get('email')
    password = request.json.get('password')
    
    # Validate presence of email and password
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Check if a user already exists with the given email
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"error": "Email address already in use"}), 400

    # Hash the provided password for secure storage
    hashed_password = generate_password_hash(password)
    
    # Create a new User instance and add it to the database
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Log in the newly created user automatically
    login_user(new_user)
    
    # Store user ID in session for later retrieval
    session['user_id'] = new_user.id

    return jsonify({"message": "User created successfully"}), 201

@auth.route('/login', methods=['POST'])
def login():
    """
    Endpoint for user login. Authenticates the user with the provided email and password.
    """
    # Extract email and password from the request body
    email = request.json.get('email')
    password = request.json.get('password')

    # Validate presence of email and password
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Retrieve the user by email
    user = User.query.filter_by(email=email).first()

    # Check if user exists and the password is correct
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Log the user in and remember their login state
    login_user(user, remember=True)
    
    # Store user ID in session
    session['user_id'] = user.id

    return jsonify({"message": "Login successful"}), 200

@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Endpoint for user logout. Terminates the current user session.
    """
    # Log out the current user
    logout_user()
    
    # Remove user ID from session
    session.pop('user_id', None)

    return jsonify({"message": "Logout successful"}), 200

@auth.route('/get_current_user', methods=['GET'])
@login_required
def get_current_user():
    """
    Endpoint to retrieve the current authenticated user's information.
    """
    user = current_user
    if user:
        # Return user's ID and email if they are authenticated
        return jsonify({
            "id": user.id,
            "email": user.email,
        }), 200
    else:
        # Handle case where the current user is not found (should not occur with proper use of login_required)
        return jsonify({"error": "User not found"}), 404

@auth.route('/check_authentication', methods=['GET'])
def check_authentication():
    """
    Endpoint to check if the current user is authenticated.
    """
    # Return the authentication status of the current user
    if current_user.is_authenticated:
        return jsonify({"authenticated": True}), 200
    else:
        return jsonify({"authenticated": False}), 200
