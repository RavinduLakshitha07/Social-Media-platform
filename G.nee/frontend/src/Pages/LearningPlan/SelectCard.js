import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './post.css';
import NavBar from '../../Components/NavBar/NavBar';
import { FaCreditCard, FaLock } from 'react-icons/fa';

function SelectCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:8080/learningPlan/${id}`);
        setPlan(response.data);
      } catch (error) {
        console.error('Error fetching plan:', error);
        setError('Failed to load learning plan. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handleCardSelect = (cardType) => {
    setSelectedCard(cardType);
  };

  const handlePayment = () => {
    if (!selectedCard) {
      alert('Please select a payment method');
      return;
    }
    // Here you would typically handle the payment processing
    alert('Payment processing coming soon!');
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(6, 118, 120, 0.7), rgba(8, 8, 77, 0.8))'
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: '20px', 
          textAlign: 'center',
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px'
        }}>
          Loading payment details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(6, 118, 120, 0.7), rgba(8, 8, 77, 0.8))'
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: '20px', 
          textAlign: 'center',
          padding: '20px',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          borderRadius: '10px'
        }}>
          {error}
          <button
            onClick={() => navigate('/allLearningPlan')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#FF6F61',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Return to Learning Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="select-card-container" style={{
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

      <div className="payment-content-wrapper" style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '800px',
        margin: '20px auto',
        padding: '0 15px'
      }}>
        <div className="payment-form-container" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 className="payment-title" style={{
            color: '#333',
            borderBottom: '2px solid #FF6F61',
            paddingBottom: '10px',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center'
          }}>Select Payment Method</h1>

          {plan && (
            <div className="plan-summary" style={{
              backgroundColor: 'rgba(66, 133, 244, 0.1)',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h2 style={{ color: '#333', marginBottom: '10px' }}>{plan.title}</h2>
              <p style={{ color: '#666', marginBottom: '5px' }}>Category: {plan.category}</p>
              <p style={{ color: '#666' }}>Created by: {plan.postOwnerName}</p>
            </div>
          )}

          <div className="card-options" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div
              className={`card-option ${selectedCard === 'visa' ? 'selected' : ''}`}
              onClick={() => handleCardSelect('visa')}
              style={{
                border: `2px solid ${selectedCard === 'visa' ? '#4285F4' : '#ccc'}`,
                borderRadius: '10px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: selectedCard === 'visa' ? 'rgba(66, 133, 244, 0.1)' : 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <FaCreditCard style={{ color: '#4285F4', fontSize: '24px' }} />
                <h3 style={{ margin: 0, color: '#333' }}>Visa</h3>
              </div>
              <p style={{ color: '#666', margin: 0 }}>Pay securely with Visa</p>
            </div>

            <div
              className={`card-option ${selectedCard === 'mastercard' ? 'selected' : ''}`}
              onClick={() => handleCardSelect('mastercard')}
              style={{
                border: `2px solid ${selectedCard === 'mastercard' ? '#4285F4' : '#ccc'}`,
                borderRadius: '10px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: selectedCard === 'mastercard' ? 'rgba(66, 133, 244, 0.1)' : 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <FaCreditCard style={{ color: '#4285F4', fontSize: '24px' }} />
                <h3 style={{ margin: 0, color: '#333' }}>Mastercard</h3>
              </div>
              <p style={{ color: '#666', margin: 0 }}>Pay securely with Mastercard</p>
            </div>
          </div>

          <div className="security-notice" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '30px',
            padding: '15px',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderRadius: '8px'
          }}>
            <FaLock style={{ color: '#4CAF50', fontSize: '20px' }} />
            <p style={{ margin: 0, color: '#4CAF50' }}>
              Your payment information is secure and encrypted
            </p>
          </div>

          <button
            onClick={handlePayment}
            style={{
              backgroundColor: '#FF6F61',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 25px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
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
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectCard; 