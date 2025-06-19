import { Container } from "react-bootstrap";
import styles from "./FooterBottom.module.css";
import { FaFacebook, FaLinkedinIn, FaGithub, FaTwitter } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";

function FooterBottom() {
  const year = new Date().getFullYear();

  return (
    <div className={styles.bg}>
      <span className={styles.hr} />
      <Container className={styles.container}>
        <span className={styles.logoAndCpr}>
          Modion &copy; {year}. All rights reserved.
        </span>
        <SocialIcons />
      </Container>
    </div>
  );
}

export default FooterBottom;

export function SocialIcons() {
  return (
    <div className={styles.socialIcons}>
      <a
        href="https://www.facebook.com/share/1EecrP7V2v/"
        className={styles.socialLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="facebook"
      >
        <FaFacebook />
      </a>
      <a
        href="https://x.com/lancelot_xyz?t=e1yIvraBMKKQsSRRJF4KFA&s=09"
        className={styles.socialLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X aka twitter"
      >
        <FaTwitter />
      </a>
      <a
        href="https://www.instagram.com"
        className={styles.socialLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <AiFillInstagram />
      </a>
      <a
        href="https://www.linkedin.com/in/okpala?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        className={styles.socialLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="linkedin of the author"
      >
        <FaLinkedinIn />
      </a>
      <a
        href="https://github.com/merison200"
        className={styles.socialLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="github"
      >
        <FaGithub />
      </a>
    </div>
  );
}
