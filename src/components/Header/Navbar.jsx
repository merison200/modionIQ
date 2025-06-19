import { useState } from "react";
import styles from "./Navbar.module.css";
import { RiMenu3Fill, RiCloseFill } from "react-icons/ri";
import { CgSun, CgMoon } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../slices/darkModeSlice";
import { logout } from "../../slices/authSlice";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import Search from "./Search";
import { MdAdminPanelSettings } from "react-icons/md";

function Navbar() {
  const [mobile, setMobile] = useState(false);
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.darkMode);
  const user = useSelector((state) => state.auth.user);

  function toggleScroll(enableScroll) {
    const body = document.body;
    const html = document.documentElement;
    body.style.overflow = html.style.overflow = enableScroll ? "auto" : "hidden";
  }

  toggleScroll(!mobile);

  const handleLogout = () => {
    dispatch(logout());
    setMobile(false);
  };

  return (
    <div className={styles.navbar}>
      <nav className={mobile ? styles.navListMobile : styles.navList}>
        {["home", "featured", "tags", "articles", "contact"].map((section) => (
          <ScrollLink
            key={section}
            to={section}
            rel="nofollow"
            spy={true}
            smooth={true}
            offset={-80}
            duration={250}
            className={styles.navItem}
            onClick={() => mobile && setMobile(false)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </ScrollLink>
        ))}

        {user?.user?.role === "admin" && (
        <a
          href="/admin/admin.html"
          className={styles.navItem}
          title="Admin Panel"
        >
          <MdAdminPanelSettings style={{ marginRight: "5px", verticalAlign: "middle" }} />
          Admin
        </a>
        )}

        {mobile &&
          (!user ? (
            <Link
              to="/signin"
              onClick={() => setMobile(false)}
              className={styles.signInMobile}
            >
              Sign In
            </Link>
          ) : (
            <button onClick={handleLogout} className={styles.signInMobile}>
              Logout
            </button>
          ))}
      </nav>

      <div className={styles.navbarActions}>
        <Search />
        <button
          className={styles.toggleButton}
          onClick={() => dispatch(toggleDarkMode())}
          aria-label="Toggle between dark and light mode"
        >
          {isDarkMode.theme ? <CgSun /> : <CgMoon />}
        </button>

        {!user ? (
          <Link to="/signin" rel="nofollow" className={styles.signInLink}>
            Sign In
          </Link>
        ) : (
          <div className={styles.userSection}>
            <span className={styles.userName}>{user.user.name}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        )}
      </div>

      <button
        className={styles.mobileIcon}
        onClick={() => setMobile(!mobile)}
        aria-label={mobile ? "Close mobile menu" : "Open mobile menu"}
      >
        {mobile ? <RiCloseFill /> : <RiMenu3Fill />}
      </button>
    </div>
  );
}

export default Navbar;
