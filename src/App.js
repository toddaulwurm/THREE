import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Main from './Components/Main';
import Detail from './Components/Detail';
import Update from './Components/Update';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1><span className="span">Three Principles</span></h1>
        <a href="/Games" className="home">Home</a>
      </header>
          <BrowserRouter>
            <Switch>
                <Route exact path="/Games/">
                  <Main />
                </Route>
                <Route path="/Games/:id/edit">
                  <Update />
                </Route>
                <Route path="/Games/:id">
                  <Detail />
                </Route>
              </Switch>
          </BrowserRouter>
    </div>
  );
}

export default App;