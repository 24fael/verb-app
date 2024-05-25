interface Task {
    title: string;
    content: string;
    isCompleted: boolean;
}

interface TaskListProps {
    tasks: React.ReactNode[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    return (
    <>
        {tasks}
    </>
    );
};

export default TaskList;