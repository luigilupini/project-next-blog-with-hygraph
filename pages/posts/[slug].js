import styles from "../../styles/Slug.module.css";

import { GraphQLClient, gql } from "graphql-request";
// Here we connect to our endpoint:
const graphCms = new GraphQLClient(
  "https://api-eu-west-2.hygraph.com/v2/cl92us2q03aqt01tcdh5xgqou/master"
);

const QUERY = gql`
  query Post($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      datePublished
      slug
      coverPhoto {
        url
      }
      author {
        id
        name
        avatar {
          url
        }
      }
      content {
        html
      }
    }
  }
`;

const SLUGLIST = gql`
  {
    posts {
      slug
    }
  }
`;

// If a page has dynamic routes and uses `getStaticProps`, it needs to define a
// list of paths to be statically generated. When you export a function called
// `getStaticPaths` (Static Site Generation) from a page using dynamic routes,
// Next.js will statically pre-render all paths specified by `getStaticPaths`.

// Because we have dynamic content that we routing based on that data we fetch,
// meaning the routes land up being dynamic as they adjacent to our slug(s) in
// our CMS for each entry we use in each `BlogCard`. So to translate that, we
// need to `map` those fields out before hand.

// We telling Next below to pre-request about all the paths we return as props.
export async function getStaticPaths() {
  const { posts } = await graphCms.request(SLUGLIST);
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}
// Now we pass those `params` into our static props.
// That allows us to make a single request into our graphQL query.
// Notice we return now the individual `post` as a prop.
export async function getStaticProps({ params }) {
  const slug = params.slug;
  const data = await graphCms.request(QUERY, { slug });
  const post = data.post;
  return {
    props: {
      post,
    },
    revalidate: 10,
  };
}

export default function SlugDetail({ post }) {
  // console.log(post);
  return (
    <main className={styles.blog}>
      <img
        className={styles.cover}
        src={post.coverPhoto.url}
        alt={post.title}
      />
      <div className={styles.title}>
        <div className={styles.authdetails}>
          <img src={post.author.avatar.url} alt={post.author.name} />
          <div className={styles.authtext}>
            <h6>By {post.author.name} </h6>
            <h6 className={styles.date}>{post.datePublished}</h6>
          </div>
        </div>
        <h2>{post.title}</h2>
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      ></div>
    </main>
  );
}
