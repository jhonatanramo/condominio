import axios from 'axios'

const tasksApi = axios.create({
    baseURL: 'http://localhost:8000/colegio/api/v1/colegio/'
})

export const getAllTasks = () => tasksApi.get('/')

export const getTask = (id) => tasksApi.get(`/${id}/`)

export const createTask = (task) => tasksApi.post('/', task)

export const updateTask = (id, task) => tasksApi.put(`/${id}/`, task)

export const deleteTask = (id) => tasksApi.delete(`/${id}/`)
