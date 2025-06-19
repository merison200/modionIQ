import { Link } from "react-router-dom";
import Logo from "../Header/Logo";
import { SocialIcons } from "../Footer/FooterBottom";
import { Container } from "react-bootstrap";
import styles from "./SignInSignUpForm.module.css";
import signInImage from "../../assets/signIn.webp";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { submitContactForm, resetContactForm } from "../../slices/contactSlice";

function ContactUs() {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contactUs);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    const formData = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    dispatch(submitContactForm(formData));
    form.reset();
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(resetContactForm());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  return (
    <div className={styles.bg}>
      <Container className={styles.container}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <Logo />
          </Link>
          <div className={styles.formContent}>
            <h1 className={styles.heading}>Contact Us now!</h1>
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className={styles.form}
            >
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
              />
              <textarea
                name="message"
                placeholder="Your message"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
              {success && (
                <p style={{ color: "green", marginTop: 10 }}>
                  Message sent successfully!
                </p>
              )}
              {error && (
                <p style={{ color: "red", marginTop: 10 }}>{error}</p>
              )}
            </form>
          </div>
          <SocialIcons />
        </div>
        <div className={styles.right}>
          <img
            src={signInImage}
            className={styles.sinInImage}
            loading="lazy"
            alt="Contact Us Visual"
          />
        </div>
      </Container>
    </div>
  );
}

export default ContactUs;


/*
import { Link } from "react-router-dom";
import Logo from "../Header/Logo";
import { SocialIcons } from "../Footer/FooterBottom";
import { Container } from "react-bootstrap";
import styles from "./SignInSignUpForm.module.css";
import signInImage from "../../assets/signIn.webp";

function ContactUs() {
  const handleLogin = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <div className={styles.bg}>
        <Container className={styles.container}>
          <div className={styles.left}>
            <Link to="/" className={styles.logo}>
              <Logo />
            </Link>
            <div className={styles.formContent}>
              <h1 className={styles.heading}>Contact Us now!</h1>
              <form
                onSubmit={handleLogin}
                autoComplete="off"
                className={styles.form}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                />
                <input type="email" name="email" placeholder="Your email" />
                <input type="email" name="email" placeholder="Subject" />
                <textarea name="message" placeholder="Your message" />
                <button type="submit">Send Message</button>
              </form>
            </div>
            <SocialIcons />
          </div>
          <div className={styles.right}>
            <img
              src={signInImage}
              className={styles.sinInImage}
              loading="lazy"
            />
          </div>
        </Container>
      </div>
    </>
  );
}

export default ContactUs;
*/
