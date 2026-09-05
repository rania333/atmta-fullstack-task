const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
    if (!res.ok) { // Err
        const error = await res.json();
        throw new Error(Array.isArray(error.message) ?  // As nest send errs in arr
            error.message.join(', ') : 
            error.message || 'Something went wrong');
    }
    
    return res.json() as Promise<T>;
}