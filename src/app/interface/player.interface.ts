export interface Player {
    hasSelectedCard: boolean;
    id: string;
    isPlaying: boolean;
    isPresent: boolean;
    name: string;
    role: 'host' | 'player';
    selectedCard?: string;
  }