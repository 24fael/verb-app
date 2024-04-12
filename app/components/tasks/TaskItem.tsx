export default function TaskItem(){
    return(
        <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Sample Task</h2>
                <p>Pick up painting materials for art gallery prep</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-success">Complete</button>
                    <button className="btn btn-warning">Edit</button>
                    <button className="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>
    )
}