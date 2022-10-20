import { request } from "@/lib/datocms";
import algoliasearch from "algoliasearch/lite";

export default async (req, res) => {
  // retrieving all posts from the headless CMS
  const allPostsGraphqlRequest = {
    query: `
      {
        allPosts(orderBy: date_DESC) {
          id
          title
          slug
          excerpt
          date
        }
      }
    `,
  };
  const posts = await request(allPostsGraphqlRequest)

  // converting tha data retrieved by the headless CMS
  // into the desired Algolia format
  const algoliaPosts = posts.allPosts.map((post) => {
    return {
      objectID: post.id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      date: post.date,
    }
  });

  // initializing the Algolia client with the secret keys
  const algoliaClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
      process.env.ALGOLIA_ADMIN_KEY,
  );

  // setting the Algolia index related to your blog
  const index = algoliaClient.initIndex("my_blog_content");

  // saving the post info to Algolia
  await index.saveObjects(algoliaPosts);

  res.json(`Content successfully synchronized with Algolia search`);
  res.end();
};
