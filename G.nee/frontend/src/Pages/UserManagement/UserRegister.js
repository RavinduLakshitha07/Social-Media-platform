import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './user.css';
import logo from './img/hat.png';

function UserRegister() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullname: '',
        bio: '',
        skills: new Set()
    });
    const [skillInput, setSkillInput] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSkillAdd = () => {
        if (skillInput.trim() && !formData.skills.has(skillInput.trim())) {
            setFormData({
                ...formData,
                skills: new Set([...formData.skills, skillInput.trim()])
            });
            setSkillInput('');
        }
    };

    const handleSkillRemove = (skillToRemove) => {
        const newSkills = new Set(formData.skills);
        newSkills.delete(skillToRemove);
        setFormData({
            ...formData,
            skills: newSkills
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                skills: Array.from(formData.skills)
            };

            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userID', data.id);
                localStorage.setItem('userType', 'regular');
                navigate('/allPost');
            } else {
                const errorData = await response.json();
                navigate('/error?message=' + encodeURIComponent(errorData.message || 'Registration failed'));
            }
        } catch (error) {
            navigate('/error?message=' + encodeURIComponent('An error occurred during registration'));
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <img src={logo} alt="Logo" className="logo" />
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="fullname"
                            placeholder="Full Name"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="bio"
                            placeholder="Tell us about yourself..."
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={4}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <div className="skills-input">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="Add your cooking skills"
                            />
                            <button type="button" onClick={handleSkillAdd}>Add</button>
                        </div>
                        <div className="skills-list">
                            {Array.from(formData.skills).map((skill, index) => (
                                <span key={index} className="skill-tag">
                                    {skill}
                                    <button type="button" onClick={() => handleSkillRemove(skill)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="register-button">
                        Create Account
                    </button>
                    <div className="login-link-container">
                        <p>Already have an account? <span onClick={() => navigate('/login')} className="login-link">Sign in</span></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserRegister;
