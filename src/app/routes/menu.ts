
const Home = {
    text: 'Home',
    link: '/home',
    icon: 'icon-home'
};

const headingMain = {
    text: 'Main Navigation',
    heading: true
};

const MasterData = {
    text: 'Master Data',
    link: '/masterdata',
    icon: 'icon-grid',
    submenu: [
        {
            text: 'CM-Category',
            link: '/masterdata/category'
        }        
    ]
};

export const menu = [
    headingMain,
    Home,
    MasterData
];
