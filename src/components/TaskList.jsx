import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import '../styles/TaskList.css';

const API_URL = 'https://677a9e66671ca030683469a3.mockapi.io/todo/createTodo';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDateTimestamp: Date.now()
  });
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      setUserData(currentUser);
      // Add this logic for avatar handling
      if (currentUser.avatar) {
        setUserAvatar(currentUser.avatar);
      } else if (currentUser.name) {
        setUserAvatar(currentUser.name.charAt(0).toUpperCase());
      }
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const addTask = async () => {
    try {
      const taskData = {
        title: String(newTask.title),
        description: String(newTask.description),
        dueDateTimestamp: Number(newTask.dueDateTimestamp),
        status: 'new',
        active: 1,
        assignee: userData?.name || '',
        assigneeAvatar: userData?.avatar || ''
      };
      await axios.post(API_URL, taskData);
      setShowAddModal(false);
      setNewTask({
        title: '',
        description: '',
        dueDateTimestamp: Date.now()
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${String(id)}`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const renderTaskItem = (task) => {
    if (!task || typeof task !== 'object') return null;
    
    const taskDate = task.dueDateTimestamp ? 
      moment(Number(task.dueDateTimestamp)).format('DD MMM, YYYY') : 
      '';

    return (
      <div key={String(task.id)} className="task-item">
        <div className="task-checkbox">
          <input 
            type="checkbox" 
            checked={false}
            onChange={() => deleteTask(task.id)}
          />
        </div>
        <div className="task-content">
          <div className="task-title">{String(task.title)}</div>
          <div className="task-meta">
            <span className="task-date">{taskDate}</span>
            <span className="task-repeat">↻</span>
          </div>
        </div>
        <div className="task-assignee">
          <img 
            src={task.assigneeAvatar || '/default-avatar.png'} 
            alt={task.assignee} 
            className="assignee-avatar"
          />
        </div>
      </div>
    );
  };

  const now = moment();
  const overdueTasks = tasks.filter(task => 
    moment(Number(task.dueDateTimestamp)).isBefore(now, 'day')
  );
  const todayTasks = tasks.filter(task => 
    moment(Number(task.dueDateTimestamp)).isSame(now, 'day')
  );
  const upcomingTasks = tasks.filter(task => 
    moment(Number(task.dueDateTimestamp)).isAfter(now, 'day')
  );

  return (
    <div className="task-list-container">
      <div className="sidebar">
        <button className="add-button" onClick={() => setShowAddModal(true)}>+</button>
        <button className="calendar-button">{String(moment().date())}</button>
        <button className="menu-button">☰</button>
        <div className="profile-section">
          {userAvatar.length === 1 ? (
            <div className="avatar-letter">{userAvatar}</div>
          ) : (
            <img 
              src={userAvatar || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-pic"
            />
          )}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <h1>Today</h1>
          <div className="todo-count">
            <span>{String(tasks.length)} To-Dos</span>
          </div>
        </div>

        <div className="tasks-section">
          {overdueTasks.length > 0 && (
            <>
              <h2>Overdue</h2>
              {overdueTasks.map(task => renderTaskItem(task))}
            </>
          )}

          <h2>Today</h2>
          {todayTasks.map(task => renderTaskItem(task))}

          {upcomingTasks.length > 0 && (
            <>
              <h2>Upcoming</h2>
              {upcomingTasks.map(task => renderTaskItem(task))}
            </>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Task</h2>
            <input
              type="text"
              placeholder="Title"
              value={String(newTask.title)}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            />
            <textarea
              placeholder="Description"
              value={String(newTask.description)}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            />
            <input
              type="datetime-local"
              value={moment(Number(newTask.dueDateTimestamp)).format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => setNewTask({
                ...newTask, 
                dueDateTimestamp: moment(e.target.value).valueOf()
              })}
            />
            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
              <button onClick={addTask}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;