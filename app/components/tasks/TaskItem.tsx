import axios from "@/node_modules/axios/index"
import Swal from 'sweetalert2'
import { useVerbStore } from "@/state/verb-store"

export default function TaskItem({taskID, task, getTasks}){
    const {isLoading} = useVerbStore()

    function deleteTask(task_id){
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

    return(
        <div className="card w-96 bg-base-100 shadow-xl mb-5">
            <div className="card-body">
                <h2 className="card-title">{task.title}</h2>
                <p>{task.content}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-success">Complete</button>
                    <button className="btn btn-warning">Edit</button>
                    <button className="btn btn-error" onClick={() => deleteTask(taskID)}>Delete</button>
                </div>
            </div>
        </div>
    )
}