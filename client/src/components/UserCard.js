import React from 'react';
import { Link } from 'react-router-dom';

const UserCard = (props) => {
    const user = props.user;
    const key = props.key;

    return(
        <div class="card horizontal teal">
            <div class="card-image valign-wrapper" style={{margin: 10}}>
                <img src="icon_twitter.png" alt="" />
            </div>
            <div class="card-stacked">
                <div class="card-content">
                    <Link to={`/users/${user._id}`}>
                        { user.name }
                    </Link>
                    <p>{user.email}</p>
                    <p>Companies {user.companies}</p>
                    <p>Owner {user.owner.toString()}</p>
                    <p>Avatar {user.avatar}</p>
                </div>
            </div>
        </div>
    )
};

export default UserCard;