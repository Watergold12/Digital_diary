const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    } as Record<string, string>;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized (e.g., token expired)
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'API request failed');
    }

    // Return null for 204 No Content
    if (response.status === 204) {
      return null as any;
    }

    return response.json();
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) });
  }

  put<T>(endpoint: string, data: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
