import React, { useState, useEffect } from "react";
import { FaArrowUp ,FaArrowDown  } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';

const TaskScheduler = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([])
  const [completedTask, setCompltedTask] = useState( JSON.parse( localStorage.getItem("compltedTask")) === null ? [] : JSON.parse( localStorage.getItem("compltedTask")) ) ;
  const [upComingTask, setUpComingTask] =  useState( JSON.parse( localStorage.getItem("upcomingTask"))  === null ? [] : JSON.parse( localStorage.getItem("upcomingTask")) ) ;
  const [priority, setPriority] = useState("low");
  const [category, setCategory] = useState("personal");
  const [dueDate, setDueDate] = useState(""); 
  const [editId, setEditId] = useState(0);
  const [sort, setSort] = useState("DESC")


  const handleAddTask = (e) => {
    e.preventDefault();
    if (task === "") {
      alert("Task should not be empty");
      return;
    }
    if (editId) {
      alert("Task Updated Successfully");
      const updatedTasks = upComingTask.map((item) => {
        if (item.id === editId) {
          return {
            ...item,
            task,
            priority,
            category,
            dueDate,
          };
        } else {
          return item;
        }
      });
      console.log("here is updated", updatedTasks);
      setUpComingTask(updatedTasks);
      setTask("");
      setPriority("high");
      setCategory("work");
      setDueDate("");
      setEditId(0);
      return;
    }

    const tempTask = {
      id: uuidv4(),
      task: task,
      priority: priority,
      category: category,
      dueDate: dueDate,
    };
    console.log(tempTask);
    const tempArr = [...upComingTask, tempTask];

    setTasks(tempArr);
    setUpComingTask(tempArr);
    setTask("");
    setPriority("high");
    setCategory("work");
    setDueDate("");
  };
  console.log(tasks);

  const handleEdit = (id, e) => {
    e.preventDefault();
    setEditId(id);
    const targetedTask = upComingTask.find((el) => id === el.id);
    setTask(targetedTask.task);
    setPriority(targetedTask.priority);
    setCategory(targetedTask.category);
    setDueDate(targetedTask.dueDate);
    
  };

  const handleDelete = (id, e) => {
    const updatedTasks = upComingTask.filter((ele, index) => {
      return ele.id !== id;
    });
    setUpComingTask(updatedTasks);
  };

  const handleCompleted =  (id, e) => {
    const completedT = upComingTask.find((ele) => ele.id === id);
    const updatedTasks = upComingTask.filter((ele, index) => {
      return ele.id !== id;
    });

    setUpComingTask(updatedTasks);
    setCompltedTask([...completedTask, completedT]);
    console.log("upcoming tasks are ",upComingTask, "complted task are ",completedTask);
  };

  const handleSort=()=>{
     
     const sortedTask = [...upComingTask];
     if(sort === "ASC"){
       sortedTask.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
     }
     else{
      sortedTask.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
     }

     setUpComingTask(sortedTask);
  }

  useEffect(()=>{
    localStorage.setItem("compltedTask", JSON.stringify(completedTask));
    localStorage.setItem("upcomingTask", JSON.stringify(upComingTask));
  },[upComingTask,completedTask])
  
  useEffect(()=>{
   handleSort()
  },[sort, ])
  return (
    <div>
      <header>
        <h1 id="main-heading">Task Scheduler</h1>
      </header>
      <main>
        <section className="all-input">
          <input
            type="text"
            placeholder="Enter Your Task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="taskPriority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="taskCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
          </select>
          <label htmlFor="date-input">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
           id="date-input"
  
          />
          <button onClick={handleAddTask}>{editId ? "Edit Task":"Add Task"}</button>
        </section>
        <h2 className="comp-heading">Upcoming Task</h2>
        <div className="upcoming-task">
          <table>
            <tr>
              <th>Task Name</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Due Date {sort === "ASC" ? <FaArrowUp onClick={()=>setSort((prev)=> prev === "ASC" ? prev = "DESC" : prev = "ASC" )}/> : <FaArrowDown onClick={()=>setSort((prev)=> prev === "ASC" ? prev = "DESC" : prev = "ASC" )}/>  } </th>
              <th>Status</th>
            </tr>
            <tbody>
              {upComingTask.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>{item.task}</td>
                    <td>{item.priority}</td>
                    <td>{item.category}</td>
                    <td>{item.dueDate}</td>
                    <td>
                      <button className="buttons-edit" onClick={(e) => handleCompleted(item.id, e)}>
                        Mark As Done
                      </button>
                    </td>
                    <td>
                      <button className="buttons-edit"  onClick={(e) => handleEdit(item.id, e)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <button className="buttons-edit" onClick={(e) => handleDelete(item.id, e)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="complted-task">
          <h2 className="comp-heading">Completed Task</h2>
          <table>
            <tr>
              <th>Task Name</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
            <tbody>
              {completedTask.map((item, index) => {
                return (
                  <tr>
                    <td>{item.task}</td>
                    <td>{item.priority}</td>
                    <td>{item.dueDate}</td>
                    <td>Complted</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default TaskScheduler;
