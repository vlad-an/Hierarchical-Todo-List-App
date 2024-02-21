import React from 'react';
import TodoItem from './TodoItem'; // You will create this component

function TodoList({ list }) {
  return (
    <div>
      <h2>{list.title}</h2>
      {list.items.map(item => <TodoItem key={item.id} item={item} />)}
    </div>
  );
}

export default TodoList;
