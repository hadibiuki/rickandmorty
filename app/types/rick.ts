export interface ApiInfo { count: number; pages: number; next: string | null; prev: string | null }
export interface CharacterLocation { name: string; url: string }
export interface Character {
  id: number; name: string; status: 'Alive' | 'Dead' | 'unknown'; species: string;
  type: string; gender: string; origin: CharacterLocation; location: CharacterLocation;
  image: string; episode: string[]
}
export interface Episode { id: number; name: string; air_date: string; episode: string }
export interface Location { id: number; name: string; type: string; dimension: string; residents: string[] }
export interface CharacterPage { info: ApiInfo; results: Character[] }
