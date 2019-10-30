import React, { useReducer, createContext } from 'react';
import { initialTodos, filterReducer, todosReducer } from './reducer/index';

import Filter from './components/Filter';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

// 导出共享对象
export const AppContext = createContext();

function App() {
  const [todos, dispatchTodos] = useReducer(todosReducer, initialTodos);
  const [filterVal, dispatchFilter] = useReducer(filterReducer, 'ALL');

  return (
    <div style={{ margin: '20px 30px 0', maxWidth: 450 }}>
      <AppContext.Provider value={dispatchTodos}>
        <AddTodo />
        <Filter dispatch={dispatchFilter} />
        <TodoList filterVal={filterVal} todos={todos} />
      </AppContext.Provider>
    </div>
  );
}

export default App;
