import axios from "@/node_modules/axios/index"
import Swal from 'sweetalert2'
import { useVerbStore } from "@/state/verb-store"
import { useState } from "react"
import ExpandableText from "../miscellaneous/ExpandableText";
import Linkify from "linkify-react";
import { FaEdit, FaTrash} from 'react-icons/fa';
import { Editor } from '@tinymce/tinymce-react'

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
        // Checks if the content field is empty or null
        if(editContent === null || editContent === ""){
            return Swal.fire({
                icon: "warning",
                title: "Content Empty",
                text: "Content must not be empty!",
                position: "bottom-start",
                showConfirmButton: false,
                timer: 4000,
                toast: true,
                customClass: {
                    popup: 'sweetalert-overlay'
                }
            })
        }

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
                toast: true,
                customClass: {
                    popup: 'sweetalert-overlay'
                }
            })

            getTasks()
        }).catch(error => {
            console.log(error)
        })
    }

    const linkifyOptions = {
        defaultProtocol: 'https',
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'text-blue-500 hover:underline',
    };

    return(
        <div className="card w-96 bg-base-200 hover:bg-base-300 shadow-lg mb-5">
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
                                className="input input-bordered w-full max-w-xs mb-5"
                                value={editTitle}
                                onChange={(event) => setEditTitle(event.target.value)}/>

                                <Editor
                                    apiKey="zt3o4qfpwv2rfg470icmow23z4yiny8793gwegmabt4t2ofp" // Replace with your TinyMCE API key
                                    value={editContent}
                                    onEditorChange={setEditContent}
                                    init={{
                                        height: 200,
                                        menubar: false,
                                        plugins: 'lists',
                                        toolbar:
                                        'bold italic underline | bullist numlist'
                                    }}
                                />
                            </>
                        :
                            <>
                                <Linkify options={linkifyOptions} as="h2" className={task.isCompleted ? "card-title line-through font-black" : "card-title font-black"}>{task.title}</Linkify>
                                <ExpandableText text={task.content} maxLength={70} taskIsCompleted={task.isCompleted} />
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
                                    <div className="tooltip" data-tip="Edit">
                                        <button className="btn btn-accent" onClick={()=> isEditingMode(taskID)}>
                                            <FaEdit />
                                        </button>
                                    </div>
                                }
                                <div className="tooltip" data-tip="Delete">
                                    <button className="btn btn-error" onClick={() => deleteTask(taskID)}>
                                        <FaTrash/>
                                    </button>
                                </div>
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