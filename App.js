import 'react-native-gesture-handler';
import * as React from 'react';
import Router from './src/router/router';
import Listeners from './src/views/Listeners';

export default function App() {
  return (
    <>
      <Listeners />
      <Router />
    </>
  );
}
