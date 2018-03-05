import React, { Component } from 'react';
import logo from './logo.svg';
import { Form, Icon, Input, Button, message, Row, Col, Alert  } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import UserTable from './Components/table';
import HorizontalLoginForm from './Components/HorizontalLoginForm';



const WrappedHorizontalLoginForm = Form.create()(HorizontalLoginForm);

class App extends Component {
  state = {
    users: '',
    currentUser: '',
    isAdmin:false,
    isLogIn:false
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({
        users: res.users
      }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('http://localhost:5000/users');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  userLogin = (currentUser, isAdmin)=>{
    this.setState({
      currentUser: currentUser,
      isAdmin:isAdmin,
      isLogIn: true
    });
    message.success('You have successfull logged in!')
  }

  userLogout = () => {
    this.setState({
      currentUser: '',
      isAdmin: false,
      isLogIn: false
    });
    message.success('You have successfull Logged out!')
  }

  render() {
    return (
      <div className="App">
        {!this.state.isLogIn && 
          <div>
            <Row >
              <Col span={20} offset={2}>
                <WrappedHorizontalLoginForm state={this.state} userLogin={this.userLogin} style={{ marginTop: 20 }} />
              </Col>
            </Row>
            <Row >
              <Col span={12} offset={6}>
              <Alert
                message="Usage Notes"
                description="Login with admin account: UserName: Admin, Password: Admin "
                type="info"
              />
              </Col>
            </Row>
          </div>
          }
        {this.state.isLogIn && <UserTable appState={this.state} userLogout={this.userLogout}/>}

      </div>
    );
  }
}

export default App;
