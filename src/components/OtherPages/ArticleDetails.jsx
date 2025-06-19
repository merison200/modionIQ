import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchArticleById } from "../../slices/articleSlice";
import Logo from "../Header/Logo";
import { Container } from "react-bootstrap";
import styles from "./ArticleDetails.module.css";
import FooterTop from "./../Footer/FooterTop";
import FooterBottom from "./../Footer/FooterBottom";
import Loading from "./Loading";
import ArrowToTop from "./ArrowToTop";
import { Link } from "react-router-dom";

function ArticleDetails() {
  const { articleId } = useParams();
  const dispatch = useDispatch();
  const { article, loading, error } = useSelector((state) => state.article);

  //const article = useSelector((state) => state.article);

  useEffect(() => {
    dispatch(fetchArticleById(articleId));
  }, [dispatch, articleId]);

  if (!article) {
    return <Loading />;
  }

  return (
    <div className={styles.bg}>
      <Container className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Logo />
        </Link>
        <div className={styles.article}>
          <div className={styles.articleInfo}>
            <span>{article.category}</span>
            <h1 className={styles.mainTitle}>{article.title}</h1>
            <div className={styles.info}>
              <img
                src={article.author_image}
                alt={article.title}
                loading="lazy"
              />
              <div>
                <span className={styles.author}>{article.author}</span>
                <span className={styles.timeAndDate}>
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    })} • {article.reading_time}
                </span>

              </div>
            </div>
            <img
              src={article.image}
              alt={article.title}
              className={styles.articleImage}
              loading="lazy"
            />
          </div>
          {article.sections.map((section, index) => (
            <div key={index} className={styles.section}>
              <h4 className={styles.sectionHeading}>{section.title}</h4>
              <p className={styles.sectionParagraph}>{section.content}</p>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <FooterTop />
          <FooterBottom />
        </div>
      </Container>
      <ArrowToTop />
    </div>
  );
}

export default ArticleDetails;
