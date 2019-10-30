This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


# 开始

time：2019/10/28

安装`react`脚手架并初始化项目

```bash
cnpm install -g create-react-app
create-react-app electron-react-today
cd electron-react-today
npm start
```

此时项目已经运行在 ：`localhost:3000`

# 安装 electron

> electron 7.0.0 实在太坑爹了

使用`6.1.2`没有问题。

```bash
cnpm install --save-dev electron@6.1.2 --verbose
```

新建`main.js`

```js
// 引入electron并创建一个Browserwindow
const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow

function createWindow () {
//创建浏览器窗口,宽高自定义具体大小你开心就好
mainWindow = new BrowserWindow({width: 800, height: 600})

  /* 
   * 加载应用-----  electron-quick-start中默认的加载入口
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  */
  // 加载应用----适用于 react 项目
  mainWindow.loadURL('http://localhost:3000/')
  
 // 加载本地html
 // mainWindow.loadFile('./index.html')   
    
  // 打开开发者工具，默认不打开
  mainWindow.webContents.openDevTools()

  // 关闭window时触发下列事件.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', createWindow)

// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
   // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow()
  }
})
```

# 启动项目

在`package.json`文件中添加：

```json
{
    "main": "main.js",
    "scripts": {
      "electron-start": "electron ."
  },
}
```

然后执行：

```bash
npm run electron-start
```

看到如下页面，终于第一步完成了。

[![K4qUn1.md.png](https://user-gold-cdn.xitu.io/2019/10/30/16e1caae5c5595ff?w=680&h=516&f=png&s=302014)](https://imgchr.com/i/K4qUn1)


# React Hooks

* **useState声明状态变量**

  ```js
  const [ count , setCount ] = useState(0);
  ```

* **useEffect代替常用生命周期函数**

  ```js
  // 第一次渲染和每次更新都会被执行 并且是异步执行的
  useEffect(()=>{
    console.log(`useEffect=>You clicked ${count} times`)
  })
  
  // 当传空数组[]时，就是当组件将被销毁时才进行解绑，
  // 这也就实现了componentWillUnmount的生命周期函数
  useEffect(()=>{
      console.log('useEffect=>老弟你来了！Index页面')
      return ()=>{
          console.log('老弟，你走了!Index页面')
      }
  },[])
  ```

* **useContext 实现数据共享（父子组件传值）**

  可以通过这个`hook`传递`useReducer`产生的`dispatch`函数。

  也就是不直接传递数据，而是传递修改数据的方法，在根组件中通过`reducer`修改状态。
  
  
  
  **父组件**
  
  ```js
  import React, { useState, createContext } from 'react';
  import { Button } from '@material-ui/core';
  // 引入子组件
  import Num from './Num';
  
  // 创建上下文对象
  const CounterContext = createContext();
  
  export default function Counter() {
      
    const [count, setCount] = useState(0);
  
    return (
      <div>
        <p>点击了 {count} 次</p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCount(count + 1)}
        >
          点我加一
        </Button>
        <CounterContext.Provider value={count}>
          <Num />
        </CounterContext.Provider>
      </div>
  );
  }

  // 导出上下文对象
  export { CounterContext };
  ```
  
  
  
  **子组件**
  
  ```js
  import React, { useContext } from 'react';

  // 引入父组件的上下文
  import { CounterContext } from './Counter';
  
  export default function Count() {
    const count = useContext(CounterContext);
    return <h2>{count}</h2>
  }
  ```
  
* **useReducer 实现对复杂状态对象的管理**

  使用场景
  
  对某个state有很多种操作
  
  子组件需要修改上层组件的值，可以传递一个dispatch函数
  
  ```js
  const reducer = (state, action) => {
      switch(action.type) {
         case: "xx":
            ....
      }
  }
  
  const [state, dispatch] = useReducer(/*reducer函数*/ reducer, /*初始值*/ initialVal);

  dispatch({ type: 'xx', val: '' });
  ```
  

当然还有其他的Hooks，例如用于性能优化的`useMemo`就不说了。

# ToDoList 应用

有了以上内容就可以开发一个简单的`TODoList`应用了。

![K4qJ1J.png](https://user-gold-cdn.xitu.io/2019/10/30/16e1cab62274004f?w=510&h=386&f=png&s=12288)

使用到的内容：`material-ui` 和 上文中的React Hooks 。

至于如何安装组件库可以自行查看：https://material-ui.com/zh/getting-started/installation/

整体目录结构如下图：

![K4qa0x.png](https://user-gold-cdn.xitu.io/2019/10/30/16e1cabe431adb7e?w=372&h=517&f=png&s=33253)

**App.js 文件：** 承载状态数据和组件。

```js
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
```

**/reducer/index.js 文件: **   完成对数据的修改。

```js
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
```

**/components/AddTodo.js：** 输入框，添加任务。

```js 
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
```

**/components/Filter.js：** 筛选任务。

```js
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
```

**/components/TodoList.js：** 展示所有的任务。

```js
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
```

至此，一个简单的`ToDoList`就完成了。


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
