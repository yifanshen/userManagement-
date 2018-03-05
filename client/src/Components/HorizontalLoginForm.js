import { Form, Icon, Input, Button, message } from 'antd';
import React, { Component } from 'react';
const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    // update information when user logged in
    updateLogin = (user) => {
        const name = user.username;
        const password = user.password;
        const email = user.email;
        const phone = user.phone;
        const role = user.role;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        const lastLogin = today;

        // update user lastLogin time
        const urlpath = 'http://localhost:5000/users/'.concat(user.id);
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
                lastLogin: lastLogin
            })
        }).then(info => {
            return info.json()
        })
        
    }

    // check user login information and give response
    handleSubmit = (e) => {

        e.preventDefault();
        this.props.form.validateFields((err, values) => {

            if(err){
                alert(err)
            }else {
                const username = values.username;
                const password = values.password;
                const userArray = this.props.state.users;
                const userInfo = userArray.find((userItem)=>{
                    return userItem.name === username && userItem.password ===password;
                })
    
                // return information when different user logged
                if (typeof userInfo !== "undefined" && userInfo.role === 'admin'){
                    this.updateLogin(userInfo);
                    this.props.userLogin(userInfo.id, true);
                } else if (typeof userInfo === "undefined" && userArray.length !== 0){
                    message.error("No user matched, please retry");
                } else if (typeof userInfo === "undefined" && userArray.length === 0){
                    message.error("No data stored, please restart server");
                }else if (userInfo.role !== 'admin'){
                    message.error("You have no access to Admin dashboard");
                }
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <FormItem
                    validateStatus={userNameError ? 'error' : ''}
                    help={userNameError || ''}
                >
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                </FormItem>
                <FormItem
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={hasErrors(getFieldsError())}
                    >
                        Log in
          </Button>
                </FormItem>
            </Form>
        );
    }
}
export default HorizontalLoginForm;