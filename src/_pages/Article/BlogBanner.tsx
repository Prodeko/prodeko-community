import styled from 'styled-components';
import Image from 'next/image';

type BlogBannerProps = {
  title: string;
  photo: string;
};

export const BlogBanner: React.FC<BlogBannerProps> = ({ title, photo }) => (
  <Wrapper>
    <BlogBannerWrapper>
      <Image src={photo} alt="" layout="fill" objectFit="cover" />
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
  margin: 0 calc(var(--pad) * -1);
  color: var(--white);
`;

const BlogBannerTitle = styled.div`
  position: absolute;
  bottom: 0;
  padding: var(--pad);

  height: 100%;
  width: 100%;
  display: flex;
  align-items: flex-end;

  background: var(--photo-overlay-short);
`;
