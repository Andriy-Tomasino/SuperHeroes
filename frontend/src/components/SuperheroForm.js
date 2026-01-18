import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSuperhero } from '../context/SuperheroContext';
import './SuperheroForm.css';

const SuperheroForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const {
    getSuperhero,
    createSuperhero,
    updateSuperhero,
    addImage,
    deleteImage,
    getImageUrl,
    loading,
    error,
  } = useSuperhero();

  const [formData, setFormData] = useState({
    nickname: '',
    real_name: '',
    origin_description: '',
    superpowers: '',
    catch_phrase: '',
  });

  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadSuperhero();
    }
  }, [id]);

  const loadSuperhero = async () => {
    try {
      const data = await getSuperhero(id);
      setFormData({
        nickname: data.nickname || '',
        real_name: data.real_name || '',
        origin_description: data.origin_description || '',
        superpowers: data.superpowers || '',
        catch_phrase: data.catch_phrase || '',
      });
      setImages(data.images || []);
    } catch (err) {
      console.error('Failed to load superhero:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setFormError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError('File size should not exceed 5MB');
        return;
      }
      setNewImage(file);
      setFormError('');
    }
  };

  const handleUploadImage = async () => {
    if (!newImage) return;

    try {
      const superheroId = id || (await handleSubmit(false))?.id;
      if (!superheroId) return;

      await addImage(superheroId, newImage);
      setNewImage(null);
      if (isEdit) {
        loadSuperhero();
      } else {
        navigate(`/superhero/${superheroId}`);
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
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

  const handleSubmit = async (shouldNavigate = true) => {
    setFormError('');

    // Validation
    if (!formData.nickname.trim()) {
      setFormError('Nickname field is required');
      return;
    }
    if (!formData.real_name.trim()) {
      setFormError('Real name field is required');
      return;
    }
    if (!formData.origin_description.trim()) {
      setFormError('Origin description field is required');
      return;
    }
    if (!formData.superpowers.trim()) {
      setFormError('Superpowers field is required');
      return;
    }
    if (!formData.catch_phrase.trim()) {
      setFormError('Catch phrase field is required');
      return;
    }

    try {
      let result;
      if (isEdit) {
        result = await updateSuperhero(id, formData);
      } else {
        result = await createSuperhero(formData);
      }

      if (shouldNavigate) {
        if (newImage && result.id) {
          await addImage(result.id, newImage);
        }
        navigate(`/superhero/${result.id}`);
      } else {
        return result;
      }
    } catch (err) {
      console.error('Failed to save superhero:', err);
      setFormError(err.response?.data?.message || 'Error saving superhero');
    }
  };

  return (
    <div className="superhero-form">
      <div className="form-header">
        <Link to={isEdit ? `/superhero/${id}` : '/'} className="btn btn-danger">
          ← Back
        </Link>
        <h2>{isEdit ? 'Edit Superhero' : 'Create New Superhero'}</h2>
      </div>

      {(error || formError) && (
        <div className="error">{error || formError}</div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="form-content"
      >
        <div className="form-group">
          <label htmlFor="nickname">Nickname *</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="real_name">Real Name *</label>
          <input
            type="text"
            id="real_name"
            name="real_name"
            value={formData.real_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="origin_description">Origin Description *</label>
          <textarea
            id="origin_description"
            name="origin_description"
            value={formData.origin_description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="superpowers">Superpowers *</label>
          <textarea
            id="superpowers"
            name="superpowers"
            value={formData.superpowers}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="catch_phrase">Catch Phrase *</label>
          <input
            type="text"
            id="catch_phrase"
            name="catch_phrase"
            value={formData.catch_phrase}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Add Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {newImage && (
            <div className="image-preview">
              <p>Selected: {newImage.name}</p>
              {isEdit && (
                <button
                  type="button"
                  onClick={handleUploadImage}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  Upload
                </button>
              )}
            </div>
          )}
        </div>

        {isEdit && images.length > 0 && (
          <div className="form-group">
            <label>Existing Images</label>
            <div className="existing-images">
              {images.map((image) => (
                <div key={image.id} className="image-item">
                  <img
                    src={getImageUrl(id, image)}
                    alt="Superhero"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id)}
                    className="btn btn-danger btn-small"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <Link
            to={isEdit ? `/superhero/${id}` : '/'}
            className="btn btn-danger"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SuperheroForm;
