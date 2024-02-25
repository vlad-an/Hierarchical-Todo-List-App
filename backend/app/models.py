from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from flask_login import UserMixin

db = SQLAlchemy()  # Create a SQLAlchemy database instance to be used for our models

class User(UserMixin, db.Model):
    """
    Defines the User model, which includes information about the user and their associated lists.
    
    Attributes:
        id (Integer): A unique identifier for the user, serves as the primary key.
        email (String): The user's email address. It is unique and cannot be null.
        password (String): The user's password. Stored as a hash for security purposes.
        lists (relationship): A dynamic link to the List model, representing all lists owned by the user.
    """
    id = db.Column(db.Integer, primary_key=True)  # Unique identifier for each user
    email = db.Column(db.String(100), unique=True, nullable=False)  # User's email
    password = db.Column(db.String(200), nullable=False)  # User's hashed password
    lists = db.relationship('List', backref='owner', lazy=True)  # User's todo lists

class List(db.Model):
    """
    Defines the List model, representing a todo list that can contain multiple tasks.
    
    Attributes:
        id (Integer): A unique identifier for the list, serves as the primary key.
        title (String): The title of the list. Cannot be null.
        user_id (Integer): A foreign key linking to the user who owns the list. Supports cascading on delete.
        tasks (relationship): A dynamic link to the Task model, representing all tasks within this list.
    """
    id = db.Column(db.Integer, primary_key=True)  # Unique identifier for each list
    title = db.Column(db.String(100), nullable=False)  # Title of the list
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)  # Owner of the list
    tasks = db.relationship('Task', backref='list', lazy=True, cascade="all, delete")  # Tasks in the list

    def __repr__(self):
        # Represents the List model instances as a string.
        return f'<List {self.title}>'

class Task(db.Model):
    """
    Defines the Task model, representing a task in a todo list.
    
    Attributes:
        id (Integer): A unique identifier for the task, serves as the primary key.
        title (String): The title of the task. Cannot be null.
        description (Text): A detailed description of the task. Can be null.
        complete (Boolean): Status of the task, whether it's complete or not. Defaults to False.
        list_id (Integer): A foreign key linking to the list this task belongs to.
        parent_id (Integer): A foreign key to itself, allowing tasks to have subtasks. Can be null.
        children (relationship): A dynamic link for accessing subtasks of this task.
    """
    id = db.Column(db.Integer, primary_key=True)  # Unique identifier for each task
    title = db.Column(db.String(100), nullable=False)  # Title of the task
    description = db.Column(db.Text, nullable=True)  # Detailed description of the task
    complete = db.Column(db.Boolean, default=False, nullable=False)  # Completion status
    list_id = db.Column(db.Integer, db.ForeignKey('list.id', ondelete='CASCADE'), nullable=False)  # The list this task belongs to
    parent_id = db.Column(db.Integer, db.ForeignKey('task.id', ondelete='CASCADE'), nullable=True)  # Parent task for subtasks
    children = db.relationship('Task', backref=db.backref('parent', remote_side=[id]), lazy=True, cascade="all, delete")  # Subtasks

    def to_dict(self, include_subtasks=True):
        """
        Converts the task, and optionally its subtasks, into a dictionary format for easier JSON serialization.

        Args:
            include_subtasks (bool): Flag to include subtasks in the output.

        Returns:
            dict: A dictionary representing the task's attributes, including subtasks if specified.
        """
        task_dict = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "complete": self.complete,
            "list_id": self.list_id,
            "parent_id": self.parent_id,
            "children": [child.to_dict() for child in self.children] if include_subtasks else []
        }
        return task_dict

    def __repr__(self):
        # Represents the Task model instances as a string.
        return f'<Task {self.title}>'
