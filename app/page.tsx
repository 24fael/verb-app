'use client'

import Navbar from './components/Navbar';
import TaskList from './components/tasks/TaskList';
import { useState } from 'react'

export default function Home() {
  return (
    <>
      <Navbar/>
      <main className="flex justify-center">
          <div className='grid'>
            <div className='flex justify-between'>
              <button className="btn btn-primary btn-lg text-white mt-10" onClick={()=> document.getElementById('add-task-modal').showModal()}>Add a task</button>
              <button className="btn btn-accent btn-lg text-white mt-10">See Completed Tasks</button>
            </div>

            <div className='mt-16'>
              <TaskList></TaskList>

              {/* <h3 className='text-center text-3xl'>No Tasks.</h3> */}
            </div>
          </div>
      </main>

      {/* Add task modal */}
      <dialog id="add-task-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add a Task</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
