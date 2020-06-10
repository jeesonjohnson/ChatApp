import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import store from '../../../store';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import AnnouncementIcon from "@material-ui/icons/Announcement";
import HighlightOff from '@material-ui/icons/HighlightOff';
import Sync from '@material-ui/icons/Sync';

import { getTaskCollections } from '../DataLoading.js';

import Timeline from 'react-calendar-timeline/lib';
// make sure you include the timeline stylesheet or the timeline will not be styled
import './calendar.css';
// import 'react-calendar-timeline/lib/Timeline.css'
// import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment';
// import "react-big-calendar/lib/css/react-big-calendar.css";

import GSTC from "react-gantt-schedule-timeline-calendar";

moment.locale("en-GB");
// const localizer = momentLocalizer(moment);



const groups = [{id:1, title:"tes"}, {id:2,title:"test2"}]

const items = [
  {
    id: 1,
    group: 1,
    title: 'item 1',
    start_time: moment(),
    end_time: moment().add(1, 'hour')
  },
  {
    id: 2,
    group: 2,
    title: 'item 2',
    start_time: moment().add(-0.5, 'hour'),
    end_time: moment().add(0.5, 'hour')
  },
  {
    id: 3,
    group: 1,
    title: 'item 3',
    start_time: moment().add(2, 'hour'),
    end_time: moment().add(3, 'hour')
  }
]
 
const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));


  // if (updateTaskCollections() != undefined) {
  //   for (var i in updateTaskCollections()) {
  //     var taskCollections = [];

  //     axios.get(`/todocollection/`, {
  //         params: { collection_id: updateTaskCollections()[i] },
  //       })
  //       .then((res) => {
  //         var taskCollection = {
  //           _id: res.data.data.collectionDetails._id,
  //           title: res.data.data.collectionDetails.title,
  //           to_do_elements: res.data.data.collectionDetails.to_do_elements,
  //         };
  //         taskCollections.push(taskCollection);

  //         if (
  //           taskCollection._id ===
  //           updateTaskCollections()[updateTaskCollections().length - 1]
  //         ) {
  //           store.dispatch({
  //             type: "COLLECTIONS_LOADED",
  //             data: {
  //               taskCollectionIDs: updateTaskCollections(),
  //               workspaceTaskCollections: taskCollections,
  //             },
  //           });
  //         }
  //       })
  //       .catch(function (error) { 
  //         console.error(error);
  //       });
  //   }


