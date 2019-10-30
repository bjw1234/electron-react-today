import uuid from 'uuid';

export const initialTodos = [
  {
    id: uuid(),
    label: '学习React Hooks',
    complete: false,
  }, {
    id: uuid(),
    label: '吃饭睡觉',
    complete: true,
  }
];

export const filterReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_ALL':
      return 'ALL';
    case 'SHOW_COMPLETE':
      return 'COMPLETE';
    case 'SHOW_INCOMPLETE':
      return 'INCOMPLETE';
    default:
      throw Error();
  }
}

export const todosReducer = (state, action) => {
  switch (action.type) {
    case 'CHECK_TODO':
      return state.map(todo => {
        if (todo.id === action.id) {
          todo.complete = !todo.complete
        }
        return todo;
      });
    case 'DELETE_TODO':
      console.log(state, action.id)
      return state.filter(todo => todo.id !== action.id);
    case 'ADD_TODO':
      return state.concat(action.todo);
    default:
      throw Error();
  }
}