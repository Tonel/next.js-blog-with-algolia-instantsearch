import { request } from "@/lib/datocms";
import algoliasearch from "algoliasearch/lite";

export default async (req, res) => {
  // initializing the Algolia client with the secret keys
  const algoliaClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
      process.env.ALGOLIA_ADMIN_KEY,
  );

  // setting the Algolia index related to your blog
  const index = algoliaClient.initIndex("my_blog_content");

  const pageSize = 20

  // retrieving all posts from the headless CMS
  const allPostsGraphqlRequest = (first, skip) => {
    return {
      query: `
      {
        allPosts(orderBy: date_DESC, first: ${first}, skip: ${skip}) {
          id
          title
          slug
          excerpt
          date
        }
       meta: _allPostsMeta {
          count
       }
      }
    `
    }
  };
  const postResponse = await request(allPostsGraphqlRequest(pageSize, 0));
  // the number of all posts available
  const postCount = postResponse.meta.count;

  // iterating over the posts because the allPosts query is paginated
  // by default
  for (let page = 0; page < Math.ceil(postCount/pageSize); page++) {
    const posts = await request(allPostsGraphqlRequest(pageSize, page * pageSize))

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

    // saving the post info to Algolia
    await index.saveObjects(algoliaPosts);
  }

  res.json(`Content successfully synchronized with Algolia search`);
  res.end();
};
