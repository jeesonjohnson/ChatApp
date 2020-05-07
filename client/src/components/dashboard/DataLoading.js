import axios from 'axios';
import store from '../../store'

export function getCompanies(company_id){ 
    axios.get('/companies/')
    .then(res => {
        //Set Companies as first company on load, and load workspaces with first one set as selected
        if(company_id === ""){
            store.dispatch({ type: 'COMPANIES_LOADED', data: { companies: res.data.data, selectedCompany: res.data.data[0]._id, workspaces: [], selectedWorkspace: res.data.data[0].workspaces[0] } })
            getWorkspaces(res.data.data[0].workspaces[0])
        }
        //Set companies after loaded for the first time, load the first workspaces of the selected company
        else if (company_id !== ""){
            for(var i in store.getState().companies){
                if(store.getState().companies[i]._id === company_id){
                    store.dispatch({ type: 'COMPANIES_LOADED', data: { companies: res.data.data, selectedCompany: res.data.data[i]._id, workspaces: [], selectedWorkspace: res.data.data[i].workspaces[0] } })
                    getWorkspaces(res.data.data[i].workspaces[0])
                }
            }
        }
    })
}    

export function getWorkspaces(workspace_id){
    //Sets the workspaces after the drawer has been loaded in
    if (workspace_id !== "" && workspace_id === store.getState().selectedWorkspace){
        axios.get(`/companies/${store.getState().selectedCompany}`, {params: {id: store.getState().selectedCompany}})
        .then(res =>{
            let workspacesList = []

            for( var workspaceID in res.data.data.companyData.workspaces){
                axios.get(`/workspaces/${res.data.data.companyData.workspaces[workspaceID]}`, {params: {id: res.data.data.companyData.workspaces[workspaceID]}})
                .then(res => {                    
                    workspacesList.push(res.data.data.workspaceDetails)
                    store.dispatch({ type: 'WORKSPACES_LOADED', data: { workspaces: [].concat(workspacesList), selectedWorkspace: workspacesList[0]._id } })
                })
            }  
        })
    }
}