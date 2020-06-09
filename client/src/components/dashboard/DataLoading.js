import axios from "axios";
import store from "../../store";
import { axiosGet } from "../../helpers/jwt";

/*
    COMPANIES
*/
export const getCompanies = async (company_id) => {
  // axios.get('/companies/')
  await axiosGet("/companies/").then((res) => {
    //Set Companies as first company on load, and load workspaces with first one set as selected
    if (company_id === "") {
      store.dispatch({
        type: "COMPANIES_LOADED",
        data: {
          companies: res.data.data,
          selectedCompany: res.data.data[0]._id,
          workspaces: [],
          selectedWorkspace: res.data.data[0].workspaces[0],
        },
      });
      getWorkspaces(res.data.data[0].workspaces[0]);
      getAllWorkspaceSpecificData(res.data.data[0].workspaces[0]);
    }
    //Set companies after loaded for the first time, load the first workspaces of the selected company
    else if (company_id !== "") {
      for (var i in store.getState().companies) {
        if (store.getState().companies[i]._id === company_id) {
          store.dispatch({
            type: "COMPANIES_LOADED",
            data: {
              companies: res.data.data,
              selectedCompany: res.data.data[i]._id,
              workspaces: [],
              selectedWorkspace: res.data.data[i].workspaces[0],
            },
          });
          getWorkspaces(res.data.data[i].workspaces[0]);
          getAllWorkspaceSpecificData(res.data.data[i].workspaces[0]);

        }
      }
    }
  });


}

/*
    WORKSPACES
*/
export const getWorkspaces = async (workspace_id) => {
  //Sets the workspaces after the drawer has been loaded in
  if (workspace_id !== "" && workspace_id === store.getState().selectedWorkspace) {
    store.dispatch({ type: 'SELECTED_PANEL', data: { selectedPanel: { id: "Calendar", name: "Calendar"} } }) //Set the selected page to Calendar on any changes
    
    store.dispatch({ type: 'CHART_CATEGOREY_CHANGED', data: { chartCategory: "" } }); //Reset selected chart category 
    
    getAllWorkspaceSpecificData(workspace_id) //Load the selected workspace data in 

    await axios.get(`/companies/${store.getState().selectedCompany}`, {params: { id: store.getState().selectedCompany },})
    .then(async(res) => {
      let workspacesList = [];

      for (var workspaceID in res.data.data.companyData.workspaces) {
        await axios.get(`/workspaces/${res.data.data.companyData.workspaces[workspaceID]}`,{params: { id: res.data.data.companyData.workspaces[workspaceID] } })
        .then((res) => {
          workspacesList.push(res.data.data.workspaceDetails);
          

          store.dispatch({
            type: "WORKSPACES_LOADED",
            data: {
              workspaces: [].concat(workspacesList),
              selectedWorkspace: workspacesList[0]._id,
            },
          });
          
          
        })
      }        
    });
  }
}

/*
    TASK COLLECTIONS
*/
function updateTaskCollections() {
  for (var i in store.getState().workspaces) {
    if (
      store.getState().workspaces[i]._id === store.getState().selectedWorkspace
    ) {
      return store.getState().workspaces[i].task_collections;
    }
  }
}

export const getTaskCollections = async () => {
  if (updateTaskCollections() !== undefined) {
    for (var i in updateTaskCollections()) {
      var taskCollections = [];

      axios.get(`/todocollection/`, {
          params: { collection_id: updateTaskCollections()[i] },
        })
        .then((res) => {
          var taskCollection = {
            _id: res.data.data.collectionDetails._id,
            title: res.data.data.collectionDetails.title,
            to_do_elements: res.data.data.collectionDetails.to_do_elements,
          };
          taskCollections.push(taskCollection);

          if (taskCollection._id === updateTaskCollections()[updateTaskCollections().length - 1]) {
            store.dispatch({
              type: "COLLECTIONS_LOADED",
              data: {
                taskCollectionIDs: updateTaskCollections(),
                workspaceTaskCollections: taskCollections,
              },
            });
          }
        })
        .catch(function (error) { 
          console.error(error);
        });
    }
  }
}


/*
    Get all associated chats in a given workspace, and store to the local array value
*/
export function getAllWorkspaceSpecificData(workspace_id) {
  axios.get(`/workspaces/${workspace_id}`).then((res) => {
    store.dispatch({
        type: "ALL_WORKSPACE_DATA", data: { workspaceData: res.data.data.workspaceDetails, } });

    store.dispatch({ type: 'SELECTED_PANEL', data: { selectedPanel: {id: "Calendar", name: "Calendar" } } })
    
    store.dispatch({ type: 'CHART_CATEGOREY_CHANGED', data: { chartCategory: "" } });

  });
}

export function checkIfAdmin(){
  for(var currentCompany in store.getState().companies){
    if (store.getState().companies[currentCompany] === store.getState().selectedCompany){
      for(var currentUser in store.getState().companies[currentCompany]){
        if(store.getState().companies[currentCompany].admins[currentUser] === store.getState().user._id){
          return("Admin")
        }
      }
    } 
    else {
      return("User")
    }
  }
}

//Takes a sentence and returns the first letter of each word as one word
export function getAcronym(name) {
  if(name !== undefined || name !== ""){
    var wordList = name.split(" ")
    var acronym = ""
    
    for(var wordIndex = 0; wordIndex < wordList.length; wordIndex++){
      wordList[wordIndex].charAt(0)
      
      acronym = acronym + wordList[wordIndex].charAt(0)
    }
  
    return acronym
  }
}