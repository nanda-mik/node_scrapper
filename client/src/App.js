import React,{ Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import Table from './component/table/table';
import Main from './component/main/main';


class App extends Component{
  render(){
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/">
              <Main />
            </Route>
            <Route exact path="/table">
              <Table />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
