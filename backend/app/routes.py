from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import User, List, Item, db

# Create a Blueprint for this module
api = Blueprint('api', __name__)

@api.route('/',methods=['GET','POST'])
def index():
    return jsonify(message="Welcome to the Hierarchical Todo List App!")

@api.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(username=data['username'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'New user created'}), 201

@api.route('/lists/<user_id>', methods=['POST'])
@jwt_required()
def create_list():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_list = List(title=data['title'], user_id=current_user_id)
    db.session.add(new_list)
    db.session.commit()
    return jsonify({'message': 'New list created'}), 201

@api.route('/items/<list_id>', methods=['POST'])
@jwt_required()
def create_item():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    # Ensure the list belongs to the current user
    list_ = List.query.filter_by(id=data['list_id'], user_id=current_user_id).first()
    if not list_:
        return jsonify({'message': 'List not found or not authorized'}), 403
    new_item = Item(content=data['content'], list_id=list_.id, parent_id=data.get('parent_id'))
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'New item created'}), 201

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully'}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401
