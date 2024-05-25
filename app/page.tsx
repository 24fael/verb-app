'use client'

import Navbar from './components/Navbar'
import TaskList from './components/tasks/TaskList'
import TaskItem from "./components/tasks/TaskItem"
import axios, { AxiosResponse } from 'axios'
import { useState, useEffect } from 'react'
import { useVerbStore } from '@/state/verb-store'
import { useRouter } from 'next/navigation'
import TasksSkeleton from './components/tasks/TasksSkeleton'
import Swal from 'sweetalert2'

interface Task {
  title: string;
  content: string;
  isCompleted: boolean;
}

interface TasksResponse {
  [key: string]: Task;
}

export default function Home() {
  const router = useRouter()
  const [seeCompletedTasks, setSeeCompletedTasks] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const {
    isLoading, 
    setIsLoading
  } = useVerbStore();
  const [tasks, setTasks] = useState<React.ReactNode[]>([])
  const [completedTasksOnly, setCompletedTasksOnly] = useState(false)

  function addTask(): void {
    axios.post('https://verb-app-d5a55-default-rtdb.asia-southeast1.firebasedatabase.app/tasks.json', {
      title,
      content,
      isCompleted: false
    })
    .then((response: AxiosResponse) => {
      // Refresh the items after adding a new one
      setTitle("")
      setContent("")
      getTasks()

      Swal.fire({
        icon: "success",
        title: "Task Added",
        text: "You have successfully added a task!",
        position: "bottom-start",
        showConfirmButton: false,
        timer: 4000,
        toast: true
      })
    })
    .catch((error: any) => {
      console.log(error)
    })
  }

  function getTasks(): void {
    setIsLoading(true)

    axios.get("https://verb-app-d5a55-default-rtdb.asia-southeast1.firebasedatabase.app/tasks.json")
    .then((response: AxiosResponse<TasksResponse>) => {
        let tasks_arr: React.ReactNode[] = [];

        // Checks if only the completed tasks should be shown
        if(completedTasksOnly){
          tasks_arr = Object.entries(response.data).reverse().map(([id, task]) => {
            if(task.isCompleted === true){
              return(
                  <TaskItem key={id} taskID={id} task={task} getTasks={getTasks}/>
              )
            }
            return null; // Ensure all paths return something
          }).filter(Boolean);
        } else {
          // Have to use Object.entries since data from firebase is Object rather than Array
          tasks_arr = Object.entries(response.data).reverse().map(([id, task]) => {
            if(task.isCompleted === false){
              return(
                  <TaskItem key={id} taskID={id} task={task} getTasks={getTasks}/>
              )
            }
            return null; // Ensure all paths return something
          }).filter(Boolean);
        }

        console.log(completedTasksOnly)
        setTasks(tasks_arr)
        setIsLoading(false)
    })
    .catch((error: any) => {
        console.log(error)
    })
  }

  useEffect(() => {
    getTasks()
  }, [completedTasksOnly]);

  return (
    <>
      <Navbar/>
      <main className="flex justify-center">
          <div className='grid'>
            <div className='flex justify-center'>
              <h1 className='text-6xl font-bold'>Tasks</h1>
            </div>
            <div className='flex justify-between'>
              <button className="btn btn-primary btn-lg text-white mt-10" onClick={()=> document.getElementById('add-task-modal').showModal()}>Add a task</button>
              { completedTasksOnly ?
                <button className="btn btn-secondary btn-lg text-white mt-10" onClick={() => setCompletedTasksOnly(false)}>See Uncompleted Tasks</button>
                :
                <button className="btn btn-accent btn-lg text-white mt-10" onClick={() => setCompletedTasksOnly(true)}>See Completed Tasks</button>
              }
            </div>

            <div className='mt-16'>
              { isLoading ?
                <TasksSkeleton/>
                :
                <TaskList tasks={tasks}></TaskList>
              }

              {/* <h3 className='text-center text-3xl'>No Tasks.</h3> */}
            </div>
          </div>
      </main>

      {/* Add task modal */}
      <dialog id="add-task-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add a Task</h3>
          <label className="form-control w-full max-w-xs my-5">
            <div className="label">
              <span className="label-text">Title (optional)</span>
            </div>
            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={title} onChange={(event) => setTitle(event.target.value)}/>
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Content</span>
            </div>
            <textarea className="textarea textarea-bordered h-24" placeholder="Type here" value={content} onChange={(event) => setContent(event.target.value)}></textarea>
          </label>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
            <button className="btn btn-success ml-3" onClick={() => addTask()}>Add</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
