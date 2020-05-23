import { createStore } from 'redux';
import { STATES } from 'mongoose';

const initalState = {
    user: {
        name: ""
    },
    selectedPanel: "Calendar",
    selectedCompany: "",
    selectedWorkspace: "",
    companies: [],
    workspaces: [],
<<<<<<< HEAD
=======

    taskCollectionIDs: [],
    workspaceTaskCollections: [],

>>>>>>> cae9ded0459f3866d9ed1decdab568e0a3694b4c
    groupChats: []
}

const reducer = (state = initalState, action) => {
    switch (action.type) {
        case "USER_LOGGED_IN":
            return Object.assign({}, state, {
                user: action.data.user
            })
        case "COMPANIES_LOADED":
            return Object.assign({}, state, {
                companies: action.data.companies,
                selectedCompany: action.data.selectedCompany,
                workspaces: action.data.workspaces,
                selectedWorkspace: action.data.selectedWorkspace
            })
        case "WORKSPACES_LOADED":
            return Object.assign({}, state, {
                workspaces: action.data.workspaces,
                selectedWorkspace: action.data.selectedWorkspace
            })
        case "WORKSPACE_SELECTED":
            return Object.assign({}, state,{
                selectedWorkspace: action.data.selectedWorkspace
            })
        case "SELECTED_PANEL":
            return Object.assign({}, state, {
                selectedPanel: action.data.selectedPanel
            })
        case "COLLECTIONS_LOADED":
            return Object.assign({}, state,{
                taskCollectionIDs: action.data.taskCollectionIDs,
                workspaceTaskCollections: action.data.workspaceTaskCollections
            })
        case "COLLECTION_ADDED":
            return Object.assign({}, state,{
                taskCollectionIDs: [state.taskCollectionIDs, action.data.collectionID]

            })
        case "COLLECTION_DELETED":
            return Object.assign({}, state,{
                taskCollectionIDs: action.data.taskCollectionIDs,
                workspaceTaskCollections: action.data.workspaceTaskCollections
            })        
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;