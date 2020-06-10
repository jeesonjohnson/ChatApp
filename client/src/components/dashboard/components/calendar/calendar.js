import React, { Component } from "react";
import Calendar from 'react-calendar';
import store from './../../../../../src/store/index'
import ToDo from './toDoList'

import toDo from "../../toDoList/components/toDo";
class TodoCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
          }

          this.onChange = this.onChange.bind(this)
    }

    onChange = (date) => {
        this.setState({
            date: date
        }) 
    }

    render() {
        let toDoElemID = []
        store.getState().workspaceTaskCollections.map(collection => {
            return collection.to_do_elements.map((todo) => {
                return (todo)
            })
        })
        .map((todo) => {
            todo.map(todo_key => {
                toDoElemID.push(todo_key)
            }) 
        })

        return (         
            <div>
                <Calendar onChange = {this.onChange} value = {this.state.value}/>
                <br />
                <h4>To-do</h4>  

                {  
                    toDoElemID == 0 ?
                    <h4 style = {{fontSize: 12}}>No tasks in this workspace</h4>  
                    :  
                    toDoElemID.map(todo => {
                        return <ToDo key= {todo.due_date} todoID = {todo} selectedDate = {this.state.date}/>
                    })
                }
            </div>
        );

    }
}

export default TodoCalendar; 