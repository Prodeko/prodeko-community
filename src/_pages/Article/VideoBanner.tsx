import styled from 'styled-components';
import ReactPlayer from 'react-player/youtube';

import { Line } from 'components/Line';
import { LoadingSkeleton } from 'components/LoadingSkeleton';

type VideoBannerProps = {
  title: string;
  videoEmbed: string;
};

/**
 * Currently only tested with Youtube embeds. Displays a skeleton loader until
 * iframe is ready
 */
export const VideoBanner: React.FC<VideoBannerProps> = ({ title, videoEmbed }) => {
  let embedUrl: string;
  if (videoEmbed.startsWith('http')) {
    // Most likely full URL received from CMS, no need to do anything
    embedUrl = videoEmbed;
  } else {
    // Most likely received only the video id, otherwise there's no chance
    // to have the clairvoyance to interpret the given data
    embedUrl = `https://www.youtube.com/watch?v=${videoEmbed}`;
  }

  return (
    <VideoBannerWrapper>
      <h1>{title}</h1>
      <Line variant="long" />

      <LoadingWrapper>
        <ReactPlayer url={embedUrl} controls width="100%" height="100%" wrapper={PlayerWrapper} />
      </LoadingWrapper>
    </VideoBannerWrapper>
  );
};

const VideoBannerWrapper = styled.header`
  * + * {
    margin-top: var(--spacing-medium);
  }
`;

const LoadingWrapper = styled(LoadingSkeleton)`
  padding-top: 56.25%; // Aspect ratio 16:9
`;

const PlayerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;
