const fs = require('fs'),
      path = './out/',
      Feed = require('feed').Feed

module.exports = function (meta, data) {
    let css = `` //fs.readFileSync('./templates/main.css')
    let feedtitle = meta.data;
    let feed = new Feed({
      title: `bcd-watch: ${data.title}`,
      description: 'A feed that summarizes changes to BCD weekly',
      id: 'https://bkardell.com/bcd-watch',
      link: 'https://bkardell.com/bcd-watch',
      image: 'https://commons.wikimedia.org/wiki/File:Stars_Art_-_FREE_%2850210921903%29.jpg',
      // favicon: 'https://commons.wikimedia.org/wiki/File:Stars_Art_-_FREE_%2850210921903%29.jpg',
      updated: new Date(),
      copyright: 'All rights reserved 2024, Brian Kardell',
      generator: 'awesome mix', // optional, default = 'Feed for Node.js'
      feedLinks: {
        rss: 'https://bkardell.com/bcd-watch/feed.rss',
        json: 'https://bkardell.com/bcd-watch/feed.json',
        atom: 'https://bkardell.com/bcd-watch/feed.atom',
      }, 
      author: {
        name: 'Brian Kardell',
        email: 'bkardell@gmail.com',
        link: 'https://bkardell.com'
      }
    })

    meta.items.forEach(function (item) {
      if (!item.content) {
        console.error('NO CONTENT FOR ITEM')
      }

      feed.addItem({
        title: item.title,
        id: `https://bkardell.com/bcd-watch/${item.file}`,
        link: `https://bkardell.com/bcd-watch/${item.file}`,
        description: item.blurb,
        content: `${item.content}`,
        date: new Date(item.pubDate),
        image: item.img
      })

    })


    fs.writeFileSync(path + `${data.filename}.rss`, feed.rss2(), 'utf8');
    fs.writeFileSync(path + `${data.filename}.atom`, feed.atom1(), 'utf8');
    fs.writeFileSync(path + `${data.filename}.json`, feed.json1(), 'utf8');
}
