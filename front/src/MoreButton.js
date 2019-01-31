import React, { Component } from 'react';
import { Menu, Button, Form, Grid, Modal, Header, Segment, Checkbox } from 'semantic-ui-react'
import axios from 'axios';
import {DateInput} from 'semantic-ui-calendar-react';

class MoreButton extends Component {

  constructor(props) {
    super(props);
    
    this.state={
      id: this.props.id,
      owner: '',
      name: '',
      category: '',
      place: '',
      address: '',
      start_date: '',
      end_date: '',
      presencial: false,
      modalOpen:false
    }
  }

  handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  }

  handleChange = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  handleCheck = (event, {name, checked}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: checked });
    }
  }
  
  getDetail = () =>{
    const {id} = this.state;
    const {user} = this.props;
    axios.post('/api/eventDetail',{
      id,user
    }).then(res => this.setState({...res.data}))
    .catch(err => console.log(err));
  }

  handleEdit = (id) => {
    console.log('clicked ', id)
  }

  handleSave = () =>{
    const {id,owner,name,category,place,address,start_date,end_date,presencial}=this.state;
    axios.post('/api/eventEdit',{
      id,owner,name,category,place,address,start_date,end_date,presencial
    }).then(res => {
      console.log(res.data);
      if(res.data.length!==0){
        console.log('editado');
        this.handleClose();
        this.props.refresh();
      }
      else{
        console.log('error');
      }
    }).catch(err => console.log(err));
  }

  handleOpen = () => {
    this.getDetail();
    this.setState({ modalOpen: true });
  }

  handleDelete = () => {
    const {id} = this.state;
    const {user} = this.props;
    axios.post('/api/eventDelete',{
      id,user
    }).then(res => {
      if (res.data.success===true){
        this.props.refresh();
      }
    })
  }

  handleClose = () => this.setState({ modalOpen: false })

  render() {
    return (
      <Segment>
        <Grid columns={2}>
          <Grid.Column>
            <h3>{this.props.name}</h3>
          </Grid.Column>
          <Grid.Column>
            <Modal trigger={
              <Button color='green'
                      onClick={this.handleOpen}
            >More</Button>}
              open={this.state.modalOpen}
              onClose={this.handleClose}
            >
              <Modal.Header>{this.props.name}</Modal.Header>
              <Modal.Content image>
                <Modal.Description>
                  <Header>{this.props.id}</Header>
                  <Form>
                    <Form.Input 
                      fluid
                      value={this.state.name}
                      onChange={this.handleInput}
                      name = 'name'
                      label='Name'
                    />
                    <Form.Select 
                      fluid
                      label='Category'
                      name='category'
                      value={this.state.category}
                      onChange={this.handleChange}
                      options={[
                        {key:'Seminario',text:'Seminario',value:'Seminario'},
                        {key:'Conferencia',text:'Conferencia',value:'Conferencia'},
                        {key:'Congreso',text:'Congreso',value:'Congreso'},
                        {key:'Curso',text:'Curso',value:'Curso'}
                    ]}
                    />
                    <Form.Input 
                      fluid
                      value={this.state.place}
                      onChange={this.handleInput}
                      name = 'place'
                      label='Place'
                    />
                    <Form.Input 
                      fluid
                      value={this.state.address}
                      onChange={this.handleInput}
                      name = 'address'
                      label='Address'
                    />
                    <DateInput
                      name="start_date"
                      label="Start Date"
                      value={this.state.start_date}
                      iconPosition="left"
                      dateFormat='YYYY-MM-DD'
                      onChange={this.handleChange}
                    />
                    <DateInput
                      name="end_date"
                      label="End Date"
                      value={this.state.end_date}
                      iconPosition="left"
                      dateFormat='YYYY-MM-DD'
                      onChange={this.handleChange}
                    />
                    <Checkbox
                      label='Presencial'
                      name='presencial'
                      checked={this.state.presencial}
                      onChange={this.handleCheck}
                    />
                  </Form>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button primary
                  content='Save'
                  icon='save'
                  onClick={this.handleSave}
                />
              </Modal.Actions>
            </Modal>
            {/* <Button
              color='green'
              onClick={() => this.handleEdit(this.props.id)}
            >More</Button> */}
            <Button
              content='Delete'
              color='red'
              icon='trash'
              onClick={this.handleDelete}
            />
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default MoreButton;