import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import reportWebVitals from './reportWebVitals';

import { RecoilRoot } from "recoil";
import recoilPersist from 'recoil-persist'

const { RecoilPersist, updateState } = recoilPersist([], {
  key: 'moomask-persist', // this key is using to store data in local storage
  storage: localStorage
})

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot initializeState={updateState}>
      <RecoilPersist />
      <App />
    </RecoilRoot>  
  </React.StrictMode>,
  document.getElementById('root')
);
  
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
