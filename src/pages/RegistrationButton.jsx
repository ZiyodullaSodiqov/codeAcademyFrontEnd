import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegistrationButton = ({ olympiadId, isRegistered, onRegistrationChange }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegistration = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: `/olympiads/${olympiadId}` } });
      return;
    }

    setLoading(true);
    try {
      if (isRegistered) {
        navigate(`/olympiads/${olympiadId}/problems`);
      } else {
        await axios.post(
          `http://127.0.0.1:5055/api/olympiads/${olympiadId}/register`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        toast.success('Successfully registered for the olympiad!');
        onRegistrationChange(true);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRegistration}
      disabled={loading}
      className={`registration-button ${isRegistered ? 'registered' : ''}`}
    >
      {loading ? (
        <span>Processing...</span>
      ) : isRegistered ? (
        <span>Enter Olympiad</span>
      ) : (
        <span>Register Now</span>
      )}
    </button>
  );
};

export default RegistrationButton;