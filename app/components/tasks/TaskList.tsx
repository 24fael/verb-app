import TaskItem from "./TaskItem";
import axios from 'axios';
import {useEffect, useState} from 'react';

export default function TaskList(){
    const [tasks, setTasks] = useState()

    useEffect(() => {
        axios.get("https://verb-app-d5a55-default-rtdb.asia-southeast1.firebasedatabase.app/tasks.json")
        .then((response: any) => {
            // Have to use Object.entries since data from firebase is Object rather than Array
            const tasks_arr = Object.entries(response.data).map(task => {
                return(
                    <TaskItem task={task}/>
                )
            })

            setTasks(tasks_arr)
        })
        .catch((error: any) => {
            console.log(error)
        })
    }, []);

    return(
        <>  
            {tasks}  
        </>
    )
}