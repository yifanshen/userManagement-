import React from 'react';
import { Form, Row, Col, Input, Button, Icon, message, Select } from 'antd';
import './dataForm.css';
const Option = Select.Option;
const FormItem = Form.Item;

// the form to add/edit user 
class AdvancedForm extends React.Component {
    state = {
        userRole:'user',
        data: this.props.originState.data,
        currentUser: this.props.originState.currentUser,
        editKey: this.props.originState.editKey,
        editName: this.props.originState.editName,
        editPassword: this.props.originState.editPassword,
        editEmail: this.props.originState.editEmail,
        editPhone: this.props.originState.editPhone,
        editRole: this.props.originState.editRole,
        addKey: '',
        addName: '',
        addPassword: '',
        addEmail: '',
        addPhone: '',
        addRole: '',
    };

    // update the action of current user 
    updateActions = (currentUser, actionName) =>{
        const newData = [];
        var newActions = [];
    
        this.state.data.map(item =>{
            if(item.key === currentUser){
                item.actions.unshift(actionName);
                newActions = item.actions;
            }
            newData.push(item);
        })
        this.props.updateData(currentUser,newActions);
    }

    // handle the add user operation 
    handleSubmitAdd = (e) =>{
        e.preventDefault();
 
        const name = this.state.addName;
        const password = this.state.addPassword;
        const email = this.state.addEmail;
        const phone = this.state.addPhone;
        const role = this.state.userRole;

        fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: name,
                password: password,
                email: email,
                phone: phone,
                role: role
            })
        }).then(info =>{
            return info.json()
        }).then(data => {
            message.success(data.description);
            this.handleReset();
            this.updateActions(this.state.currentUser, 'adduser');
            this.props.getAllUsers();
        }
        )
    }

    // handle the edit user operation 
    handleSubmitUpdate= (e) => {
        e.preventDefault();
        const name = this.state.editName;
        const password = this.state.editPassword;
        const email = this.state.editEmail;
        const phone = this.state.editPhone;
        const role = this.state.userRole;
        const urlpath = 'http://localhost:5000/users/'.concat(this.props.originState.editKey);
        fetch(urlpath, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: name,
                password: password,
                email: email,
                phone: phone,
                role: role,
            })
        }).then(info => {
            return info.json()
        }).then(data => {
            message.success(data.description);
            this.handleReset();
            this.updateActions(this.state.currentUser, 'updateuser');            
            this.props.getAllUsers();
            }
        )
    }

    // update state when change role
    handleRoleChange = (role) => {
        this.setState({userRole:role});
    }

    // clean the form 
    handleReset = () => {
        this.props.form.resetFields();
    }

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }

    render() {
       
        const children = [];
        const origin = this.props.originState;
        const { getFieldProps } = this.props.form

        children.push(
            <Col span={8} key={1} style={'bolck'}>
                <FormItem label={'Name'}>
                    <Input 
                        {...getFieldProps('Name') } 
                        placeholder={origin.isAdd? "name":''} 
                        value={origin.isEdit ? this.state.editName : this.state.addName}
                        onChange={e => origin.isEdit ? this.setState({ editName: e.target.value }) : this.setState({ addName: e.target.value })}
                    />
                </FormItem>
            </Col>
        );

        children.push(
            <Col span={8} key={2} style={'bolck'}>
                <FormItem label={'Password'}>
                    <Input 
                        {...getFieldProps('Password') } 
                        placeholder={origin.isAdd ? "password":''} 
                        value={origin.isEdit ? this.state.editPassword : this.state.addPassword} 
                        onChange={e => origin.isEdit ? this.setState({ editPassword: e.target.value }) : this.setState({ addPassword: e.target.value })}
                    />
                </FormItem>
            </Col>
        );

        children.push(
            <Col span={8} key={3} style={'bolck'}>
                <FormItem label={'Email'}>
                        <Input 
                            {...getFieldProps('Email') } 
                            placeholder={origin.isAdd ? "email":''} 
                            value={origin.isEdit ? this.state.editEmail : this.state.addEmail}
                        onChange={e => origin.isEdit ? this.setState({ editEmail: e.target.value }) : this.setState({ addEmail: e.target.value })}
                        />
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={8} key={4} style={'bolck'}>
                <FormItem label={'Phone'}>
                    <Input 
                        {...getFieldProps('Phone') } 
                        placeholder={ origin.isAdd ? "phone":''} 
                        value={origin.isEdit ? this.state.editPhone :this.state.addPhone}
                        onChange={e => origin.isEdit ? this.setState({ editPhone: e.target.value }) : this.setState({ addPhone: e.target.value })}
                    />
                </FormItem>
            </Col>
        );

        children.push(
            <Col span={8} key={5} style={'bolck'}>
            <span>Role: </span>
                <Select
                    value={!origin.isAdd && origin.editRole && origin.isEdit ? this.state.userRole : this.state.userRole}
                    style={{ width: '32%' }}
                    onChange={this.handleRoleChange}
                >
                    <Option value="user">user</Option>
                    <Option value="admin">admin</Option>
                </Select>
            </Col>
        );

        return (
            <div>
                
                <Form
                    className="ant-advanced-search-form"
                    onSubmit={origin.isAdd?this.handleSubmitAdd:this.handleSubmitUpdate}
                >
                    <Row gutter={24}>{children}</Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit" >submit</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            
        );
    }
}

const AdvancedFormInstance = Form.create()(AdvancedForm);
export default AdvancedFormInstance;
