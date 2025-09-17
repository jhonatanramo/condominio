import { useEffect, useState } from "react";
import { getAllTasks, deleteTask } from "../api/tasks.api";
import { useNavigate } from "react-router-dom";

export function TasksList() {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadTasks() {
            const res = await getAllTasks();
            setTasks(res.data);
        }
        loadTasks();
    }, []);

    const handleDelete = async (id) => {
        await deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div>
            <h1>Tasks</h1>
            <button onClick={() => navigate('/tasks-create')}>Create Task</button>
            <div>
                {tasks.map(task => (
                    <div key={task.id}>
                        <h3>{task.nombre} {task.apellido_paterno}</h3>
                        <p>CI: {task.ci}</p>
                        <p>Email: {task.email}</p>
                        <button onClick={() => navigate(`/tasks/${task.id}`)}>Edit</button>
                        <button onClick={() => handleDelete(task.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
