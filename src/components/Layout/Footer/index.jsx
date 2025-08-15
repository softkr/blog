import React from 'react';
import styled from 'styled-components';

import { title } from '../../../../blog-config';

const FooterWrapper = styled.footer`
  margin-top: 32px;
  padding: 40px 0;
  border-top: 1px solid ${(props) => props.theme.colors.divider};
  color: ${(props) => props.theme.colors.secondaryText};
`;

const Inner = styled.div`
  margin: 0 auto;
  max-width: 1024px;
  padding: 0 20px;
  text-align: center;
  font-size: 11pt;
  font-weight: lighter;

  @media (max-width: 768px) {
    padding: 0 15px;
  }

  & a {
    color: ${(props) => props.theme.colors.text};
    text-decoration: none;
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Inner>© {title} - Sharing insights on development and innovation.</Inner>
    </FooterWrapper>
  );
};

export default Footer;
