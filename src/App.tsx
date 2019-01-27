import React, { Component } from 'react';

import { getCocktails } from './services/cocktails';

class App extends Component {
  state: any = {
    cocktails: undefined
  };
  componentDidMount() {
    getCocktails()
      .then(response => console.log(response))
      .catch(e => e);
  }
  render() {
    return <div className="App">Hello world</div>;
  }
}

export default App;
