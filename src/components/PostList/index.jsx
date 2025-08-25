import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import { Link } from 'gatsby';

import Title from 'components/Title';
import Divider from 'components/Divider';
import TagList from 'components/TagList';

const PostListWrapper = styled.div`
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const PostWrapper = styled.div`
  position: relative;
  top: 0;
  padding: 12px 8px;
  border-radius: 8px;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background-color 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    background-color: ${(props) => props.theme.colors.background};
    box-shadow: 0 2px 12px ${(props) => props.theme.colors.headerShadow};
  }

  @media (max-width: 768px) {
    padding: 0 5px;
  }
`;

const Date = styled.p`
  margin-bottom: 16px;
  font-size: 14.4px;
  color: ${(props) => props.theme.colors.tertiaryText};
`;

const Excerpt = styled.p`
  margin-bottom: 32px;
  line-height: 1.7;
  font-size: 15px;
  color: ${(props) => props.theme.colors.secondaryText};
  word-break: break-all;
`;

const checkIsScrollAtBottom = () => {
  return (
    document.documentElement.scrollHeight -
      document.documentElement.scrollTop <=
    document.documentElement.clientHeight + 100
  );
};

const PostList = ({ postList }) => {
  const [postCount, setPostCount] = useState(10);

  const handleMoreLoad = useMemo(
    () =>
      _.throttle(() => {
        if (checkIsScrollAtBottom() && postCount < postList.length) {
          setTimeout(() => setPostCount(postCount + 10), 300);
        }
      }, 250),
    [postCount, postList.length],
  );

  useEffect(() => {
    window.addEventListener('scroll', handleMoreLoad);

    return () => {
      window.removeEventListener('scroll', handleMoreLoad);
      if (handleMoreLoad && typeof handleMoreLoad.cancel === 'function') {
        handleMoreLoad.cancel();
      }
    };
  }, [handleMoreLoad]);

  useEffect(() => {
    setPostCount(10);
  }, [postList]);

  return (
    <PostListWrapper>
      {postList.slice(0, postCount).map((post, i) => {
        const { title, date, tags } = post.frontmatter;
        const { excerpt } = post;
        const { slug } = post.fields;

        return (
          <React.Fragment key={JSON.stringify({ slug, date })}>
            <PostWrapper>
              <Title size="bg">
                <Link to={slug}>{title}</Link>
              </Title>
              <Date>{date}</Date>
              <Excerpt>{excerpt}</Excerpt>
              <TagList tagList={tags} />
            </PostWrapper>

            {postCount - 1 !== i && postList.length - 1 !== i && (
              <Divider mt="48px" mb="32px" />
            )}
          </React.Fragment>
        );
      })}
    </PostListWrapper>
  );
};

export default PostList;
