from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from .models import List, Task
from . import db

# Initialize a Blueprint for the main functionalities related to lists and tasks.
main = Blueprint('main', __name__)

# LISTS SECTION

@main.route('/lists', methods=['POST'])
@login_required  # Ensure that only authenticated users can access this route.
def create_list():
    """
    Create a new todo list.
    
    Expects a JSON payload with a 'title'.
    Returns a success message with the created list's details if successful.
    """
    title = request.json.get('title')
    if not title:
        # Validate that the 'title' field is provided.
        return jsonify({"error": "Title is required"}), 400

    # Create a new List instance and add it to the database.
    new_list = List(title=title, user_id=current_user.id)
    db.session.add(new_list)
    db.session.commit()

    # Return a success message along with the created list's details.
    return jsonify({"message": "List created successfully", "list": {"id": new_list.id, "title": new_list.title}}), 201

@main.route('/lists/<int:list_id>', methods=['PUT'])
@login_required  # Ensure that only authenticated users can access this route.
def update_list(list_id):
    """
    Update the title of an existing todo list.
    
    Expects a list ID in the URL path and a JSON payload with a new 'title'.
    Returns a success message with the updated list's details if successful.
    """
    title = request.json.get('title')
    if not title:
        # Validate that the 'title' field is provided.
        return jsonify({"error": "Title is required"}), 400

    # Fetch the list item from the database; 404 if not found.
    list_item = List.query.get_or_404(list_id)
    if list_item.user_id != current_user.id:
        # Check if the current user owns the list to update.
        return jsonify({"error": "Unauthorized access"}), 403

    # Update the list's title and commit the changes.
    list_item.title = title
    db.session.commit()

    # Return a success message along with the updated list's details.
    return jsonify({"message": "List updated successfully", "list": {"id": list_item.id, "title": list_item.title}}), 200

@main.route('/lists', methods=['GET'])
@login_required  # Ensure that only authenticated users can access this route.
def get_lists():
    """
    Fetch all todo lists belonging to the current user.
    
    Returns a JSON array of lists.
    """
    lists = List.query.filter_by(user_id=current_user.id).all()
    lists_json = [{"id": l.id, "title": l.title, 'user_id': l.user_id} for l in lists]
    return jsonify(lists_json), 200

# TASKS SECTION

@main.route('/lists/<int:list_id>/tasks', methods=['POST'])
@login_required  # Ensure that only authenticated users can access this route.
def add_task_to_list(list_id):
    """
    Add a new task to a specific todo list.
    
    Expects a list ID in the URL path and a JSON payload with task details ('title', 'description', 'complete', 'parent_id').
    Returns a success message with the added task's details if successful.
    """
    data = request.json
    title = data.get('title')
    description = data.get('description', '')
    complete = data.get('complete', False)
    parent_id = data.get('parent_id', None)

    if not title:
        # Validate that the 'title' field is provided.
        return jsonify({"error": "Title is required"}), 400

    # Fetch the list item from the database; 403 if unauthorized access.
    list_item = List.query.get_or_404(list_id)
    if list_item.user_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    # Create a new Task instance and add it to the database.
    new_task = Task(title=title, description=description, complete=complete, list_id=list_id, parent_id=parent_id)
    db.session.add(new_task)
    db.session.commit()

    # Return a success message along with the added task's details.
    return jsonify({"message": "Task added successfully", "task": new_task.to_dict()}), 201

@main.route('/tasks/<int:task_id>', methods=['PUT'])
@login_required  # Ensure that only authenticated users can access this route.
def update_task(task_id):
    """
    Update details of an existing task.
    
    Expects a task ID in the URL path and a JSON payload with updated task details.
    Returns a success message with the updated task's details if successful.
    """
    data = request.json
    title = data.get('title')
    description = data.get('description')
    complete = data.get('complete')

    # Fetch the task item from the database; 403 if unauthorized access.
    task = Task.query.get_or_404(task_id)
    if task.list.user_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    # Update the task details as provided.
    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    if complete is not None:
        task.complete = complete

    db.session.commit()

    # Return a success message along with the updated task's details.
    return jsonify({"message": "Task updated successfully", "task": task.to_dict()}), 200

@main.route('/tasks', methods=['GET'])
@login_required  # Ensure that only authenticated users can access this route.
def get_tasks():
    """
    Fetch all tasks belonging to the current user, across all lists.
    
    Returns a JSON array of tasks.
    """
    tasks = Task.query.join(List, Task.list_id == List.id).filter(List.user_id == current_user.id).all()
    tasks_json = [task.to_dict() for task in tasks]
    return jsonify(tasks_json), 200

@main.route('/tasks/<int:task_id>/complete', methods=['PUT'])
@login_required  # Ensure that only authenticated users can access this route.
def mark_task_complete(task_id):
    """
    Mark a specific task as complete.
    
    Expects a task ID in the URL path. Sets the 'complete' status of the task to True.
    Returns a success message with the updated task's details if successful.
    """
    task = Task.query.get_or_404(task_id)
    if task.list.user_id != current_user.id:
        # Check if the current user owns the task to update.
        return jsonify({"error": "Unauthorized access"}), 403

    task.complete = True
    db.session.commit()

    # Return a success message indicating the task is now complete, along with the task's details.
    return jsonify({"message": "Task marked as complete", "task": task.to_dict()}), 200

@main.route('/tasks/<int:task_id>/move/<int:list_id>', methods=['PUT'])
@login_required  # Ensure that only authenticated users can access this route.
def move_task(task_id, list_id):
    """
    Move a task to a different list.
    
    Expects a task ID and a target list ID in the URL path.
    Returns a success message with the moved task's details if successful.
    """
    task = Task.query.get_or_404(task_id)
    new_list = List.query.get_or_404(list_id)

    if task.list.user_id != current_user.id or new_list.user_id != current_user.id:
        # Check if the current user owns both the task and the target list.
        return jsonify({"error": "Unauthorized access"}), 403

    task.list_id = list_id
    db.session.commit()

    # Return a success message along with the moved task's details.
    return jsonify({"message": "Task moved successfully", "task": task.to_dict()}), 200