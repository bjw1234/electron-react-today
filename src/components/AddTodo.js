import React, { useState, useContext } from 'react';
import { Input, Button } from '@material-ui/core';
import uuid from 'uuid';
import { AppContext } from '../App';

export default function AddTodo() {

  const dispatch = useContext(AppContext);

  const handleSubmit = () => {
    if (!task) return;
    setTask('');
    dispatch({ type: 'ADD_TODO', todo: { id: uuid(), label: task, complete: false } });
  }

  const [task, setTask] = useState('');

  return (
    <div style={{ display: 'flex' }}>
      <Input
        value={task}
        style={{ flex: 1 }}
        onChange={(e) => setTask(e.target.value)}
        inputProps={{ 'aria-label': 'description' }}
      />
      <Button color="primary" onClick={handleSubmit}>添加</Button>
    </div>
  )
}