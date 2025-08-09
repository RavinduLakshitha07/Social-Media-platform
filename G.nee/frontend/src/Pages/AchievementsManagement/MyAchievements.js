import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Modal from 'react-modal';
import NavBar from '../../Components/NavBar/NavBar'
import { IoIosCreate } from "react-icons/io";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

Modal.setAppElement('#root');

function MyAchievements() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const userId = localStorage.getItem('userID');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch achievements data from the server
  useEffect(() => {
    fetch('http://localhost:8080/achievements')
      .then((response) => response.json())
      .then((data) => {
        const userFilteredData = data.filter((achievement) => achievement.postOwnerID === userId);
        setProgressData(userFilteredData);
        setFilteredData(userFilteredData);
      })
      .catch((error) => console.error('Error fetching Achievements data:', error));
  }, [userId]);

  // Function to handle delete action
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Achievement?');
    if (!confirmDelete) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/achievements/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Achievement deleted successfully!');
        setFilteredData(filteredData.filter((progress) => progress.id !== id));
        setProgressData(progressData.filter((progress) => progress.id !== id));
      } else {
        alert('Failed to delete Achievement.');
      }
    } catch (error) {
      console.error('Error deleting Achievement:', error);
      alert('Failed to delete Achievement.');
    }
  };
/// Function to handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = progressData.filter(
      (achievement) =>
        achievement.title.toLowerCase().includes(query) ||
        achievement.description.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const getChartData = (progress) => ({
    labels: ['Progress'],
    datasets: [
      {
        data: [parseInt(progress.category), 100 - parseInt(progress.category)],
        backgroundColor: ['#FF6F61', '#E0E0E0'],
        borderColor: ['#FF6F61', '#E0E0E0'],
        borderWidth: 1,
      },
    ],
  });

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

  return (
    <div>
      <div className='continer' style={{ 
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        paddingBottom: '50px',
        paddingTop: '20px'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.7), rgba(219, 112, 147, 0.8))', 
          zIndex: 1 
        }}></div>
        
        <NavBar />
        
        <div className='continSection' style={{ 
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          margin: '20px auto',
          padding: '0 15px',
          marginTop: '80px',
        }}>
          <div className='searchinput' style={{ 
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}>
            <input
              type="text"
              className="Auth_input"
              placeholder="Search achievements by title or description"
              value={searchQuery}
              onChange={handleSearch}
              style={{ 
                width: '70%', 
                padding: '12px', 
                borderRadius: '30px', 
                border: '1px solid #ccc', 
                fontSize: '16px', 
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}
            />
          </div>
          
          <div className='add_new_btn' 
            onClick={() => (window.location.href = '/addAchievements')}
            style={{
              backgroundColor: '#FF6F61',
              color: '#fff',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 0 20px auto',
              boxShadow: '0 4px 12px rgba(255, 111, 97, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#E64A45';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 14px rgba(255, 111, 97, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6F61';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 111, 97, 0.3)';
            }}
          >
            <IoIosCreate className='add_new_btn_icon' style={{ fontSize: '24px' }}/>
          </div>
          
          <div className='post_card_continer'>
            {filteredData.length === 0 ? (
              <div className='not_found_box' style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                margin: '40px auto',
                maxWidth: '500px'
              }}>
                <div className='not_found_img'></div>
                <p className='not_found_msg' style={{ color: '#555', fontSize: '18px', margin: '20px 0' }}>No achievements found. Please create a new achievement.</p>
                <button 
                  className='not_found_btn' 
                  onClick={() => (window.location.href = '/addAchievements')}
                  style={{
                    backgroundColor: '#4285F4',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 25px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 8px rgba(66, 133, 244, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#3367D6';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 14px rgba(66, 133, 244, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#4285F4';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 8px rgba(66, 133, 244, 0.3)';
                  }}
                >Create New Achievement</button>
              </div>
            ) : (
              filteredData.map((progress) => (
                <div key={progress.id} className='post_card' style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  marginBottom: '30px',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <div className='user_details_card' style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    paddingBottom: '10px'
                  }}>
                    <div className='name_section_post_achi'>
                      <p className='name_section_post_owner_name' style={{ 
                        fontWeight: 'bold', 
                        color: '#333',
                        margin: 0
                      }}>{progress.postOwnerName}</p>
                      <div>
                        <p className='date_card_dte' style={{
                          fontSize: '14px',
                          color: '#666',
                          margin: '5px 0 0 0'
                        }}>{progress.date}</p>
                      </div>
                    </div>
                    {progress.postOwnerID === userId && (
                      <div>
                        <div className='action_btn_icon_post' style={{ display: 'flex', gap: '10px' }}>
                          <FaEdit
                            onClick={() => (window.location.href = `/updateAchievements/${progress.id}`)}
                            className='action_btn_icon'
                            style={{
                              color: '#4285F4',
                              cursor: 'pointer',
                              fontSize: '38px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.color = '#3367D6';
                              e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.color = '#4285F4';
                              e.target.style.transform = 'scale(1)';
                            }}
                          />
                          <RiDeleteBin6Fill
                            onClick={() => handleDelete(progress.id)}
                            className='action_btn_icon'
                            style={{
                              color: '#FF6F61',
                              cursor: 'pointer',
                              fontSize: '38px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.color = '#E64A45';
                              e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.color = '#FF6F61';
                              e.target.style.transform = 'scale(1)';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        color: '#333',
                        margin: '0 0 10px 0',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>{progress.title}</h3>
                      <p style={{ 
                        color: '#666',
                        margin: '0 0 15px 0',
                        lineHeight: '1.5'
                      }}>{progress.description}</p>
                    </div>
                    <div style={{ 
                      width: '100px', 
                      height: '100px', 
                      position: 'relative',
                      flexShrink: 0
                    }}>
                      <Pie data={getChartData(progress)} options={chartOptions} />
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#333'
                      }}>
                        {progress.category}%
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for displaying full image */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '0',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'transparent'
          }
        }}
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain'
            }}
          />
        )}
      </Modal>
    </div>
  );
}

export default MyAchievements;
