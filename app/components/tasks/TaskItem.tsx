import axios from "@/node_modules/axios/index"
import Swal from 'sweetalert2'
import { useVerbStore } from "@/state/verb-store"
import { useState } from "react"

interface Task {
    title: string;
    content: string;
    isCompleted: boolean;
}

interface TaskItemProps {
    taskID: string;
    task: Task;
    getTasks: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ taskID, task, getTasks }) => {
    const {isLoading} = useVerbStore()
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editIsComplete, setEditIsComplete] = useState(false);
    const [editTaskId, setEditTaskId] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    function deleteTask(task_id: string){
        axios.delete(`https://verb-app-d5a55-default-rtdb.asia-southeast1.firebasedatabase.app/tasks/${task_id}.json`)
        .then(response => {
            Swal.fire({
                icon: "success",
                title: "Task Deleted",
                text: "You have successfully deleted a task!",
                position: "bottom-start",
                showConfirmButton: false,
                timer: 4000,
                toast: true
            })

            getTasks()
        })
        .catch(error => {
            console.log(error)
        })
    }

    function completeTask(task_id: string){
        axios.put(`https://verb-app-d5a55-default-rtdb.asia-southeast1.firebasedatabase.app/tasks/${task_id}.json`, {
            title: task.title,
            content: task.content,
            isCompleted: task.isCompleted ? false : true
        })
        .then(response => {
            if(task.isCompleted){
                Swal.fire({
                    icon: "success",
                    title: "Task Undone!",
                    text: "The task has been moved back to 'Uncompleted Tasks'.",
                    position: "bottom-start",
                    showConfirmButton: false,
                    timer: 5000,
                    toast: true
                })
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Task Completed!",
                    text: "The task has been moved to 'Completed Tasks'.",
                    position: "bottom-start",
                    showConfirmButton: false,
                    timer: 5000,
                    toast: true
                })
            }

            getTasks()
        }).catch(error => {
            console.log(error)
        })
    }

    function isEditingMode(task_id: string){
        axios.get(`https://verb-app-d5a55-default-rtdb.asia-southeast1.firebasedatabase.app/tasks/${task_id}.json`)
        .then(response => {
        
            setEditTitle(response.data.title)
            setEditContent(response.data.content)
            setEditIsComplete(task.isCompleted) //Should keep the previous value
            setEditTaskId(task_id)
            setIsEditing(true)
        })
    }

    function editTask(task_id: string){
        axios.put(`https://verb-app-d5a55-default-rtdb.asia-southeast1.firebasedatabase.app/tasks/${task_id}.json`, {
            title: editTitle,
            content: editContent,
            isCompleted: editIsComplete
        })
        .then(response => {
            Swal.fire({
                icon: "success",
                title: "Changes Saved!",
                text: "You have successfully updated your task!",
                position: "bottom-start",
                showConfirmButton: false,
                timer: 4000,
                toast: true
            })

            getTasks()
        }).catch(error => {
            console.log(error)
        })
    }

    return(
        <div className="card w-96 bg-base-100 shadow-xl mb-5">
            <div className="card-body">
            <details className="collapse collapse-arrow">
                <summary className="collapse-title text-xl">
                    { task.isCompleted ?
                        <span className="badge badge-accent">Completed</span>
                        :
                        <></>
                    }
                    {
                        isEditing ?
                            <>
                                <input  
                                type="text"
                                placeholder="Type here"
                                className="input input-bordered w-full max-w-xs"
                                value={editTitle}
                                onChange={(event) => setEditTitle(event.target.value)}/>

                                <textarea 
                                className="textarea textarea-bordered h-40 w-full mt-5"
                                placeholder="Type here"
                                value={editContent}
                                onChange={(event) => setEditContent(event.target.value)}></textarea>
                            </>
                        :
                            <>
                                <h2 className={task.isCompleted ? "card-title line-through font-black" : "card-title font-black"}>{task.title}</h2>
                                <p className={task.isCompleted ? "line-through font-normal" : "font-normal"} style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{task.content}</p>
                            </>
                    }
                </summary>
                <div className="collapse-content"> 
                    <div className="card-actions justify-end">
                        {isEditing ? 
                            <>
                                <button className="btn btn-warning" onClick={()=> setIsEditing(false)}>Cancel</button>
                                <button className="btn btn-success" onClick={() => editTask(editTaskId)}>Save Changes</button>
                            </>
                            :
                            <>
                                <button className="btn btn-success" onClick={() => completeTask(taskID)}>{task.isCompleted ? "Undo" : "Complete"}</button>
                                {task.isCompleted ?
                                    ""
                                    :
                                    <button className="btn btn-warning" onClick={()=> isEditingMode(taskID)}>Edit</button>
                                }
                                <button className="btn btn-error" onClick={() => deleteTask(taskID)}>Delete</button>
                            </>
                        }
                    </div>
                </div>
            </details>
            </div>
        </div>
    )
}

export default TaskItem