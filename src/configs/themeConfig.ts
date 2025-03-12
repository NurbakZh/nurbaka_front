import { theme, ThemeConfig } from 'antd';
import { ThemeType } from '../shared/stores/theme';

export const colorPrimary = '#3478b3';

const token: Record<ThemeType, Partial<ThemeConfig['token']>> = {
    dark: {
        colorBgBase: '#000000',
        colorBgContainer: '#282828',
        colorBorder: '#706b6b',
        colorBorderSecondary: '#706b6b',
        colorText: '#FFFFFF',
    },
    light: {},
};

export const themeConfig = (themeType: ThemeType): ThemeConfig => {
    return {
        algorithm:
            themeType === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
            Button: {
                colorPrimary,
                colorLink: colorPrimary,
            },
            Layout: {
                headerHeight: 48,
            },
        },
        cssVar: true,
        hashed: false,
        token: {
            fontFamily: 'Roboto',
            colorPrimary,
            fontSizeHeading4: 18,
            colorLink: colorPrimary,
            ...token[themeType],
        },
    };
};
