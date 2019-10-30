import React, { useContext } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, ListItemIcon } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { AppContext } from '../App'

export default function TodoList({ todos, filterVal }) {

  const dispatch = useContext(AppContext);

  const deleteTodo = (item) => {
    dispatch({ type: 'DELETE_TODO', id: item.id });
  }

  const checkTodo = (item) => {
    dispatch({ type: 'CHECK_TODO', id: item.id });
  }

  // 过滤 todos
  const filteredTodos = () => {
    if (filterVal === 'ALL') return todos;
    if (filterVal === 'COMPLETE') {
      return todos.filter(todo => todo.complete);
    }
    if (filterVal === 'INCOMPLETE') {
      return todos.filter(todo => !todo.complete);
    }
    return [];
  }

  return (
    <List component="nav" aria-label="secondary mailbox folders">
      {
        filteredTodos().map(item => (
          <ListItem key={item.id} button>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.complete}
                onChange={() => checkTodo(item)}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={item.label} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => deleteTodo(item)} edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))
      }
    </List>
  )
}