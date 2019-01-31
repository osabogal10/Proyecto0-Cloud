import React, { Component } from 'react';
import { Menu, Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import axios from 'axios';
import './App.css';
import MoreButton from './MoreButton';
import { timingSafeEqual } from 'crypto';
import NewEvent from './NewEvent';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventos: [],
      user: null,
      modalOpen:false
    };
  }

  handleLogin = () => {
    const { email, password } = this.state;
    axios.post('/api/signin', {
      email, password
    })
      .then(res => {
        console.log(res.data);
        if(res.data.success){
          this.setState({ user: email });
          this.getEventos();
        }
        else{
          this.setState({ error: res.data.message });
        }
      }).catch(err => console.log(err));
      this.getEventos();
  };

  handleSignUp = () => {
    const { email, password } = this.state;
    axios.post('/api/signup', {
      email, password
    })
      .then(res => {
        console.log(res.data);
        res.data.success
          ? this.setState({ user: email })
          : this.setState({ error: res.data.message });
      }).catch(err => console.log(err))
      this.getEventos();
  };

  handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  }

  getEventos = () => {
    if(this.state.user){
      axios.post('/api/eventsUser',{
        user:this.state.user
      }).then(res => {
        this.setState({eventos:res.data})
      }).catch(err => console.log(err));
    }
  }

  handleLogout = () => {
    this.setState({user:'',eventos:[]});
  }

  handleOpen = () => {
    this.setState({ modalOpen: true });
  }

  handleClose = () => this.setState({ modalOpen: false })

  render() {
    const { activeItem } = this.state
    if (!this.state.user) {
      return (
        <div className='login-form'>
          {/*
      Heads up! The styles below are necessary for the correct render of this example.
      You can do same with CSS, the main idea is that all the elements up to the `Grid`
      below must have a height of 100%.
    */}
          <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}</style>
          <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as='h2' color='teal' textAlign='center'>
                Log-in to your account
        </Header>
              <Form size='large'>
                <Segment stacked>
                  <Form.Input fluid icon='user'
                    iconPosition='left'
                    placeholder='E-mail address'
                    name='email'
                    onChange={this.handleInput}
                  />
                  <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    name='password'
                    onChange={this.handleInput}
                  />
                  <Grid.Row>
                    <Button color='teal'
                      size='large'
                      onClick={this.handleLogin}>
                      Login
            </Button>
                    <Button color='green' size='large'
                      onClick={this.handleSignUp}
                    >
                      Sign-Up
            </Button>
                  </Grid.Row>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      );
    }

    return (
      <div className="App">
      <Menu>
        <Menu.Item header>
          CloudEvents
        </Menu.Item>
        <Menu.Item 
        name='user' 
        active={false}
        content={this.state.user}
        >
        </Menu.Item>
        <Menu.Item 
        position='right'
        name='logout'  
        onClick={this.handleLogout}>
          Logout
        </Menu.Item>
      </Menu>
        <Button
        onClick={this.getEventos}
        >
          Refresh
        </Button>
        <Button
        primary
        onClick={this.handleOpen}
        >
          New Event
        </Button>
        <NewEvent
          user={this.state.user}
          refresh={this.getEventos}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          ></NewEvent>
        <Grid container textAlign='center' columns={1}>
          <Grid.Column>
            {this.state.eventos.map(evento => {
              return (<MoreButton
                key={evento.id}
                id={evento.id}
                name={evento.name}
                user={this.state.user}
                refresh={this.getEventos}
              ></MoreButton>)
            })}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;
