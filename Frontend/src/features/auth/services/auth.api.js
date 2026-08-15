import axios from "axios"


const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://ai-resume-1-v6jj.onrender.com" : "http://localhost:3000");

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        if (response.data.token) {
            localStorage.setItem("token", response.data.token)
        }

        return response.data

    } catch (err) {

        console.log(err)

    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        if (response.data.token) {
            localStorage.setItem("token", response.data.token)
        }

        return response.data

    } catch (err) {
        console.log(err)
    }

}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        localStorage.removeItem("token")

        return response.data

    } catch (err) {
        localStorage.removeItem("token")
    }
}

export async function getMe() {

    try {

        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        console.log(err)
    }

}