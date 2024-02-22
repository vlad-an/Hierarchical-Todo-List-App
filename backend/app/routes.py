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
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'New user created'}), 201

@api.route('/lists', methods=['GET'])  # Handle GET requests separately
@jwt_required()
def get_lists():
    current_user_id = get_jwt_identity()
    user_lists = List.query.filter_by(user_id=current_user_id).all()
    lists_data = [{"id": list_.id, "title": list_.title} for list_ in user_lists]
    return jsonify({"lists": lists_data}), 200

@api.route('/lists', methods=['POST'])  # Updated path
@jwt_required()
def create_list():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_list = List(title=data['title'], user_id=current_user_id)
    db.session.add(new_list)
    db.session.commit()
    return jsonify({'message': 'New list created'}), 201

@api.route('/items/<int:list_id>', methods=['POST'])
@jwt_required()
def create_item(list_id):
    current_user_id = get_jwt_identity()
    # Check if the list belongs to the current user to prevent unauthorized access
    list_ = List.query.get_or_404(list_id)
    if list_.user_id != current_user_id:
        return jsonify({'message': 'Not authorized to add items to this list'}), 403

    data = request.get_json()
    # Optionally handle parent_id for hierarchical item structure
    new_item = Item(content=data['content'], list_id=list_id, parent_id=data.get('parent_id', None))
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'New item created'}), 201

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # Use default method (pbkdf2:sha256)
    hashed_password = generate_password_hash(data['password'])
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
    
# Update a list's title
@api.route('/lists/<int:list_id>', methods=['PUT'])
@jwt_required()
def update_list(list_id):
    current_user_id = get_jwt_identity()
    list = List.query.filter_by(id=list_id, user_id=current_user_id).first()
    if list:
        data = request.get_json()
        list.title = data['title']
        db.session.commit()
        return jsonify({'message': 'List updated successfully'}), 200
    else:
        return jsonify({'message': 'List not found or not authorized'}), 404

# Update an item's content
@api.route('/items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_item(item_id):
    current_user_id = get_jwt_identity()
    item = Item.query.filter_by(id=item_id, list_id=List.query.filter_by(user_id=current_user_id)).first()
    if item:
        data = request.get_json()
        item.content = data['content']
        db.session.commit()
        return jsonify({'message': 'Item updated successfully'}), 200
    else:
        return jsonify({'message': 'Item not found or not authorized'}), 404

# Delete a list
@api.route('/lists/<int:list_id>', methods=['DELETE'])
@jwt_required()
def delete_list(list_id):
    current_user_id = get_jwt_identity()
    list = List.query.filter_by(id=list_id, user_id=current_user_id).first()
    if list:
        db.session.delete(list)
        db.session.commit()
        return jsonify({'message': 'List deleted successfully'}), 200
    else:
        return jsonify({'message': 'List not found or not authorized'}), 404

# Delete an item
@api.route('/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    current_user_id = get_jwt_identity()
    item = Item.query.filter_by(id=item_id, list_id=List.query.filter_by(user_id=current_user_id)).first()
    if item:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Item deleted successfully'}), 200
    else:
        return jsonify({'message': 'Item not found or not authorized'}), 404

# Move an item to a different list
@api.route('/items/<int:item_id>/move/<int:new_list_id>', methods=['PUT'])
@jwt_required()
def move_item(item_id, new_list_id):
    current_user_id = get_jwt_identity()
    item = Item.query.filter_by(id=item_id, list_id=List.query.filter_by(user_id=current_user_id)).first()
    new_list = List.query.filter_by(id=new_list_id, user_id=current_user_id).first()
    if item and new_list:
        item.list_id = new_list_id
        db.session.commit()
        return jsonify({'message': 'Item moved successfully'}), 200
    else:
        return jsonify({'message': 'Item or list not found or not authorized'}), 404

