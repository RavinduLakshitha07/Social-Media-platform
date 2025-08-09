import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './post.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import NavBar from '../../Components/NavBar/NavBar';

function MyLearningPlan() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/learningPlan');
        const userPosts = response.data.filter(post => post.postOwnerID === userId);
        setPosts(userPosts);
        setFilteredPosts(userPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        (post.category && post.category.toLowerCase().includes(query))
    );
    setFilteredPosts(filtered);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this learning plan?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/learningPlan/${id}`);
        alert('Learning plan deleted successfully!');
        setFilteredPosts(filteredPosts.filter((post) => post.id !== id));
        setPosts(posts.filter((post) => post.id !== id));
      } catch (error) {
        console.error('Error deleting learning plan:', error);
        alert('Failed to delete learning plan.');
      }
    }
  };

  const handleUpdate = (id) => {
    window.location.href = `/updateLearningPlan/${id}`;
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
          background: 'linear-gradient(135deg, rgba(6, 118, 120, 0.7), rgba(8, 8, 77, 0.8))', 
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
              placeholder="Search plans by title, description, or category"
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
            onClick={() => (window.location.href = '/addLearningPlan')}
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
            {filteredPosts.length === 0 ? (
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
                <p className='not_found_msg' style={{ color: '#555', fontSize: '18px', margin: '20px 0' }}>No learning plans found. Please create a new learning plan.</p>
                <button 
                  className='not_found_btn' 
                  onClick={() => (window.location.href = '/addLearningPlan')}
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
                >Create New Learning Plan</button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="post-card" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '15px',
                  padding: '25px',
                  marginBottom: '20px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <h2 style={{ 
                      color: '#333', 
                      fontSize: '24px', 
                      margin: '0',
                      fontWeight: 'bold'
                    }}>{post.title}</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleUpdate(post.id)}
                        style={{
                          backgroundColor: '#4285F4',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#3367D6';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#4285F4';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        style={{
                          backgroundColor: '#FF6F61',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.3s ease'
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
                        <RiDeleteBin6Fill /> Delete
                      </button>
                    </div>
                  </div>
                  <p style={{ 
                    color: '#4285F4',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(66, 133, 244, 0.1)',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    display: 'inline-block',
                    marginBottom: '15px'
                  }}>{post.category}</p>
                  <p style={{ 
                    color: '#555',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    marginBottom: '15px'
                  }}>{post.description}</p>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#777',
                    fontSize: '14px'
                  }}>
                    <span>Created by: {post.postOwnerName}</span>
                    <span>Created at: {post.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyLearningPlan;
