import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../../slices/articlesSlice";
import styles from "./FeaturedPosts.module.css";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../OtherPages/Loading";

function FeaturedPosts() {
  const dispatch = useDispatch();
  const { articles, loading, error } = useSelector((state) => state.articles);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  // Filter and sort featured articles
  const featuredArticles = Array.isArray(articles)
    ? articles
        .filter((article) => article.featured)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 4)
    : [];

  return (
    <div className={styles.bg} id="featured">
      <Container>
        {featuredArticles.length > 0 ? (
          <div className={styles.cards}>
            {featuredArticles.map((article, index) => (
              <Link
                to={`articles/${article.id}`}
                key={index}
                className={styles.card}
              >
                <img
                  loading="lazy"
                  src={article.image}
                  alt="Card image"
                  className={styles.image}
                />
                <div className={styles.overlay}>
                  <span className={styles.category}>{article.category}</span>
                  <h1 className={styles.title}>
                    {article.title.slice(0, 3)}
                  </h1>
                  <div className={styles.info}>
                    <img
                      src={article.author_image}
                      alt={article.title}
                      className={styles.authorImage}
                    />
                    <p className={styles.readingTime}>
                      {article.reading_time}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : loading ? (
          <Loading />
        ) : (
          <h5>No featured articles found.</h5>
        )}
      </Container>
    </div>
  );
}

export default FeaturedPosts;

