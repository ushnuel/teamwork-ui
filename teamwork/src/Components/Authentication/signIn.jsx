import React from 'react';
import SignInForm from '../Helpers/Forms/signIn';
import Header from '../Helpers/Header/header';
import Store from '../../Store';
import HandleResponse from '../Helpers/Utils';

const signIn = new Store();

class SignIn extends Store {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorResponse: '',
      successResponse: '',
      success: false,
    };
    this._isMounted = false;
    this.url = 'http://localhost:5000/api/v1/auth/signin';
  }
  componentDidMount() {
    this._isMounted = true;
    this.timeOutHandler();
  }
  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  InputFieldHandler = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const submitBtn = document.getElementById('button');
    const smallTags = document.getElementsByTagName('small');
    signIn.InputHandler([email, password], submitBtn, smallTags);
  };
  onsubmitHandler = (event) => {
    const properties = this.removeProps(this.state);
    const data = { ...properties };
    signIn
      .postHandler(data, this.url, event)
      .then((response) => this.check(response))
      .then((data) => {
        this.setState({ success: false, successResponse: { ...data } });
        sessionStorage.setItem('token', this.state.successResponse.data.token);
        this.props.history.push('/home');
        return;
      })
      .catch((error) => {
        error.json().then((body) => {
          this.setState({ success: false, errorResponse: { ...body } });
        });
      });
    this.setState({ success: true });
  };
  render() {
    const { errorResponse } = this.state;
    const response = HandleResponse(errorResponse);
    const submitText = !this.state.success ? 'Sign In' : 'Please wait ...';
    return (
      <>
        {response ? <div id='tm-response'>{response}</div> : null}
        <Header name='Sign In' />
        <SignInForm
          submitText={submitText}
          email={this.state.email}
          password={this.state.password}
          onSubmit={this.onsubmitHandler}
          onChange={this.onChangeHandler}
          InputFieldHandler={this.InputFieldHandler}
        />
      </>
    );
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
}

export default SignIn;
