export const LIGHT = 'LIGHT';
export const DARK = 'DARK';
export const OTHER = 'OTHER';

interface Themes {
  [theme: string]: {
    background?: string;
    textColor?: string;
    iconColor?: string;
    headerNavColor?: string;
    contrastBackground?: string;
    contrastTextColor?: string;
    borderColor?: string;
    textBoxColor?: string;
  };
}
export const themeStyles: Themes = {
  [LIGHT]: {
    background: 'white',
    textColor: 'black',
    headerNavColor: 'black',
    contrastBackground: 'grey',
    contrastTextColor: 'grey',
    borderColor: 'lightgrey',
    textBoxColor: '#E1E6EB'
  },
  [DARK]: {
    background: '#00101D',
    textColor: 'white',
    headerNavColor: 'white',
    contrastBackground: '#081825',
    contrastTextColor: '#445F74',
    borderColor: '#002039',
    textBoxColor: '#F7F9FC'
  },
  [OTHER]: {}
};
