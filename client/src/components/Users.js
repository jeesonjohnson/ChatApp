import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserCard from './UserCard.js';
import Navbar from './layout/Navbar.js';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
          users: [],
          companies: []
        };
      }
    
      componentDidMount() {
        axios.get('/users').then(res => {
            console.log(res.data.data.users)
            this.setState({
                users: res.data.data.users
            })
        })
        .catch(err =>{
            console.log('Error from Showing all Users');
        })

        axios.get('/companies').then(res => {
            this.setState({companies: res.data})
        })
      };
    
      render() {
        const users = this.state.users;
        let userList;

        if(!users) {
          userList = "No users found";
        } else {
            
          userList = users.map((user, k) =>
            <UserCard user={user} key={k} />
            );
        }
    
        return (
          <div className="UserList">
            <Navbar/>
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <br />
                  <h2 className="display-4 text-center">All Users</h2>
                </div>
    
                <div className="col-md-11">
                  <Link to="/sign_up" className="btn btn-outline-warning float-right">
                    + Add User
                  </Link>
                  <br />
                  <br />
                  <hr />
                </div>
    
              </div>
    
              <div className="list">
                    {userList}
              </div>
            </div>
          </div>
        );
    };
}
export default Users;
