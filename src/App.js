import React, { useEffect, useState } from 'react';
import {
  Switch,
  Route,
  BrowserRouter as Router, Link,
} from 'react-router-dom'
import { Button } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import GamesList from "./components/GamesList/GamesList";
import NewGame from './components/NewGame/NewGame';
import NewDlc from './components/NewDlc/NewDlc';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="menu">
          <Link to="/newGame"><Button>New Game</Button></Link>
          <Link to="/newDlc"><Button>New DLC</Button></Link>
        </div>
        <div className="main">
          <Switch>
            <Route path="/newGame">
              <NewGame />
            </Route>
            <Route path="/newDlc">
              <NewDlc />
            </Route>
            <Route path="/">
              <GamesList />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
