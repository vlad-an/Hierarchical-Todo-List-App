from flask import Blueprint,jsonify, request
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
def create_list(user_id):
    data = request.get_json()
    new_list = List(title=data['title'], user_id=user_id)
    db.session.add(new_list)
    db.session.commit()
    return jsonify({'message': 'New list created'}), 201

@api.route('/items/<list_id>', methods=['POST'])
def create_item(list_id):
    data = request.get_json()
    new_item = Item(content=data['content'], list_id=list_id, parent_id=data.get('parent_id'))
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'New item created'}), 201

# Add more routes as needed for edit, delete, move items, etc.
