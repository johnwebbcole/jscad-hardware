// auto generated sidebar
const { fileTree } = require('../code/config');
console.log('foo', fileTree);
module.exports = {
  base: process.env.CI ? '/jscad-hardware/' : '/',
  dest: 'public',
  locales: {
    '/': {
      title: 'JsCad Hardware',
      description: 'jscad parts library for screws, washers and nuts'
    }
  },

  // plugins: [
  //   [
  //     '@vuepress/google-analytics',
  //     {
  //       ga: 'UA-135958052-3'
  //     }
  //   ]
  // ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'API', link: '/code/' },
      { text: 'GitLab', link: 'https://gitlab.com/johnwebbcole/jscad-hardware' }
    ],
    displayAllHeaders: true,
    editLinks: true,
    sidebarDepth: 3,
    docsDir: 'code',
    sidebar: [
      ['/', 'Readme'],
      //   {
      //     title: 'Home',
      //     path: '/',
      //     collapsable: false,
      //     children: [['/', 'Readme']]
      //   },
      {
        title: 'Code',
        path: '/code/',
        collapsable: false,
        children: fileTree.map(api => `/code${api.path}`)
      }
    ]
  }
};
