export default function Navbar() {
    return (
        <div className="navbar bg-base-200 flex justify-center fixed top-0 w-full z-10">
            <div className="">
                <a className="btn btn-ghost text-3xl" style={{ fontFamily: "Staatliches, sans-serif" }}>Verb</a>
            </div>
            {/* <div className="flex-none gap-2">
                <div className="form-control">
                <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div>
            </div> */}
        </div>
    );
}
