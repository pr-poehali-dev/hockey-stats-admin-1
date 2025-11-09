export const API_URL = 'https://functions.poehali.dev/cb589473-199a-493a-b7b2-14d8f24a8bee';

export interface Team {
  id: number;
  name: string;
  logo_url: string;
  games_played: number;
  wins: number;
  losses: number;
  ot_losses: number;
  goals_for: number;
  goals_against: number;
  points: number;
  position: number;
}
