import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      eventos:[]
    };
  }

  componentDidMount(){
    fetch('/api/eventos')
          .then((res) => {
            return res.json();
          })
          .then((json) => {
            console.log(json);
            this.setState({eventos:json});

          });
  }

  render() {
    return (
      <div className="App">
        {this.state.eventos.map(evento =>{
          return (<p>{evento.name}</p>)
        })}
      </div>
    );
  }
}

export default App;
