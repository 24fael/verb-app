'use client'

import Navbar from './components/Navbar'
import TaskItem from "./components/tasks/TaskItem"
import axios, { AxiosResponse } from 'axios'
import { useState, useEffect } from 'react'
import { useVerbStore } from '@/state/verb-store'
import TasksSkeleton from './components/tasks/TasksSkeleton'
import Swal from 'sweetalert2'
import { Editor } from '@tinymce/tinymce-react'

interface Task {
  title: string;
  content: string;
  isCompleted: boolean;
}

interface TasksResponse {
  [key: string]: Task;
}

export default function Home() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const {
    isLoading, 
    setIsLoading
  } = useVerbStore();
  const [tasks, setTasks] = useState<React.ReactNode[]>([])
  const [completedTasksOnly, setCompletedTasksOnly] = useState(false)
  const [addAnother, setAddAnother] = useState(false);

  function addTask() {
    // Checks if the content field is empty or null
    if(content === null || content === ""){
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

    axios.post('https://verb-app-d5a55-default-rtdb.asia-southeast1.firebasedatabase.app/tasks.json', {
      title,
      content,
      isCompleted: false
    })
    .then((response: AxiosResponse) => {
      if (!addAnother) {
        // Close the modal if the user doesn't want to add another task
        const modal = document.getElementById('add-task-modal') as HTMLDialogElement;
        modal.close();
      } 
      
      // Clear the items after adding a new one
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
        toast: true,
        customClass: {
          popup: 'sweetalert-overlay'
        }
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
                  <div key={id} className="flex flex-col">
                    <TaskItem taskID={id} task={task} getTasks={getTasks}/>
                  </div>
              )
            }
            return null; // Ensure all paths return something
          }).filter(Boolean);
        } else {
          // Have to use Object.entries since data from firebase is Object rather than Array
          tasks_arr = Object.entries(response.data).reverse().map(([id, task]) => {
            if(task.isCompleted === false){
              return(
                    <TaskItem taskID={id} task={task} getTasks={getTasks}/>
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
  }, [completedTasksOnly]) //Observes the state so whenever it changes, it executes the getTasks function

  return (
    <>
      <Navbar/>
      <main className="flex justify-center pt-24">
          <div className='pb-9'>
            <div className='flex justify-center'>
              <h1 className='text-4xl font-bold'>Tasks</h1>
            </div>

            <div className='flex justify-center'>
              <button
                className="btn btn-primary btn-md md:btn-lg text-white mt-10 mr-5"
                onClick={() => {
                  const modal = document.getElementById('add-task-modal') as HTMLDialogElement;
                  if (modal) {
                    modal.showModal();
                  }
                }}
              >
                Add a task
              </button>
              { completedTasksOnly ?
                <button className="btn btn-secondary btn-md md:btn-lg text-white mt-10" onClick={() => setCompletedTasksOnly(false)}>See Uncompleted Tasks</button>
                :
                <button className="btn btn-accent btn-md md:btn-lg text-white mt-10" onClick={() => setCompletedTasksOnly(true)}>See Completed Tasks</button>
              }
            </div>

            <div className='mt-10'>
            { isLoading ? (
              <TasksSkeleton />
            ) : (
              tasks.length === 0 ? (
                <h3 className='text-center text-lg'>No tasks yet. Go create some!</h3>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {tasks}
                </div>
              )
            )}
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
              <span className="label-text">Content (required)</span>
            </div>
            <Editor
              apiKey="zt3o4qfpwv2rfg470icmow23z4yiny8793gwegmabt4t2ofp" // Replace with your TinyMCE API key
              value={content}
              onEditorChange={setContent}
              init={{
                height: 400,
                menubar: false,
                plugins: 'lists',
                toolbar:
                  'bold italic underline | bullist numlist'
              }}
            />
          </label>
          <label className="form-control w-full max-w-xs my-5">
            <div className="label cursor-pointer">
              <span className="label-text">Add another task immediately?</span>
              <input
                type="checkbox"
                className="toggle toggle-accent"
                checked={addAnother}
                onChange={() => setAddAnother(!addAnother)}
              />
            </div>
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
