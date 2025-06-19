import { Link, useNavigate } from "react-router-dom";
import Logo from "../Header/Logo";
import { SocialIcons } from "../Footer/FooterBottom";
import { Container } from "react-bootstrap";
import styles from "./SignInSignUpForm.module.css";
import signInImage from "../../assets/signIn.webp";
import { useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, clearError } from "../../slices/authSlice";

function SignInSignUpForm() {
  const [signin, setSignin] = useState(true);
  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, user } = useSelector((state) => state.auth);

  const toggleSignInUp = () => {
    setSignin((prev) => !prev);
    setFormError("");
    dispatch(clearError());
  };

  const validateForm = (name, email, password) => {
    if (!signin && (!name || name.trim() === "")) {
      return "Name is required";
    }
    if (!email || email.trim() === "") {
      return "Email is required";
    }
    if (!password || password.trim() === "") {
      return "Password is required";
    }
    return null;
  };

  const getErrorMessage = (error) => {
    if (!error) return "";
    
    const errorString = error.toString().toLowerCase();
    
    // Handle different error scenarios
    if (errorString.includes("email") && (errorString.includes("exist") || errorString.includes("already") || errorString.includes("registered"))) {
      return "This email is already registered";
    }
    
    if (errorString.includes("invalid") && (errorString.includes("credential") || errorString.includes("password") || errorString.includes("email"))) {
      return "Invalid email or password. Please check your credentials and try again.";
    }
    
    if (errorString.includes("password") && errorString.includes("incorrect")) {
      return "Incorrect password. Please try again.";
    }
    
    if (errorString.includes("validation") || errorString.includes("required")) {
      return "Please fill in all required fields correctly.";
    }
    
    if (errorString.includes("network") || errorString.includes("connection")) {
      return "Network error. Please check your connection and try again.";
    }
    
    // Return the original error if no specific match found
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(""); // Clear previous errors
    dispatch(clearError()); // Clear Redux errors
    
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    // Validate form fields
    const validationError = validateForm(name, email, password);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      if (signin) {
        // Handle Login
        const result = await dispatch(loginUser({ email, password }));
        
        if (loginUser.fulfilled.match(result)) {
          // Login successful - redirect to home
          navigate("/");
        }
        // If login fails, error will be displayed via Redux state
        
      } else {
        // Handle Registration
        const result = await dispatch(registerUser({ name, email, password }));
        
        if (registerUser.fulfilled.match(result)) {
          // Registration successful - switch to login form
          setSignin(true);
          setFormError("");
          // Show success message
          alert("Registration successful! Please log in with your credentials.");
        }
        // If registration fails, error will be displayed via Redux state
      }
      
    } catch (err) {
      console.error("Unexpected error:", err);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.bg}>
      <Container className={styles.container}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <Logo />
          </Link>
          <div className={styles.formContent}>
            <h1 className={styles.heading}>
              {signin ? "Welcome back!" : "Create Account!"}
            </h1>

            <form onSubmit={handleSubmit} className={styles.form}>
              {!signin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
              <button type="submit" disabled={isLoading}>
                {isLoading 
                  ? (signin ? "Logging in..." : "Signing up...") 
                  : (signin ? "Log in" : "Sign up")
                }
              </button>
            </form>

            {/* Display form errors or Redux errors */}
            {(formError || error) && (
              <div style={{ 
                color: "red", 
                marginTop: "10px", 
                padding: "8px", 
                backgroundColor: "#ffe6e6", 
                border: "1px solid #ffcccc", 
                borderRadius: "4px",
                fontSize: "14px"
              }}>
                {formError || getErrorMessage(error)}
              </div>
            )}

            <p className={styles.paragraph}>
              {signin
                ? "Don't have an account yet? "
                : "Already have an account? "}
              <button className={styles.signupBtn} onClick={toggleSignInUp}>
                {signin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
          <SocialIcons />
        </div>
        <div className={styles.right}>
          <img
            src={signInImage}
            alt={signin ? "Sign in image" : "Sign up image"}
            className={styles.sinInImage}
            loading="lazy"
          />
        </div>
      </Container>
    </div>
  );
}

export default SignInSignUpForm;