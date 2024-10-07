import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../../redux/user/userSlice";


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading , error:errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username || !formData.password) return dispatch(signInFailure('Please fill all fields'));
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false) dispatch(signInFailure(data.message));
      else if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };


  return(
    <div>
      Sign In
    </div>
  )
}