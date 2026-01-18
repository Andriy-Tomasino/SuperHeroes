import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSuperhero } from '../context/SuperheroContext';
import './SuperheroList.css';

const SuperheroList = () => {
  const { getSuperheroes, deleteSuperhero, getImageUrl, loading, error } = useSuperhero();
  const [superheroes, setSuperheroes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadSuperheroes();
  }, [pagination.page]);

  const loadSuperheroes = async () => {
    try {
      const data = await getSuperheroes(pagination.page, pagination.limit);
      setSuperheroes(data.data);
      setPagination({
        ...pagination,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (err) {
      console.error('Failed to load superheroes:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this superhero?')) {
      try {
        await deleteSuperhero(id);
        loadSuperheroes();
      } catch (err) {
        console.error('Failed to delete superhero:', err);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  if (loading && superheroes.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="superhero-list">
      <div className="list-header">
        <h2>Superheroes List</h2>
        <Link to="/superhero/new" className="btn btn-primary">
          Create Superhero
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {superheroes.length === 0 && (
        <div className="empty-state">
          <p style={{ fontWeight: 'bold' }}>Planet in danger - 0 Superheroes</p>
        </div>
      )}

      {superheroes.length > 0 && (
        <>
          <div className="superhero-grid">
            {superheroes.map((superhero) => (
              <div key={superhero.id} className="superhero-card">
                <Link to={`/superhero/${superhero.id}`} className="card-link">
                  <div className="card-image">
                    {superhero.image ? (
                      <img
                        src={getImageUrl(superhero.id, superhero.image)}
                        alt={superhero.nickname}
                      />
                    ) : (
                      <div className="no-image">No image</div>
                    )}
                  </div>
                  <div className="card-content">
                    <h3>{superhero.nickname}</h3>
                  </div>
                </Link>
                <div className="card-actions">
                  <Link
                    to={`/superhero/${superhero.id}/edit`}
                    className="btn btn-success"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(superhero.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SuperheroList;
