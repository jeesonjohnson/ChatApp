import React, {useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import axios from 'axios'
import store from './../../../../../src/store/index'
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';

function TODOCalendar(props) {

  const [todoDetails, setTodoDetails] = useState({})

  const loadToDoElement = async () => {
    await axios.get('/todo/', { params: { todo_id: props.todoID } })
    .then(res => {
      //if(res.data.data.todoDetails.assigned_users.includes(store.getState().user._id)){
        setTodoDetails(res.data.data.todoDetails)
        //console.log(todo)
     // }
    })


  }

  useEffect( () => {
    loadToDoElement()
  }, [])

  return ( 

    <List>  
      <h6 style = {{fontSize: 12}}>{todoDetails.title}</h6> 
      <ListItem dense button key= {todoDetails.title}>
        <ListItemText primary={todoDetails.due_date} secondary = {todoDetails.description} />   
        </ListItem>
    </List>
  )

}


export default TODOCalendar;