import { ApiError } from "./api-error";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not configured');
    }
    // Check if token exist [server or client]
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // Send the req
    const res = await fetch(`${API_URL}${endpoint}`, { ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}`
            }),
            ...options.headers
        }
    });
    if (!res.ok) {
        let message = 'حدث خطأ ما';
        try {
        const error = await res.json();
        message = Array.isArray(error.message)
            ? error.message.join(', ')
            : error.message || message;
        } catch {
        }

        throw new ApiError( message, res.status);
    }
    
    return res.json() as Promise<T>;
}
