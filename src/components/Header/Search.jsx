import { useState, useRef, useEffect } from "react";
import styles from "./Search.module.css";
import { CgSearch } from "react-icons/cg";
import { Container } from "react-bootstrap";
import { GrClose } from "react-icons/gr";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Search() {
  const articles = useSelector((state) => state.articles.articles);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const popupRef = useRef(null);
  const [input, setInput] = useState("");
  const [searchOutput, setSearchOutput] = useState([]);

  useEffect(() => {
    // I'm gonna make the search in title and first content of the sections ONLY.
    const combinedData = articles.map((article) => {
      return {
        id: article.id,
        title: article.title,
        content: article.sections[0].content.slice(0, 200),
      };
    });
    // content that matches with the search input value form the user
    const filtered = combinedData.filter((article) => {
      return (
        article.title.toLowerCase().includes(input.toLowerCase()) ||
        article.content.toLowerCase().includes(input.toLowerCase())
      );
    });

    setSearchOutput(filtered);

    if (input.trim() === "") {
      setSearchOutput([]);
      return;
    }
  }, [input, articles]);

  const handleOnChange = (value) => {
    setInput(value);
  };

  const handleIconClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      <button
        className={styles.searchIcon}
        onClick={handleIconClick}
        aria-label="Search"
      >
        <CgSearch />
      </button>
      {isSearchOpen && (
        <Container>
          <div className={styles.popupContainer}>
            <div ref={popupRef} className={styles.popup}>
              <button
                className={styles.icon}
                onClick={handleIconClick}
                aria-label="Close Search"
              >
                <GrClose />
              </button>
              <div className={styles.searchInput}>
                <button className={styles.inputIcon} aria-label="Search">
                  <CgSearch />
                </button>
                <input
                  type="search"
                  placeholder="type your keywords.."
                  className={styles.input}
                  onChange={(e) => handleOnChange(e.target.value)}
                />
              </div>
              {searchOutput && searchOutput.length > 0 ? (
                <div className={styles.searchResults}>
                  {searchOutput.map((item) => (
                    <Link to={`/articles/${item.id}`} key={item.id}>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.content}...</p>
                        <hr />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <h5>No matches found yet..</h5>
              )}
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

export default Search;
