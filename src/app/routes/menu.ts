const headingMain = {
    text: 'Main Navigation',
    heading: true
};

const Home = {
    text: 'Home',
    link: '/home',
    icon: 'icon-home'
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

const Transactions = {
  text: "Transactions",
  link: "/transactions",
  icon: "fas fa-columns",
  submenu: [
    {
      text: "Credit Memo",
      link: "/transactions/credmemo",
    },
  ],
};


export const menu = [
    headingMain,
    Home,
    MasterData,
    Transactions
];
