import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSuperhero } from '../context/SuperheroContext';
import './SuperheroDetail.css';

const SuperheroDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSuperhero, deleteSuperhero, deleteImage, getImageUrl, loading, error } = useSuperhero();
  const [superhero, setSuperhero] = useState(null);

  useEffect(() => {
    loadSuperhero();
  }, [id]);

  const loadSuperhero = async () => {
    try {
      const data = await getSuperhero(id);
      setSuperhero(data);
    } catch (err) {
      console.error('Failed to load superhero:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this superhero?')) {
      try {
        await deleteSuperhero(id);
        navigate('/');
      } catch (err) {
        console.error('Failed to delete superhero:', err);
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(id, imageId);
        loadSuperhero();
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }
  };

  if (loading && !superhero) {
    return <div className="loading">Loading...</div>;
  }

  if (!superhero) {
    return (
      <div className="error-state">
        <p>Superhero not found</p>
        <Link to="/" className="btn btn-danger">
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="superhero-detail">
      <div className="detail-header">
        <Link to="/" className="btn btn-danger">
          ← Back to List
        </Link>
        <div className="header-actions">
          <Link to={`/superhero/${id}/edit`} className="btn btn-success">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="detail-content">
        <div className="detail-main">
          <h1>{superhero.nickname}</h1>
          <div className="detail-section">
            <h3>Real Name</h3>
            <p>{superhero.real_name}</p>
          </div>
          <div className="detail-section">
            <h3>Origin Description</h3>
            <p>{superhero.origin_description}</p>
          </div>
          <div className="detail-section">
            <h3>Superpowers</h3>
            <p>{superhero.superpowers}</p>
          </div>
          <div className="detail-section">
            <h3>Catch Phrase</h3>
            <p className="catch-phrase">"{superhero.catch_phrase}"</p>
          </div>
        </div>

        <div className="detail-images">
          <h2>Images</h2>
          {superhero.images && superhero.images.length > 0 ? (
            <div className="images-grid">
              {superhero.images.map((image) => (
                <div key={image.id} className="image-item">
                  <img
                    src={getImageUrl(superhero.id, image)}
                    alt={superhero.nickname}
                  />
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="btn btn-danger btn-small"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-images">No images</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperheroDetail;
