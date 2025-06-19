import { animateScroll } from "react-scroll";
import styles from "./Logo.module.css";

function Logo() {
  const options = {
    duration: 500,
    smooth: "easeInOutQuint",
  };

  const handleScrollToTop = () => {
    animateScroll.scrollToTop(options);
  };

  return (
    <div className={styles.logo} onClick={handleScrollToTop}>
      Mo<span className={styles.highlight}>D</span>ion
    </div>
  );
}

export default Logo;