function CalendarPage (  ) {   
 
  const classes = useStyles();
  const [collections, setCollections] = React.useState([]);
  const [tasks, setTasks] = React.useState([]);

  useEffect(() => {
    if(store.getState().selectedWorkspace !== "" && store.getState().selectedPanel === "Calendar" && store.getState().allSelectedWorkspaceData !== undefined){

      if(store.getState().allSelectedWorkspaceData.task_collections !== undefined && store.getState().allSelectedWorkspaceData.task_collections.length > 0 ){
        let collectionList = []
        let taskList = []
        
        for(var collectionIndex in store.getState().allSelectedWorkspaceData.task_collections){

          axios.get('/todocollection', {
            params: { 
              collection_id:  store.getState().allSelectedWorkspaceData.task_collections[collectionIndex]
            }
          })
          .then(res => {
            if(res.data.data.collectionDetails !== null) {
              collectionList.push({
                id: res.data.data.collectionDetails._id,
                title: res.data.data.collectionDetails.title
              })
              let collection_id = res.data.data.collectionDetails._id

              for(var todoIndex in res.data.data.collectionDetails.to_do_elements){
                axios.get('/todo/', {params: {todo_id: res.data.data.collectionDetails.to_do_elements[todoIndex]}})
                .then(res => {
                  taskList.push(  {
                    id: res.data.data.todoDetails._id,
                    group: collection_id,
                    title: res.data.data.todoDetails.title,
                    start_time: new Date (res.data.data.todoDetails.creation_date),
                    end_time: new Date (res.data.data.todoDetails.due_date)
                  })
                })
                
              }
            }
          })

        }

        setCollections(collectionList)
        setTasks(taskList)

        return () => {
          subs.forEach(unsub => unsub());
        };
      }

    }


  }, [store.getState().allSelectedWorkspaceData ,store.getState().selectedWorkspace, store.getState().selectedPanel]);

  const config = {
    height: 300,
    list: {
      rows: {
        "1": {
          id: "1",
          label: "Row 1"
        },
        "2": {
          id: "2",
          label: "Row 2"
        },
        "3": {
          id: "3",
          label: "Row 3"
        },
        "4": {
          id: "4",
          label: "Row 4"
        }
      },
      columns: {
        data: {
          id: {
            id: "id",
            data: "id",
            width: 50,
            header: {
              content: "ID"
            }
          },
          label: {
            id: "label",
            data: "label",
            width: 200,
            header: {
              content: "Label"
            }
          }
        }
      }
    },
    chart: {
      items: {
        "1": {
          id: "1",
          rowId: "1",
          label: "Item 1",
          time: {
            start: new Date().getTime(),
            end: new Date().getTime() + 24 * 60 * 60 * 1000
          }
        },
        "2": {
          id: "2",
          rowId: "2",
          label: "Item 2",
          time: {
            start: new Date().getTime() + 4 * 24 * 60 * 60 * 1000,
            end: new Date().getTime() + 5 * 24 * 60 * 60 * 1000
          }
        },
        "3": {
          id: "3",
          rowId: "2",
          label: "Item 3",
          time: {
            start: new Date().getTime() + 6 * 24 * 60 * 60 * 1000,
            end: new Date().getTime() + 7 * 24 * 60 * 60 * 1000
          }
        },
        "4": {
          id: "4",
          rowId: "3",
          label: "Item 4",
          time: {
            start: new Date().getTime() + 10 * 24 * 60 * 60 * 1000,
            end: new Date().getTime() + 12 * 24 * 60 * 60 * 1000
          }
        },
        "5": {
          id: "5",
          rowId: "4",
          label: "Item 5",
          time: {
            start: new Date().getTime() + 12 * 24 * 60 * 60 * 1000,
            end: new Date().getTime() + 14 * 24 * 60 * 60 * 1000
          }
        }
      }
    }
  };

  let subs = [];

  function onState(state) {
    state.update("config.chart.items.1", item1 => {
      item1.label = "Gantt schedule timeline calendar";
      item1.time.end = item1.time.end + 2 * 24 * 60 * 60 * 1000;
      return item1;
    });
    subs.push(
      state.subscribe("config.chart.items", items => {
        console.log("items changed", items);
      })
    );
    subs.push(
      state.subscribe("config.list.rows", rows => {
        console.log("rows changed", rows);
      })
    );
  }



    return(
        <div style={{marginRight:20}}>


          { collections !==  [] && tasks !== [] ?
            <div>
            {/* <GSTC config={config} onState={onState} /> */}
              <Timeline id="timeline_id"
                groups={collections}
                items={tasks}
                defaultTimeStart={ moment().days(1)  }
                defaultTimeEnd={ moment().days(moment().daysInMonth())  }
                traditionalZoom={true}
              />
              
            </div>
            :
            null
          }
        </div>
    )

}

