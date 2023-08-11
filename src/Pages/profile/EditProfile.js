import React, { useEffect, useState } from 'react';
import './profile.scss';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/auth/authSlice';
import Loader from '../../components/Loader/loader';
import Card from '../../components/Card/Card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUser } from '../../services/authService';
import ChangePassword from '../../components/changePassword/ChangePassword';

const EditProfile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector(selectUser);
  const navigate = useNavigate()
  const { email } = user;

  useEffect(() => {
    if(!email) {
      navigate("/profile")
    }
  },[email, navigate])

  const initialState = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    bio: user?.bio,
    photo: user?.photo,
  }
  const [profile, setProfile] = useState(initialState)
  const [profileImage, setProfileImage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0])
  }

  const saveProfile = async(e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      //handle image upload
      let imageUrl;
      if(profileImage && (
        profileImage.type === 'image/jpeg' ||
        profileImage.type === 'image/png' ||
        profileImage.type === 'image/jpg' 
      )) {
        const image = new FormData()
        image.append('file', profileImage)
        image.append('cloud_name', 'dc6noyyig')
        image.append('upload_preset', 'kpeenwkr')

        //First save to cloudinary
        const response = await fetch("https://api.cloudinary.com/v1_1/dc6noyyig/image/upload", { method: "post", body: image });
        const imageData = await response.json();

        imageUrl = imageData.url.toString();
      }
        //Save profile
        const formData = {
           name: profile.name,
           phone: profile.phone,
           bio: profile.bio,
           photo: profileImage ? imageUrl : profile.photo,
        }
        const data = await updateUser(formData)
        toast.success("User Updated successfully")
        navigate("/profile")
        setIsLoading(false)
      
    } catch (error) {
      console.log(error);
      setIsLoading(false)
      toast.error(error.message)
    }

  }

  return (
    <div className='profile --my2'>
      {isLoading && <Loader /> }

      <Card cardClass={"card --flex-dir-column"}>
          <span className='profile-photo'>
            <img src={user?.photo} alt="profile pic" />
          </span>


          <form className='--form-control --m' onSubmit={saveProfile}>
          <span className='profile-data'>
           <p>
            <label>Name: </label>
            <input type="text" name="name" onChange={handleInputChange} value={profile?.name} />
           </p>
           <p>
           <label>Email: </label>
            <input type="email" name="email" value={profile?.email} disabled />
            <br />
            <code>Email cannot be changed</code>
           </p>
           <p>
            <label>Phone: </label>
            <input type="phone" name="phone" onChange={handleInputChange} value={profile?.phone} />
          </p>
           <p> 
           <label>Bio: </label> <br/>

            <textarea name="bio" onChange={handleInputChange} value={profile?.bio} cols='30' rows="10"> </textarea>
          </p>
          <p>
          <label>Photo: </label>
            <input type="file" name="image" onChange={handleImageChange}  />
          </p>
           <div>
              <button className='--btn --btn-primary'>Save Changes</button>
            
           </div>
          </span>
          </form>
        </Card>

        <br />
        <ChangePassword />
    </div>
  )
}

export default EditProfile
