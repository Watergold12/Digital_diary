export type TagColor = 'lavender' | 'blue' | 'green' | 'yellow' | 'pink';

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
}
