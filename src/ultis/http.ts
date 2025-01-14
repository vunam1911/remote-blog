import axios, { AxiosInstance } from 'axios'

class Http {
    interface: AxiosInstance
    constructor() {
        this.interface = axios.create({
            baseURL: 'http://localhost:4000/',
            timeout: 10000
        })
    }
}

const http = new Http().interface

export default http
