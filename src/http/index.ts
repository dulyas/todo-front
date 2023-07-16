import axios from "axios";
import { AuthResponse } from "../models";

// export const API_URL = 'http://localhost:1338'
export const API_URL = "http://dulyas.fun/todo-back";
export const basepath = "/todo-front";

const api = axios.create({
	withCredentials: true,
	baseURL: API_URL,
});

api.interceptors.request.use((config) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
	return config;
});

api.interceptors.response.use(
	(config) => {
		return config;
	},
	async (err) => {
		const originalRequest = err.config;
		if (
			err?.response?.status == 401 &&
			err.config &&
			!err.config._isRetry
		) {
			originalRequest._isRetry = true;
			try {
				const response = await axios.get<AuthResponse>(
					`${API_URL}/user/refresh`,
					{ withCredentials: true },
				);
				localStorage.setItem("token", response.data.accessToken);
				return api.request(originalRequest);
			} catch (error) {
				console.log("не авторизован");
			}
		}
		throw err;
	},
);

export default api;
