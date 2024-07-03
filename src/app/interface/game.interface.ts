export interface Game {
    canChangeCard: boolean;
    deck: number;
    id: string;
    show: boolean,
    reveal: boolean;
    mode: string;
    name: string;
    rounding: boolean;
    playerIds: string[];
  }