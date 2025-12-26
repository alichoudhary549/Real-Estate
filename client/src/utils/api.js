import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const getAllProperties = async () => {
  try {
    const response = await api.get("/residency/allresd", {
      timeout: 10 * 1000,
    });

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};

// Search properties by title and/or city
export const searchProperties = async (title = "", city = "") => {
  try {
    const params = new URLSearchParams();
    if (title && title.trim()) params.append('title', title.trim());
    if (city && city.trim()) params.append('city', city.trim());

    // Don't make request if no params
    if (params.toString() === '') {
      console.log("No search params provided, returning empty array");
      return [];
    }

    const url = `/residency/search?${params.toString()}`;
    console.log("Search API request:", url);

    const response = await api.get(url, {
      timeout: 10 * 1000,
    });

    console.log("Search API response:", response.data);

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    
    // Return the data array from the response
    // Backend returns: { success: true, count: X, data: [...] }
    const result = response.data?.data || response.data || [];
    console.log("Search results:", Array.isArray(result) ? `${result.length} properties` : result);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Search API error:", error);
    toast.error(error?.response?.data?.message || "Something went wrong while searching");
    throw error;
  }
};

export const getProperty = async (id) => {
  try {
    const response = await api.get(`/residency/${id}`, {
      timeout: 10 * 1000,
    });

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};

export const createUser = async (email, token) => {
  try {
    await api.post(
      `/user/register`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
};

export const bookVisit = async (date, propertyId, email, token) => {
  try {
    await api.post(
      `/user/bookVisit/${propertyId}`,
      {
        email,
        id: propertyId,
        date: dayjs(date).format("DD/MM/YYYY"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
};

export const removeBooking = async (id, email, token) => {
  try {
    const response = await api.post(
      `/user/removeBooking/${id}`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    throw error;
  }
};

export const modifyBooking = async (id, newDate, email, token) => {
  try {
    const response = await api.post(
      `/user/modifyBooking/${id}`,
      {
        email,
        newDate: dayjs(newDate).format("DD/MM/YYYY"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to modify booking");
    throw error;
  }
};

export const toFav = async (id, email, token) => {
  try {
    await api.post(
      `/user/toFav/${id}`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (e) {
    throw e;
  }
};


export const getAllFav = async (email, token) => {
  if (!token) return []
  try {
    const res = await api.post(
      `/user/allFav`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    // Prefer explicit favResidenciesID (array of ids), fallback to mapped ids
    const ids = res?.data?.favResidenciesID || (res?.data?.favResidencies || []).map((r) => r._id || r.id)
    return ids
  } catch (e) {
    // If unauthorized, return empty list (will prompt login elsewhere) without noisy toast
    if (e?.response?.status === 401) return []
    toast.error('Something went wrong while fetching favs')
    throw e
  }
} 


export const getAllBookings = async (email, token) => {
  if (!token) return []
  try {
    const res = await api.post(
      `/user/allBookings`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return res.data["bookedVisits"] || []
  } catch (error) {
    if (error?.response?.status === 401) return []
    toast.error('Something went wrong while fetching bookings')
    throw error
  }
}


export const createResidency = async (data, token) => {
  console.log(data)
  try{
    const res = await api.post(
      `/residency/create`,
      {
        data
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return res.data
  }catch(error)
  {
    toast.error(error?.response?.data?.message || "Failed to create property")
    throw error
  }
}

// Admin API functions
export const getAdminDashboard = async (token) => {
  try {
    const response = await api.get('/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to fetch dashboard data');
    throw error;
  }
};

export const getAdminUsers = async (token) => {
  try {
    const response = await api.get('/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to fetch users');
    throw error;
  }
};

export const toggleBlockUser = async (userId, token) => {
  try {
    const response = await api.put(`/admin/users/${userId}/block`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to update user status');
    throw error;
  }
};

export const getAdminProperties = async (token) => {
  try {
    const response = await api.get('/admin/properties', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to fetch properties');
    throw error;
  }
};

export const togglePropertyStatus = async (propertyId, status, token) => {
  try {
    const response = await api.put(`/admin/properties/${propertyId}/approve`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to update property status');
    throw error;
  }
};

export const getAdminBookings = async (token) => {
  try {
    const response = await api.get('/admin/bookings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to fetch bookings');
    throw error;
  }
};

// Send contact form message
export const sendContactMessage = async (formData) => {
  try {
    const response = await api.post('/contact/send', {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    });
    return response;
  } catch (error) {
    // Error toast is handled by the component
    throw error;
  }
};