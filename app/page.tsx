'use client'

import Navbar from './components/Navbar'
import TaskList from './components/tasks/TaskList'
import axios from 'axios'
import { useState } from 'react'

export default function Home() {
  const [seeCompletedTasks, setSeeCompletedTasks] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  function addTask():any{
    axios.post('https://verb-app-d5a55-default-rtdb.asia-southeast1.firebasedatabase.app/tasks.json', {
      title: title,
      content: content
    })
    .then(response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error)
    })
  }

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
              { seeCompletedTasks ?
                <button className="btn btn-secondary btn-lg text-white mt-10" onClick={() => setSeeCompletedTasks(!seeCompletedTasks)}>See Uncompleted Tasks</button>
                :
                <button className="btn btn-accent btn-lg text-white mt-10" onClick={() => setSeeCompletedTasks(!seeCompletedTasks)}>See Completed Tasks</button>
              }
            </div>

            <div className='mt-16'>
              <TaskList></TaskList>

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
