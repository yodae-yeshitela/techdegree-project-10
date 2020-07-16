import React from 'react';

export const {Provider, Consumer} = React.createContext(); 

export default function withContext(Component) {
    return function ContextComponent(props) {
      return (
        <Consumer>
          {context => <Component {...props} context={context} />}
        </Consumer>
      );  
    }
  }
  