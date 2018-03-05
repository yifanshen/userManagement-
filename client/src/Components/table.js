import React from 'react';
import { Table, Icon, Divider, Popconfirm, Button, Row, Col, Avatar, message} from 'antd';
import dataForm from './dataForm';
import AdvancedForm from './dataForm';

const data = [];

export default class UserTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data,
            currentUser: this.props.appState.currentUser,
            isEdit: false,
            isAdd: false,
            editKey:'',
            editName: '',
            editPassword: '',
            editEmail: '',
            editPhone: '',
            editRole: ''
        };
    }

    handleDelete = (text,record) => {
        const urlpath = 'http://localhost:5000/users/'.concat(record.key);
        fetch(urlpath, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(info => {
            return info.json();
        })
        .then(info =>{
            message.success(info.description)
            this.getAllUsers();
        })
    }

    handleAddUser = ()=>{
        this.setState((prevState) => ({ isAdd: !prevState.isAdd }));
    }

    handleEditUser = (record) => {
        this.setState((prevState) => ({ 
            isAdd: false,
            isEdit: !prevState.isEdit,
            editKey:record.key,
            editName: record.name,
            editPassword:record.password,
            editEmail: record.email,
            editPhone: record.phone,
            editRole: record.role
        }));
    }

    getAllUsers = () => {
        fetch('http://localhost:5000/users')
        .then(response =>{
            return response.json();})
        .then(body =>{
            const userData = [];
            body.users.map(item => {
                const userItem = new Object();
                userItem.key = item.id;
                userItem.name = item.username;
                userItem.email = item.email;
                userItem.phone = item.phone;
                userItem.role = item.role;
                userItem.lastlogin = item.lastLogin;
                userItem.actions = item.actions;
                userData.push(userItem);                
            });
            this.setState(() => ({
                data: userData
            }));
            this.render();
        })
    }

    updateData = (currentUser,newActions) =>{
        const newData = [];
        this.state.data.map(item =>{
            if(item.key === currentUser){
                item.actions = newActions
            }
            newData.push(item);
        })
        this.setState({data:newData});
        this.render();
    }

    componentDidMount(){
        this.getAllUsers();
    }
 
    render(){
        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name.length)},
            { title: 'Email', dataIndex: 'email', key: 'email', sorter: (a, b) => a.email.localeCompare(b.email) },
            { title: 'Phone', dataIndex: 'phone', key: 'phone', sorter: (a, b) => a.phone.localeCompare(b.phone)},
            {
                title: 'Role', dataIndex: 'role', key: 'role', 
                filters: [{
                    text: 'Admin',
                    value: 'admin',
                }, {
                    text: 'User',
                    value: 'user',
                }],
                filterMultiple: false,
                onFilter: (value, record) => record.role.indexOf(value) === 0},
            { title: 'Last Login', dataIndex: 'lastlogin', key: 'lastlogin' },
            {
                title: 'Action', dataIndex: '', key: 'x', render: (text,record) => (
                    <span>
                        <a onClick={() => this.handleDelete(text,record)}>Delete</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.handleEditUser(record)}>Edit</a>
                    </span>)
            },
        ];

        return(
            <div>
                <Row type="flex" justify="start">
                    <Col span={16}><h2 style={{ marginTop: 20 }}>User management system</h2></Col>
                    <Col span={4}><Button icon="logout" style={{ marginTop: 20 }} onClick={() => { this.props.userLogout() }}>Log Out</Button></Col>

                </Row>
                <Row>
                    <Col span={20} offset={2}>
                        <Divider />
                        <Table
                            columns={columns}
                            expandedRowRender={record => <p style={{ margin: 0 }}>{record.actions.toString()}</p>}
                            dataSource={this.state.data}
                        />
                        <div>
                            <Button type="prim ary" onClick={this.handleAddUser}>Add</Button>
                        </div>
                        {this.state.isAdd &&
                            <div>
                                <Divider>Add User</Divider>
                                <AdvancedForm originState={this.state} getAllUsers={this.getAllUsers} updateData ={this.updateData}/>
                            </div>
                        }
                        {this.state.isEdit &&
                            <div>
                                <Divider>Edit User</Divider>
                            <AdvancedForm originState={this.state} getAllUsers={this.getAllUsers} updateData={this.updateData}/>
                            </div>}
                    </Col>
                </Row>
            </div>
        );
    }
};
    
    