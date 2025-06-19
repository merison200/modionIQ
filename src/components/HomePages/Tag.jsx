import { useParams } from "react-router";
import styles from "./AllArticles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchArticles } from "./../../slices/articlesSlice";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";
import Loading from "../OtherPages/Loading";
import Logo from "../Header/Logo";
import FooterTop from "../Footer/FooterTop";
import FooterBottom from "../Footer/FooterBottom";
import ArrowToTop from "../OtherPages/ArrowToTop";

function Tag() {
  const { tag } = useParams();
  const dispatch = useDispatch();

  const { articles, loading, error } = useSelector((state) => state.articles);

  const safeArticles = Array.isArray(articles) ? articles : [];

  const requiredArticles = safeArticles.filter(
  (article) => article.category === tag
);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  return (
    <div className={styles.bgTag}>
      <Container>
        <ArrowToTop />
        <Link to="/" className={styles.logo}>
          <Logo />
        </Link>
        <h1 className={styles.tagTitle}>{tag}</h1>
      </Container>
      <Container
        className={`${styles.containerTag} ${requiredArticles.length === 0 ? styles.centeredContainerTag : ""}`}
      >
        {Array.isArray(requiredArticles) && requiredArticles.length > 0 ? (
          requiredArticles.map((article) => (
            <Link
              to={`articles/${article.id}`}
              key={article.id}
              className={`${styles.card} card`}
            >
              <Card.Img
                variant="top"
                src={article.image}
                className={styles.cardImage}
                loading="lazy"
                alt={article.title}
              />
              <Card.Body className={styles.cardBody}>
                <Card.Text className={styles.cardCategory}>
                  {article.category}
                </Card.Text>
                <Card.Title className={styles.cardTitle}>
                  {article.title}
                </Card.Title>
                {Array.isArray(article.sections) &&
                  article.sections.length > 0 && (
                    <Card.Text className={styles.cardDescription}>
                      {article.sections[0].content.slice(0, 150)}...
                    </Card.Text>
                  )}
                <div className={styles.cardInfo}>
                  <Card.Img
                    className={styles.authorImage}
                    src={article.author_image}
                    loading="lazy"
                  />
                  <div className={styles.cardTime}>
                    <FaRegClock className={styles.cardClock} />
                    <Card.Text className={styles.readingTime}>
                      {article.reading_time}
                    </Card.Text>
                  </div>
                </div>
              </Card.Body>
            </Link>
          ))
        ) : (
          <Loading />
        )}
      </Container>
      <Container>
        <FooterTop />
        <FooterBottom />
      </Container>
    </div>
  );
}

export default Tag;
