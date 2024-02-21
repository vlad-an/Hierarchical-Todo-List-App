import React from 'react';

function TodoItem({ item }) {
  return (
    <div>
      {item.content}
      {/* Add buttons or links for edit, delete, add sub-item, etc. */}
    </div>
  );
}

export default TodoItem;