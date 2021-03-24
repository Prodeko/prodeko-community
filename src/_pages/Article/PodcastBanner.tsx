import styled from 'styled-components';

import { Line } from 'components/Line';
import { LoadingSkeleton } from 'components/LoadingSkeleton';

type PodcastBannerProps = {
  title: string;
  podcastEmbed: string;
};

/**
 * Currently only tested with Spotify embeds. Displays a skeleton loader until
 * iframe is ready
 */
export const PodcastBanner: React.FC<PodcastBannerProps> = ({ title, podcastEmbed }) => {
  let embedUrl: string;
  if (podcastEmbed.startsWith('http')) {
    // Most likely full URL received from CMS, we need to add 'embed-podcast'
    // to the URL for the iframe to work. If the URL is of the format given by
    // Spotify' share feature, we can assume the correct spot to edit the URL
    // to fix it from looking like
    // https://open.spotify.com/episode/<podcastId>
    // to something like
    // https://open.spotify.com/embed-podcast/episode/<podcastId>
    const parts = podcastEmbed.split('/');
    const embedParts = [...parts.slice(0, 3), 'embed-podcast', ...parts.slice(3)];
    embedUrl = embedParts.join('/');
  } else if (podcastEmbed.includes(':')) {
    // Most likely received Spotify's proprietary URI, need to construct an
    // embed URL from that
    const parts = podcastEmbed.split(':');
    const podcastId = parts[2];
    embedUrl = `https://open.spotify.com/embed-podcast/episode/${podcastId}`;
  } else {
    // Most likely received only the podcast id, otherwise there's no chance
    // to have the clairvoyance to interpret the given data
    embedUrl = `https://open.spotify.com/embed-podcast/episode/${podcastEmbed}`;
  }

  return (
    <PodcastBannerWrapper>
      <h1>{title}</h1>
      <Line variant="long" />

      <LoadingWrapper>
        <iframe src={embedUrl} width="100%" height="232" frameBorder="0" allow="encrypted-media" />
      </LoadingWrapper>
    </PodcastBannerWrapper>
  );
};

const PodcastBannerWrapper = styled.header`
  * + * {
    margin-top: var(--spacing-medium);
  }
`;

const LoadingWrapper = styled(LoadingSkeleton)`
  border-radius: var(--border-radius-large);
  height: 232px; // Gotta go with embed dimensions
`;
