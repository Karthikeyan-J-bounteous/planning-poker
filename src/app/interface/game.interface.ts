export interface Game {
    canChangeCard: boolean;
    deck: number;
    id: string;
    isRoom: boolean;
    mode: string;
    name: string;
    rounding: boolean;
    playerIds: string[];
  }