import React from 'react';
import styled from 'styled-components';

const BodyWrapper = styled.div`
  margin: 0 auto;
  padding-top: 80px;
  max-width: 1024px;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;

  @media (max-width: 768px) {
    padding-left: 15px;
    padding-right: 15px;
  }
`;

const Body = ({ children }) => {
  return <BodyWrapper>{children}</BodyWrapper>;
};

export default Body;
