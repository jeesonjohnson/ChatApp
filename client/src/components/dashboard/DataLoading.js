import axios from "axios";
import store from "../../store";
import { axiosGet } from "../../helpers/jwt";

/*
    COMPANIES
*/
export function getCompanies(company_id) {
  // axios.get('/companies/')
  axiosGet("/companies/").then((res) => {
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
          getAllWorkspaceSpecificData(res.data.data[0].workspaces[0]);

        }
      }
    }
  });
}

/*
    WORKSPACES
*/
export function getWorkspaces(workspace_id) {
  //Sets the workspaces after the drawer has been loaded in
  if (
    workspace_id !== "" &&
    workspace_id === store.getState().selectedWorkspace
  ) {
    axios
      .get(`/companies/${store.getState().selectedCompany}`, {
        params: { id: store.getState().selectedCompany },
      })
      .then((res) => {
        let workspacesList = [];

        for (var workspaceID in res.data.data.companyData.workspaces) {
          axios
            .get(
              `/workspaces/${res.data.data.companyData.workspaces[workspaceID]}`,
              {
                params: {
                  id: res.data.data.companyData.workspaces[workspaceID],
                },
              }
            )
            .then((res) => {
              workspacesList.push(res.data.data.workspaceDetails);
              store.dispatch({
                type: "WORKSPACES_LOADED",
                data: {
                  workspaces: [].concat(workspacesList),
                  selectedWorkspace: workspacesList[0]._id,
                },
              });
              getTaskCollections();
            });
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

export function getTaskCollections() {
  if (updateTaskCollections() != undefined) {
    for (var i in updateTaskCollections()) {
      var taskCollections = [];

      axios
        .get(`/todocollection/`, {
          params: { collection_id: updateTaskCollections()[i] },
        })
        .then((res) => {
          var taskCollection = {
            _id: res.data.data.collectionDetails._id,
            title: res.data.data.collectionDetails.title,
            to_do_elements: res.data.data.collectionDetails.to_do_elements,
          };
          taskCollections.push(taskCollection);

          if (
            taskCollection._id ===
            updateTaskCollections()[updateTaskCollections().length - 1]
          ) {
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
    Get all associated chats in a given workspace
*/
export function getAllWorkspaceSpecificData(workspace_id) {
  axios.get(`/workspaces/${workspace_id}`).then((res) => {
      console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
      console.log(res);
    store.dispatch({
        type: "ALL_WORKSPACE_DATA",
        data: {
          workspaceData: res.data.data.workspaceDetails,
        },
      });


  });
}
