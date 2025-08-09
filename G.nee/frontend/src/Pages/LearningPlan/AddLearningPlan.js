import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './post.css';
import NavBar from '../../Components/NavBar/NavBar';

function AddLearningPlan() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  const navigate = useNavigate();

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setCategory(value);
      setCategoryError('');
    } else {
      setCategoryError('Please enter numbers only');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate category before submission
    if (!/^\d+$/.test(category)) {
      setCategoryError('Please enter a valid category number');
      return;
    }

    setIsSubmitting(true);

    const postOwnerID = localStorage.getItem('userID');
    const postOwnerName = localStorage.getItem('userFullName');

    if (!postOwnerID) {
      alert('Please log in to add a post.');
      navigate('/');
      return;
    }

    try {
      const newPost = {
        title,
        description,
        postOwnerID,
        postOwnerName,
        category
      };

      await axios.post('http://localhost:8080/learningPlan', newPost);
      alert('Learning plan added successfully!');
      navigate('/allLearningPlan');
    } catch (error) {
      console.error('Error adding learning plan:', error);
      alert('Failed to add learning plan.');
    } finally {
      setIsSubmitting(false);
        }
    };

    return (
    <div className="add-post-container" style={{
                position: 'relative',
                minHeight: '100vh',
                backgroundColor: '#0a1f44',
                paddingBottom: '50px',
                paddingTop: '20px'
            }}>
      <div className="gradient-overlay" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(6, 118, 120, 0.7), rgba(8, 8, 77, 0.8))',
                    zIndex: 1
                }}></div>

                <NavBar />

      <div className="post-content-wrapper" style={{
                    position: 'relative',
                    zIndex: 2,
        maxWidth: '800px',
                    margin: '20px auto',
        padding: '0 15px'
      }}>
        <div className="post-form-container" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 className="post-form-title" style={{
            color: '#333',
            borderBottom: '2px solid #FF6F61',
            paddingBottom: '10px',
            fontSize: '32px',
            fontWeight: 'bold',
                        marginBottom: '20px',
            textAlign: 'center'
          }}>Add Learning Plan</h1>

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Title</label>
              <input
                className="form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter plan title"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Category</label>
                        <input
                className="form-input"
                            type="text"
                value={category}
                onChange={handleCategoryChange}
                placeholder="Enter category number"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${categoryError ? '#ff4444' : '#ccc'}`,
                  fontSize: '16px',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              />
              {categoryError && (
                <p style={{ 
                  color: '#ff4444', 
                  fontSize: '14px', 
                  marginTop: '5px',
                  marginBottom: '0'
                }}>
                  {categoryError}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Description</label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your learning plan"
                required
                rows={4}
                            style={{
                  width: '100%',
                                padding: '12px',
                  borderRadius: '8px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                  resize: 'vertical'
                            }}
                        />
                    </div>

            <button
              type="submit"
              disabled={isSubmitting}
                         style={{
                             backgroundColor: '#FF6F61',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '12px 25px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                                        transition: 'all 0.3s ease',
                width: '100%',
                marginTop: '20px'
                                    }}
                                    onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = '#E64A45';
                                        e.target.style.transform = 'translateY(-2px)';
                }
                                    }}
                                    onMouseOut={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = '#FF6F61';
                                        e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add Learning Plan'}
            </button>
          </form>
                </div>
            </div>
        </div>
    );
}

export default AddLearningPlan;