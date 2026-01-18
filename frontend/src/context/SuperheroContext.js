import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const SuperheroContext = createContext();

export const useSuperhero = () => {
  const context = useContext(SuperheroContext);
  if (!context) {
    throw new Error('useSuperhero must be used within SuperheroProvider');
  }
  return context;
};

export const SuperheroProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const handleError = (err) => {
    const message = err.response?.data?.message || err.message || 'Щось пішло не так';
    setError(message);
    console.error('Error:', err);
    return message;
  };

  const getSuperheroes = useCallback(async (page = 1, limit = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/superheroes', {
        params: { page, limit },
      });
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getSuperhero = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/superheroes/${id}`);
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const createSuperhero = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/superheroes', data);
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const updateSuperhero = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/superheroes/${id}`, data);
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const deleteSuperhero = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/superheroes/${id}`);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const addImage = useCallback(async (id, file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post(`/superheroes/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const deleteImage = useCallback(async (superheroId, imageId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/superheroes/${superheroId}/images/${imageId}`);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getImageUrl = useCallback((superheroId, image) => {
    if (!image || !image.path) return null;
    // Use the path from the database, which should be relative to uploads
    const baseUrl = API_URL.replace('/api', '');
    return image.path.startsWith('http') ? image.path : `${baseUrl}${image.path}`;
  }, [API_URL]);

  const value = {
    loading,
    error,
    getSuperheroes,
    getSuperhero,
    createSuperhero,
    updateSuperhero,
    deleteSuperhero,
    addImage,
    deleteImage,
    getImageUrl,
    clearError: () => setError(null),
  };

  return (
    <SuperheroContext.Provider value={value}>
      {children}
    </SuperheroContext.Provider>
  );
};
