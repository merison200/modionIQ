import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../../slices/articlesSlice";
import Logo from "../Header/Logo";
import styles from "./AllTags.module.css";
import business from "../../assets/business.webp";
import fashion from "../../assets/fashion.webp";
import ideas from "../../assets/ideas.webp";
import lifestyle from "../../assets/lifestyle.webp";
import design from "../../assets/design.webp";
import Technology from "../../assets/Technology.webp";
import creative from "../../assets/creative.webp";
import story from "../../assets/story.webp";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import FooterTop from "../Footer/FooterTop";
import FooterBottom from "../Footer/FooterBottom";
import ArrowToTop from "../OtherPages/ArrowToTop";

const imagePaths = {
  business,
  fashion,
  ideas,
  lifestyle,
  design,
  Technology,
  creative,
  story,
};

function AllTags() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const { articles } = useSelector((state) => state.articles);
  const categories = [...new Set(articles.map((article) => article.category))];

  return (
    <div className={styles.bg}>
      <Container className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Logo />
        </Link>
        <div className={styles.intro}>
          <h1>Tags</h1>
          <p>
            Discover a world of articles on our Tags page. Dive into specific
            topics with ease as our curated tags lead you to a variety of
            engaging content. Explore, learn, and enjoy the convenience of
            navigating through our diverse collection effortlessly
          </p>
        </div>
        <div className={styles.cardsContainer}>
          {categories.map((category) => {
            const filteredArticles = articles.filter(
              (article) => article.category === category
            );
            const firstArticle = filteredArticles[0];
            return (
              <Card key={category} className={styles.card}>
                <Card.Img
                  loading="lazy"
                  variant="top"
                  src={imagePaths[category]}
                  className={styles.cardImage}
                />
                <Card.Body className={styles.cardBody}>
                  <Link to={`${category}`} className={styles.cardTitle}>
                    {category}
                  </Link>
                  <Card.Text className={styles.cardText}>
                    <span>
                      {firstArticle.sections[0].content.slice(0, 150)}...
                    </span>
                    <span>{filteredArticles.length} articles</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </div>
        <FooterTop />
        <FooterBottom />
        <ArrowToTop />
      </Container>
    </div>
  );
}

export default AllTags;
