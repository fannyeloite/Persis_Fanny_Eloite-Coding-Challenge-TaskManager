// import React, { useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { useNavigate } from "react-router-dom";

// const AddingTasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [editMode, setEditMode] = useState(false);
//   const [taskForm, setTaskForm] = useState({
//     taskId: "",
//     title: "",
//     description: "",
//     dueDate: "",
//     priority: "Medium",
//     status: "Pending",
//     email: localStorage.getItem("email"), // Set the logged-in user's email
//   });

  

//   const fetchTasks = async () => {
//     try {
//       const res = await axiosInstance.get("/api/tasks");
//       const userEmail = localStorage.getItem("email");
//       const userTasks = res.data.filter((task) => task.email === userEmail);
//       setTasks(userTasks);
//     } catch (err) {
//       console.error("Error fetching tasks", err);
//       alert("Failed to fetch tasks");
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTaskForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editMode) {
//         await axiosInstance.put(`/api/tasks/${taskForm.taskId}`, taskForm);
//       } else {
//         await axiosInstance.post("/api/tasks", taskForm);
//       }
//       resetForm();
//       fetchTasks();
//     } catch (err) {
//       alert("Error saving task");
//     }
//   };

//   const handleEdit = (task) => {
//     setTaskForm(task);
//     setEditMode(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this task?")) {
//       await axiosInstance.delete(`/api/tasks/${id}`);
//       fetchTasks();
//     }
//   };

//   const resetForm = () => {
//     setEditMode(false);
//     setTaskForm({
//       taskId: "",
//       title: "",
//       description: "",
//       dueDate: "",
//       priority: "Medium",
//       status: "Pending",
//       email: localStorage.getItem("email"),
//     });
//   };

//   return (
//     <div className="container mt-5">
//       <h2>{editMode ? "Edit Task" : "Add Task"}</h2>
//       <form onSubmit={handleSubmit} className="mb-4">
//         <input
//           type="text"
//           name="title"
//           placeholder="Title"
//           className="form-control mb-2"
//           value={taskForm.title}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           className="form-control mb-2"
//           value={taskForm.description}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="date"
//           name="dueDate"
//           className="form-control mb-2"
//           value={taskForm.dueDate}
//           onChange={handleChange}
//           required
//         />
//         <select
//           name="priority"
//           className="form-control mb-2"
//           value={taskForm.priority}
//           onChange={handleChange}
//           required
//         >
//           <option value="Low">Low</option>
//           <option value="Medium">Medium</option>
//           <option value="High">High</option>
//         </select>
//         <select
//           name="status"
//           className="form-control mb-2"
//           value={taskForm.status}
//           onChange={handleChange}
//           required
//         >
//           <option value="Pending">Pending</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Completed">Completed</option>
//         </select>

//         <div>
//           <button type="submit" className="btn btn-success me-2">
//             {editMode ? "Update Task" : "Add Task"}
//           </button>
//           <button type="button" onClick={resetForm} className="btn btn-secondary">
//             Clear
//           </button>
//         </div>
//       </form>

//       <h3>My Tasks</h3>
//       <table className="table table-bordered">
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Description</th>
//             <th>Due</th>
//             <th>Priority</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tasks.length === 0 && (
//             <tr>
//               <td colSpan="6" className="text-center">
//                 No tasks found.
//               </td>
//             </tr>
//           )}
//           {tasks.map((task) => (
//             <tr key={task.taskId}>
//               <td>{task.title}</td>
//               <td>{task.description}</td>
//               <td>{task.dueDate}</td>
//               <td>{task.priority}</td>
//               <td>{task.status}</td>
//               <td>
//                 <button className="btn btn-info btn-sm me-2" onClick={() => handleEdit(task)}>
//                   Edit
//                 </button>
//                 <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.taskId)}>
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AddingTasks;

import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import registerBg from '../assets/registerbg.jpg';

const AddingTask = () => {
  const email = localStorage.getItem("email"); // get user email from localStorage
  const [tasks, setTasks] = useState([]);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
    status: "PENDING",
    email: email, // associate task with user email
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/api/tasks");
      const userTasks = res.data.filter((task) => task.email === email);
      setTasks(userTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      alert("Error fetching tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axiosInstance.put(`/api/tasks/${editId}`, inputs);
        setEditMode(false);
        setEditId(null);
      } else {
        await axiosInstance.post("/api/tasks", inputs);
      }
      setInputs({
        title: "",
        description: "",
        dueDate: "",
        priority: "LOW",
        status: "PENDING",
        email: email,
      });
      fetchTasks();
    } catch (err) {
      alert("Error saving task");
    }
  };

  const handleEdit = (task) => {
    setInputs(task);
    setEditMode(true);
    setEditId(task.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await axiosInstance.delete(`/api/tasks/${id}`);
      fetchTasks();
    }
  };

  return (
  <>
    <div
  className="container py-5"
  style={{
  backgroundImage: `url(${registerBg})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  minHeight: '100vh',
  minWidth: '100vw',           
  overflowX: 'hidden'        
}}

>

      <div className="row g-4">
        {/* Form Section */}
        <div className="col-md-4">
          <div className="form-section">
            <h4 className="mb-4">{editMode ? "Edit Task" : "Add / Update Task"}</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Task Title"
                  value={inputs.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  name="description"
                  placeholder="Description"
                  value={inputs.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="date"
                  className="form-control"
                  name="dueDate"
                  value={inputs.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <select
                  className="form-select"
                  name="priority"
                  value={inputs.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="mb-3">
                <select
                  className="form-select"
                  name="status"
                  value={inputs.status}
                  onChange={handleChange}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div className="mb-3 d-flex">
                <button type="submit" className="btn btn-primary me-2">
                  Save
                </button>
                <button
                  type="reset"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditMode(false);
                    setInputs({
                      title: "",
                      description: "",
                      dueDate: "",
                      priority: "LOW",
                      status: "PENDING",
                      email: email,
                    });
                    setEditId(null);
                  }}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Table Section */}
        <div className="col-md-8">
          <div className="table-section">
            <h4 className="mb-4">Your Task List</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.dueDate}</td>
                      <td>{task.priority}</td>
                      <td>{task.status}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => handleEdit(task)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(task.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Styling */}
    <style>{`
      .form-section, .table-section {
        background-color: #ffebf7c0;
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease-in-out;
      }
      .form-section:hover, .table-section:hover {
        transform: translateY(-4px);
      }
    `}</style>
  </>
);

};

export default AddingTask;