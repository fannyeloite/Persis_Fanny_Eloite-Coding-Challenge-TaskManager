// src/components/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./FormStyles.css";
import registerBg from '../assets/registerbg.jpg';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (location.state) {
      setFormData({
        email: location.state.email || "",
        password: location.state.password || "",
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/api/users/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    if (response.ok) {
      const data = await response.json();
      const { token, role } = data;

      // ✅ Store token and role
      localStorage.setItem("token", token);
      localStorage.setItem("email", formData.email);
      localStorage.setItem("role", role);

      // ✅ Store user details in sessionStorage (needed for CustomerHome)
      const userObj = {
        email: formData.email,
        name: data.name || "User"
      };
      sessionStorage.setItem("user", JSON.stringify(userObj));

      alert("Login successful");

      // ✅ Role-based navigation
      if (role === "ADMIN") {
        navigate("/manage-tasks", { state: { email: formData.email } });
      } else {
        navigate("/AddingTasks", { state: { email: formData.email } });
      }
    } else {
      const errMsg = await response.text();
      alert(errMsg || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Error logging in");
  }
};


//   const handleLogin = async (e) => {
//   e.preventDefault();

//   try {
//     const response = await fetch("http://localhost:8080/api/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ email, password })
//     });

//     if (response.ok) {
//       const data = await response.json();
//       const { token, role } = data;

//       // ✅ Store token and role
//       localStorage.setItem("token", token);
//       localStorage.setItem("email", email);
//       localStorage.setItem("role", role);

//       alert("Login successful");

//       // ✅ Role-based navigation
//       if (role === "ADMIN") {
//         navigate("/AdminHome", { state: { email } });
//       } else if (role === "RESTAURANTOWNER") {
//         navigate("/RestaurantHome", { state: { email } });
//       } else {
//         navigate("/CustomerHome", { state: { email } });
//       }
//     } else {
//       const errMsg = await response.text();
//       alert(errMsg || "Login failed");
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     alert("Error logging in");
//   }
// };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(`http://localhost:8080/api/users/${formData.email}`);
  //     if (response.ok) {
  //       const user = await response.json();

  //       if (user.password === formData.password) {
          
  //         alert("Login Successful!");

  //         const role = user.role?.toLowerCase(); // normalize to lowercase
  //         const email = user.email;
  //         sessionStorage.setItem("user", JSON.stringify({ email: user.email, name: user.name }));


  //         // ✅ Navigate based on role
  //         if (role === "admin") {
  //           navigate("/adminhome", { state: { email } });
  //         } else if (role === "restaurantowner") {
  //           navigate("/restauranthome", { state: { email } });
  //         } else if (role === "customer") {
  //           navigate("/select-category", { state: { email } });
  //         } else {
  //           alert("Role not recognized!");
  //           console.log("Received role:", user.role);
  //         }

  //       } else {
  //         alert("Invalid Password");
  //       }
  //     } else {
  //       alert("User Not Found");
  //     }
  //   } catch (err) {
  //     console.error("Login Error:", err);
  //     alert("Error while logging in");
  //   }
  // };

  return (
    <div
      className="container-fluid main-container"
      style={{
        backgroundImage: `url(${registerBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="login-wrapper">
        <div className="login-card">
          <h3 className="form-title mb-4">Sign In</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
            <div className="mb-3 d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Sign In
              </button>
              <button type="reset" className="btn btn-secondary">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
