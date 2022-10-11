import Head from "next/head";
import styles from "../styles/Home.module.css";
import BlogCard from "../components/BlogCard";

// Minimal graphQL client supporting Node & browsers for scripts or simple apps
// Features:
// - Most simple & lightweight GraphQL client
// - Promise-based API (works with async / await)
// - TypeScript support
// - Isomorphic (works with Node / browsers)
import { GraphQLClient, gql } from "graphql-request";
// Here we connect to our endpoint:
const graphCms = new GraphQLClient(
  "https://api-eu-west-2.hygraph.com/v2/cl92us2q03aqt01tcdh5xgqou/master"
);
// Convenience passthrough `gql` template tag to get the benefits of tooling.
// It returns the string with any variables given interpolated.
const QUERY = gql`
  {
    posts {
      id
      title
      datePublished
      slug
      coverPhoto {
        url
      }
      author {
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
// Not using any state or effect hooks here for client-side rendering.
// Instead we going to use serve-side `useStaticProps` a function that allows us
// to perform a server/service API request and once complete "Nextjs" is going
// to generate for us static pages, in the case above we generate a file for
// each blog post. It's not done at the client end, its already generated.
// You always want to return something `props` to your component being `Home`.
// The `props` we pass we then can work with below. Below we ensure that the
// static content is revalidated/updated into our component every 10 seconds.
export async function getStaticProps() {
  const { posts } = await graphCms.request(QUERY);
  // console.log(posts);
  return {
    props: {
      posts,
    },
    revalidate: 30,
  };
}

export default function Home({ posts }) {
  // console.log(posts);
  return (
    <div className={styles.container}>
      <Head>
        <title>Blogomo Blogger</title>
        <meta name="description" content="General blog wired up with hygraph" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {posts.map((post) => {
          return (
            <BlogCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              author={post.author}
              coverPhoto={post.coverPhoto}
              datePublished={post.datePublished}
            />
          );
        })}
      </main>
    </div>
  );
}
