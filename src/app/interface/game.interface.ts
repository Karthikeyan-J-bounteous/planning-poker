export interface Game {
    canChangeCard: boolean;
    deck: number;
    id: string;
    reveal: boolean;
    mode: string;
    name: string;
    rounding: boolean;
    playerIds: string[];
  }