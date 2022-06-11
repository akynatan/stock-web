import { State } from './State';

export interface City {
  id: string;
  name: string;
  state_id: string;
  state: State;
  created_at: Date;
  updated_at: Date;
}
