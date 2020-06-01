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