import { Container } from "react-bootstrap";
import styles from "./TopTags.module.css";
import { useSelector } from "react-redux";
import { FaArrowRight } from "react-icons/fa";
import { TbTags } from "react-icons/tb";
import { IoArrowRedoOutline } from "react-icons/io5";
import business from "../../assets/business.webp";
import fashion from "../../assets/fashion.webp";
import ideas from "../../assets/ideas.webp";
import lifestyle from "../../assets/lifestyle.webp";
import design from "../../assets/design.webp";
import Technology from "../../assets/Technology.webp";
import Loading from "../OtherPages/Loading";
import { Link } from "react-router-dom";

const imagePaths = {
  business,
  fashion,
  ideas,
  lifestyle,
  design,
  Technology,
};

function TopTags() {
  const { articles } = useSelector((state) => state.articles);
  const AllCategories = articles?.map((article) => article.category) || [];
  const specialCategories = [
    ...new Set(articles?.map((article) => article.category) || []),
  ];

  const categoryFrequencyCount = AllCategories.reduce((count, category) => {
    // Check if count[category] is falsy (undefined or 0)
    if (!count[category]) {
      count[category] = 0;
    }
    // Increment the count for the current category
    count[category]++;

    return count;
  }, {});
  // Filter specialCategories to only include those with corresponding images
  const filteredCategories = specialCategories.filter(
    (category) => imagePaths[category]
  );

  return (
    <div className={styles.bg} id="tags">
      <Container className={styles.container}>
        <div className={styles.pTags}>
          <TbTags className={styles.pTagsIcon} />
          <h1 className={styles.pTagsTitle}>Popular Tags</h1>
        </div>
        {filteredCategories != null && filteredCategories.length > 0 ? (
          filteredCategories.map((category, index) => (
            <div key={index} className={styles.card}>
              <img
                src={imagePaths[category]}
                alt="image.."
                className={styles.cardImage}
                loading="lazy"
              />
              <Link to={`/tags/${category}`} className={styles.cardInfo}>
                <h2 className={styles.cardTitle}>{category}</h2>
                <span className={styles.cardCount}>
                  {categoryFrequencyCount[category]} posts
                </span>
              </Link>
              <Link
                to={`/tags/${category}`}
                className={styles.cardIcon}
                aria-label={`Viw ${category} posts`}
              >
                <FaArrowRight />
              </Link>
            </div>
          ))
        ) : (
          <>
            <Loading />
            <Loading />
          </>
        )}
        <Link
          to="tags"
          className={`${styles.pTags} ${styles.viewAll}`}
          aria-label="View All Tags"
        >
          <IoArrowRedoOutline className={styles.pTagsIcon} />
          <h1 className={styles.pTagsTitle}>View All</h1>
        </Link>
      </Container>
    </div>
  );
}

export default TopTags;
