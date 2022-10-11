import styles from "../styles/BlogCard.module.css";
import Link from "next/link";

function BlogCard({ key, slug, title, author, coverPhoto, datePublished }) {
  return (
    <div className={styles.card} key={key}>
      <Link href={`/posts/${slug}`}>
        <div className={styles.imgContainer}>
          <img src={coverPhoto.url} alt={title} />
        </div>
      </Link>
      <div className={styles.text}>
        <h2>{title}</h2>
        <div className={styles.details}>
          <div className={styles.author}>
            <img src={author.avatar.url} alt="" />
            <h3>{author.name}</h3>
          </div>
          <div className={styles.date}>
            <h3>{datePublished}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
