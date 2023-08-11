import React, { useState } from 'react';
import './changePassword.scss';
import { toast } from 'react-toastify';
import { changePassword } from '../../services/authService';
import Card from '../Card/Card';
import { useNavigate } from 'react-router-dom';

const initialState = {
  oldPassword: "",
  password: "",
  password2: "",
};
const ChangePassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialState);

  const { oldPassword, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const changePass = async(e) => {
    e.preventDefault();

    if(password !== password2) {
      return toast.error("New passwords do not match");
    }

    const formData = {
      oldPassword,
      password
    }
    const data = await changePassword(formData)
    toast.success(data)
    setFormData(initialState)
    navigate("/profile")
  }
  return (
    <div className='change-password'>
      <Card cardClass={"password-card"}>
        <h3>Change Password</h3>
        <form onSubmit={changePass} className='--form-control'>
        <input
              type="password"
              value={oldPassword}
              onChange={handleInputChange}
              placeholder="Old Password"
              required
              name="oldPassword"
            />
        <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={handleInputChange}
              required
              name="password"
            />
        <input
              type="password"
              placeholder="Confirm New Password"
              value={password2}
              onChange={handleInputChange}
              required
              name="password2"
            />
       <button type="submit" className='--btn --btn-primary'>Reset Password</button>
        </form>
      </Card>
      
    </div>
  )
}

export default ChangePassword
