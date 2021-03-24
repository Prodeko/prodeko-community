import styled from 'styled-components';
import Image from 'next/image';

type BlogBannerProps = {
  title: string;
  photo: string;
};

export const BlogBanner: React.FC<BlogBannerProps> = ({ title, photo }) => (
  <BlogBannerWrapper>
    <Image src={photo} alt="" layout="fill" objectFit="cover" />
    <BlogBannerTitle>
      <h1>{title}</h1>
    </BlogBannerTitle>
  </BlogBannerWrapper>
);

const BlogBannerWrapper = styled.header`
  position: relative;
  padding-top: 50%;
  margin: 0 calc(var(--pad) * -1);
  color: var(--white);
`;

const BlogBannerTitle = styled.div`
  position: absolute;
  bottom: 0;
  padding: var(--pad);
`;
