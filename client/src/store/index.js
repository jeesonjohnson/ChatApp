import { createStore } from 'redux';
import { STATES } from 'mongoose';

const initalState = {
    selectedCompany: "",
    selectedWorkspace: "",
    companyNames: [],
    workspaceNames: []
}

const reducer = (state = initalState, action) => {
    switch (action.type) {
        case "COMPANY_NAMES_LOADED":
            return Object.assign({}, state, {
                companyNames: action.data.companies
            })
        case "COMPANY_SELECTED":
            return Object.assign({}, state, {
                selectedCompany: action.data.selectedCompany
            })
        case "WORKSPACE_NAMES_LOADED":
            return Object.assign({}, state, {
                workspaceNames: action.data.workspaces
            })
        case "WORKSPACE_SELECTED":
            return Object.assign({}, state, {
                selectedWorkspace: action.data.selectedWorkspace
            })
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;