import React from 'react';
import SEO from 'components/SEO';
import { graphql } from 'gatsby';

import Layout from 'components/Layout';
import Article from 'components/Article';

const Post = ({ data }) => {
  const { markdownRemark: post, previous, next, seriesList, site } = data;
  const { siteUrl } = site.siteMetadata;

  const { title, date, update, tags, series } = post.frontmatter;
  const { excerpt } = post;
  const { readingTime, slug } = post.fields;

  const filteredSeries = seriesList.edges.map((seriesPost) => ({
    ...seriesPost.node,
    currentPost: seriesPost.node.id === post.id,
  }));

  return (
    <Layout>
      <SEO title={title} description={excerpt} url={`${siteUrl}${slug}`} />
      <Article>
        <Article.Header
          title={title}
          date={date}
          update={update}
          tags={tags}
          minToRead={Math.round(readingTime.minutes)}
        />
        {filteredSeries.length > 0 && (
          <Article.Series header={series} series={filteredSeries} />
        )}
        <Article.Body html={post.html} />
        <Article.Footer previous={previous} next={next} />
      </Article>
    </Layout>
  );
};

export default Post;

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $series: String
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 200, truncate: true)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        update(formatString: "MMMM DD, YYYY")
        tags
        series
      }
      fields {
        slug
        readingTime {
          minutes
        }
      }
    }
    seriesList: allMarkdownRemark(
      sort: { frontmatter: { date: ASC } }
      filter: { frontmatter: { series: { eq: $series } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
