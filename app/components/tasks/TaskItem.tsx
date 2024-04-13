export default function TaskItem({task}){
    return(
        <div className="card w-96 bg-base-100 shadow-xl mb-5">
            <div className="card-body">
                {/* Have to use [1] since I am using firebase */}
                <h2 className="card-title">{task[1].title}</h2>
                <p>{task[1].content}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-success">Complete</button>
                    <button className="btn btn-warning">Edit</button>
                    <button className="btn btn-error">Delete</button>
                </div>
            </div>
        </div>
    )
}