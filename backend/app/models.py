from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    lists = relationship('List', backref='user', lazy=True, cascade="all, delete-orphan")

class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    items = relationship('Item', backref='list', lazy=True, cascade="all, delete-orphan")

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=True)
    children = relationship('Item', backref=db.backref('parent', remote_side=[id]), lazy=True, cascade="all, delete-orphan")
