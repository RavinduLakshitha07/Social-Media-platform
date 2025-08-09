import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './AddAchievements.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function AddAchievements() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    postOwnerID: '',
    category: '0',
    postOwnerName: '',
  });

  const chartData = {
    labels: ['Achievement Progress'],
    datasets: [
      {
        data: [parseInt(formData.category), 100 - parseInt(formData.category)],
        backgroundColor: ['#FF6F61', '#E0E0E0'],
        borderColor: ['#FF6F61', '#E0E0E0'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.data[0] + '%';
          }
        }
      }
    },
    cutout: '70%',
  };

  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      setFormData((prevData) => ({ ...prevData, postOwnerID: userId }));
      fetch(`http://localhost:8080/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.fullname) {
            setFormData((prevData) => ({ ...prevData, postOwnerName: data.fullname }));
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = true;
    submitButton.innerText = 'Adding Achievement...';

    try {
      const response = await fetch('http://localhost:8080/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Achievement added successfully!');
        window.location.href = '/myAchievements';
      } else {
        throw new Error('Failed to add Achievement');
      }
    } catch (error) {
      alert('Failed to add Achievement. Please try again.');
      submitButton.disabled = false;
      submitButton.innerText = 'Add Achievement';
    }
  };

  return (
    <div className="add-post-container" style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      paddingBottom: '50px',
      paddingTop: '20px'
    }}>
      <div className="gradient-overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.7), rgba(219, 112, 147, 0.8))',
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
          }}>Add Achievement</h1>

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Title</label>
              <input
                className="form-input"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter achievement title"
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
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Progress</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <input
                  type="range"
                  name="category"
                  min="0"
                  max="100"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    flex: 1,
                    height: '8px',
                    WebkitAppearance: 'none',
                    background: '#ddd',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                />
                <span style={{ 
                  minWidth: '60px', 
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  {formData.category}%
                </span>
              </div>
              <div style={{ 
                width: '150px', 
                height: '150px', 
                margin: '20px auto',
                position: 'relative'
              }}>
                <Pie data={chartData} options={chartOptions} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  {formData.category}%
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Date</label>
              <input
                className="form-input"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
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
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Description</label>
              <textarea
                className="form-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your achievement"
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
              id="submit-button"
              type="submit"
              style={{
                backgroundColor: '#FF6F61',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                marginTop: '20px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#E64A45';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#FF6F61';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Add Achievement
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAchievements;
