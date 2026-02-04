/**
 * Welcome Modal - ikas Panel Section Component
 * 
 * Bu bileşen ikas panel'inde "Welcome Modal" section'ı olarak görülür.
 * Panel'de video URL'si, başlık, alt başlık vb. düzenlenebilir.
 */

import React from 'react';
import { observer } from 'mobx-react-lite';
import WelcomeModal from './index';
import type { WelcomeModalProps } from 'src/components/__generated__/types';

interface WelcomeModalSectionProps extends WelcomeModalProps {
  // ikas injects these automatically
}

/**
 * Welcome Modal Section for ikas Panel
 * This component is used within the ikas theme editor
 */
export const WelcomeModalSection: React.FC<WelcomeModalSectionProps> = observer(
  ({
    videoUrl,
    videoMp4Url,
    videoWebmUrl,
    videoOgvUrl,
    title,
    subtitle,
    enableAutoplay,
    showOnlyFirstVisit,
  }) => {
    return (
      <WelcomeModal
        videoUrl={videoUrl}
        videoMp4Url={videoMp4Url}
        videoWebmUrl={videoWebmUrl}
        videoOgvUrl={videoOgvUrl}
        title={title}
        subtitle={subtitle}
        enableAutoplay={enableAutoplay}
        showOnlyFirstVisit={showOnlyFirstVisit}
      />
    );
  }
);

WelcomeModalSection.displayName = 'WelcomeModalSection';

export default WelcomeModalSection;
