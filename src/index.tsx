import React from 'react';
import ReactDOM from 'react-dom';
import { initAnalytics } from './analytics';
import App from './App';
import './index.css';

initAnalytics();

ReactDOM.render(<App />, document.getElementById('root'));