const mapStateToProps = state => {
    return {
      selectedCompany: state.selectedCompany, 
      companies: state.companies, 
      workspaces: state.workspaces, 
      selectedWorkspace: state.selectedWorkspace, 
      taskCollectionIDs: state.taskCollectionIDs, 
      workspaceTaskCollections: state.workspaceTaskCollections}
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(CalendarPage)










// import React, { useState, useEffect } from 'react';

// import { connect } from 'react-redux';
// import store from '../../../store';
// import axios from 'axios';

// import { makeStyles } from '@material-ui/core/styles';
// import FormControl from '@material-ui/core/FormControl';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import Grid from '@material-ui/core/Grid';
// import MenuItem from '@material-ui/core/MenuItem';
// import Paper from '@material-ui/core/Paper';
// import Select from '@material-ui/core/Select';
// import Typography from '@material-ui/core/Typography';
// import IconButton from '@material-ui/core/IconButton';

// import AnnouncementIcon from "@material-ui/icons/Announcement";
// import HighlightOff from '@material-ui/icons/HighlightOff';
// import Sync from '@material-ui/icons/Sync';

// import { getTaskCollections } from '../DataLoading.js';

// import Timeline from 'react-calendar-timeline/lib';
// // make sure you include the timeline stylesheet or the timeline will not be styled
// import './calendar.css';
// // import 'react-calendar-timeline/lib/Timeline.css'
// // import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from 'moment';
// // import "react-big-calendar/lib/css/react-big-calendar.css";

// import GSTC from "react-gantt-schedule-timeline-calendar";

// moment.locale("en-GB");
// // const localizer = momentLocalizer(moment);



// const groups = [{id:1, title:"tes"}, {id:2,title:"test2"}]

// const items = [
//   {
//     id: 1,
//     group: 1,
//     title: 'item 1',
//     start_time: moment(),
//     end_time: moment().add(1, 'hour')
//   },
//   {
//     id: 2,
//     group: 2,
//     title: 'item 2',
//     start_time: moment().add(-0.5, 'hour'),
//     end_time: moment().add(0.5, 'hour')
//   },
//   {
//     id: 3,
//     group: 1,
//     title: 'item 3',
//     start_time: moment().add(2, 'hour'),
//     end_time: moment().add(3, 'hour')
//   }
// ]
 
// const useStyles = makeStyles((theme) => ({
//     formControl: {
//       margin: theme.spacing(1),
//       minWidth: 120,
//     },
//     selectEmpty: {
//       marginTop: theme.spacing(2),
//     },
//   }));


//   // if (updateTaskCollections() != undefined) {
//   //   for (var i in updateTaskCollections()) {
//   //     var taskCollections = [];

//   //     axios.get(`/todocollection/`, {
//   //         params: { collection_id: updateTaskCollections()[i] },
//   //       })
//   //       .then((res) => {
//   //         var taskCollection = {
//   //           _id: res.data.data.collectionDetails._id,
//   //           title: res.data.data.collectionDetails.title,
//   //           to_do_elements: res.data.data.collectionDetails.to_do_elements,
//   //         };
//   //         taskCollections.push(taskCollection);

//   //         if (
//   //           taskCollection._id ===
//   //           updateTaskCollections()[updateTaskCollections().length - 1]
//   //         ) {
//   //           store.dispatch({
//   //             type: "COLLECTIONS_LOADED",
//   //             data: {
//   //               taskCollectionIDs: updateTaskCollections(),
//   //               workspaceTaskCollections: taskCollections,
//   //             },
//   //           });
//   //         }
//   //       })
//   //       .catch(function (error) { 
//   //         console.error(error);
//   //       });
//   //   }


// function CalendarPage (  ) {   
 
//   const classes = useStyles();
//   const [collections, setCollections] = React.useState([]);
//   const [tasks, setTasks] = React.useState([]);

//   useEffect(() => {
//     if(store.getState().selectedWorkspace !== "" && store.getState().selectedPanel === "Calendar" && store.getState().allSelectedWorkspaceData !== undefined){

//       if(store.getState().allSelectedWorkspaceData.task_collections !== undefined && store.getState().allSelectedWorkspaceData.task_collections.length > 0 ){
//         let collectionList = []
//         let taskList = []
        
//         for(var collectionIndex in store.getState().allSelectedWorkspaceData.task_collections){

//           axios.get('/todocollection', {
//             params: { 
//               collection_id:  store.getState().allSelectedWorkspaceData.task_collections[collectionIndex]
//             }
//           })
//           .then(res => {
//             if(res.data.data.collectionDetails !== null) {
//               collectionList.push({
//                 id: res.data.data.collectionDetails._id,
//                 title: res.data.data.collectionDetails.title
//               })
//               let collection_id = res.data.data.collectionDetails._id

//               for(var todoIndex in res.data.data.collectionDetails.to_do_elements){
//                 axios.get('/todo/', {params: {todo_id: res.data.data.collectionDetails.to_do_elements[todoIndex]}})
//                 .then(res => {
//                   taskList.push(  {
//                     id: res.data.data.todoDetails._id,
//                     group: collection_id,
//                     title: res.data.data.todoDetails.title,
//                     start_time: new Date (res.data.data.todoDetails.creation_date),
//                     end_time: new Date (res.data.data.todoDetails.due_date)
//                   })
//                 })
                
//               }
//             }
//           })

//         }

//         setCollections(collectionList)
//         setTasks(taskList)

//         return () => {
//           subs.forEach(unsub => unsub());
//         };
//       }

//     }


//   }, [store.getState().allSelectedWorkspaceData ,store.getState().selectedWorkspace, store.getState().selectedPanel]);

//   const config = {
//     height: 300,
//     list: {
//       rows: {
//         "1": {
//           id: "1",
//           label: "Row 1"
//         },
//         "2": {
//           id: "2",
//           label: "Row 2"
//         },
//         "3": {
//           id: "3",
//           label: "Row 3"
//         },
//         "4": {
//           id: "4",
//           label: "Row 4"
//         }
//       },
//       columns: {
//         data: {
//           id: {
//             id: "id",
//             data: "id",
//             width: 50,
//             header: {
//               content: "ID"
//             }
//           },
//           label: {
//             id: "label",
//             data: "label",
//             width: 200,
//             header: {
//               content: "Label"
//             }
//           }
//         }
//       }
//     },
//     chart: {
//       items: {
//         "1": {
//           id: "1",
//           rowId: "1",
//           label: "Item 1",
//           time: {
//             start: new Date().getTime(),
//             end: new Date().getTime() + 24 * 60 * 60 * 1000
//           }
//         },
//         "2": {
//           id: "2",
//           rowId: "2",
//           label: "Item 2",
//           time: {
//             start: new Date().getTime() + 4 * 24 * 60 * 60 * 1000,
//             end: new Date().getTime() + 5 * 24 * 60 * 60 * 1000
//           }
//         },
//         "3": {
//           id: "3",
//           rowId: "2",
//           label: "Item 3",
//           time: {
//             start: new Date().getTime() + 6 * 24 * 60 * 60 * 1000,
//             end: new Date().getTime() + 7 * 24 * 60 * 60 * 1000
//           }
//         },
//         "4": {
//           id: "4",
//           rowId: "3",
//           label: "Item 4",
//           time: {
//             start: new Date().getTime() + 10 * 24 * 60 * 60 * 1000,
//             end: new Date().getTime() + 12 * 24 * 60 * 60 * 1000
//           }
//         },
//         "5": {
//           id: "5",
//           rowId: "4",
//           label: "Item 5",
//           time: {
//             start: new Date().getTime() + 12 * 24 * 60 * 60 * 1000,
//             end: new Date().getTime() + 14 * 24 * 60 * 60 * 1000
//           }
//         }
//       }
//     }
//   };

//   let subs = [];

//   function onState(state) {
//     state.update("config.chart.items.1", item1 => {
//       item1.label = "Gantt schedule timeline calendar";
//       item1.time.end = item1.time.end + 2 * 24 * 60 * 60 * 1000;
//       return item1;
//     });
//     subs.push(
//       state.subscribe("config.chart.items", items => {
//         console.log("items changed", items);
//       })
//     );
//     subs.push(
//       state.subscribe("config.list.rows", rows => {
//         console.log("rows changed", rows);
//       })
//     );
//   }



//     return(
//         <div style={{marginRight:20}}>


//           { collections !==  [] && tasks !== [] ?
//             <div>
//             {/* <GSTC config={config} onState={onState} /> */}
//               <Timeline id="timeline_id"
//                 groups={collections}
//                 items={tasks}
//                 defaultTimeStart={ moment().days(1)  }
//                 defaultTimeEnd={ moment().days(moment().daysInMonth())  }
//                 traditionalZoom={true}
//               />
              
//             </div>
//             :
//             null
//           }
//         </div>
//     )

// }

// const mapStateToProps = state => {
//     return {
//       selectedCompany: state.selectedCompany, 
//       companies: state.companies, 
//       workspaces: state.workspaces, 
//       selectedWorkspace: state.selectedWorkspace, 
//       taskCollectionIDs: state.taskCollectionIDs, 
//       workspaceTaskCollections: state.workspaceTaskCollections}
// }
      
// const mapDispatchToProps = dispatch => {
//     return { dispatch }
// }
      
// export default connect(mapStateToProps, mapDispatchToProps)(CalendarPage)


