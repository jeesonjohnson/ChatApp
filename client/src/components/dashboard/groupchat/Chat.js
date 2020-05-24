
// Is it possible for you to add the code so that when you click on say chat 1, the assocaited data is prsented to the dashboard?

// or like if you can tell me where it is?

// okay kl, yeh if i can get say the data of a given chat passed in that should be sufficent for me to make the chat work

// So rn theres a script under the chat folder thats empty is it possible if that is what is preseneted onto the screen with the assocaited data for that chat?

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../../store';
import axios from 'axios';

function Chat ( props ) {    
    return(
        <div>
            {console.log(props)}
            <div>Chat ID: {props._id}</div>
            <div>Chat Title: {props.title}</div>
            <div>Workspace ID: {props.workspaceID}</div>
            {props.users.length > 0 ?
            props.users.map((user) =>(
                <div>{user}</div>
            ))
            :
            null
            }
        </div>)
}

    
const mapStateToProps = state => {
    return {selectedCompany: state.selectedCompany, companies: state.companies, workspaces: state.workspaces, selectedWorkspace: state.selectedWorkspace, taskCollectionIDs: state.taskCollectionIDs, workspaceTaskCollections: state.workspaceTaskCollections}
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(Chat)