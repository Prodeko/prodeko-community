import { AnimatedImage } from 'components/AnimatedImage';
import styled from 'styled-components';

type BlogBannerProps = {
  title: string;
  photo: string;
};

export const BlogBanner: React.FC<BlogBannerProps> = ({ title, photo }) => (
  <Wrapper>
    <BlogBannerWrapper>
      <AnimatedImage src={photo} alt="" layout="fill" objectFit="cover" />
      <BlogBannerTitle>
        <h1>{title}</h1>
      </BlogBannerTitle>
    </BlogBannerWrapper>
  </Wrapper>
);

const Wrapper = styled.div`
  padding-top: calc(var(--navbar-height) + var(--article-top-padding));
`;

const BlogBannerWrapper = styled.header`
  position: relative;
  padding-top: var(--article-banner-height);
  margin: 0 calc(min(var(--main-padding), var(--spacing-regular)) * -1);
  color: var(--white);
`;

const BlogBannerTitle = styled.div`
  position: absolute;
  bottom: 0;
  padding: min(var(--main-padding), var(--spacing-regular));

  height: 100%;
  width: 100%;
  display: flex;
  align-items: flex-end;

  background: var(--photo-overlay-short);
`;
