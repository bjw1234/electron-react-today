import React from 'react';
import { Button } from '@material-ui/core';

export default function Filter({ dispatch }) {

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
      <Button color="primary" onClick={() => dispatch({ type: 'SHOW_ALL' })}>全部</Button>
      <Button color="primary" onClick={() => dispatch({ type: 'SHOW_COMPLETE' })}>已完成</Button>
      <Button color="primary" onClick={() => dispatch({ type: 'SHOW_INCOMPLETE' })}>未完成</Button>
    </div>
  )
}