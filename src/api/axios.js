// axios
import axios from "axios";

const API_BASE_URL = "http://localhost/DACN_Hutech/backend";

export const loginUser = async ({ email, password }) => {
  const res = await axios.post(`${API_BASE_URL}/login_user.php`, { email, password });
  console.log("Login response:", res.data); 
  return res.data;
};

export const registerUser = async ({ username, email, phone, password }) => {
  const res = await axios.post(`${API_BASE_URL}/register_user.php`, { username, email, phone, password });
  console.log("Register response:", res.data);
  return res.data;
};
