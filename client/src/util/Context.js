import React from 'react';

export const {Provider, Consumer} = React.createContext(); 
 

// a helper higher order component to subscribe a component to a context
export default function withContext(Component) {
    return function ContextComponent(props) {
      return (
        <Consumer>
          {context => <Component {...props} context={context} />}
        </Consumer>
      );  
    }
  }
  