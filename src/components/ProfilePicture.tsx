import { AnimatedImage } from 'components/AnimatedImage';
import styled from 'styled-components';
import { User } from 'types';
import { getProductionAssetUrl } from 'utils/getProductionAssetUrl';

/**
 *  Either we display the default placeholder image or a custom user-set picture
 */
export const ProfilePicture: React.FC<{ user?: User; defaultPicture: string }> = ({
  user,
  defaultPicture,
}) =>
  user?.avatar ? (
    <ImageWrapper>
      <AnimatedImage src={user.avatar} alt="" layout="fill" objectFit="cover" sizes="20vw" />
    </ImageWrapper>
  ) : (
    <ProfileImageWrapper>
      <ProfileImage src={getProductionAssetUrl(defaultPicture)} alt="" />
    </ProfileImageWrapper>
  );

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  padding: var(--spacing-small);
  background-color: var(--gray-lighter);
`;

const ProfileImageWrapper = styled.div`
  border-radius: 999px;
  overflow: hidden;
`;

const ImageWrapper = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 999px;
`;
