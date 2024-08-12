const fs = require('fs'),
      Feed = require('feed').Feed

module.exports = function (meta, data) {
    let css = `` //fs.readFileSync('./templates/main.css')
    let feedtitle = meta.data;
    let directory = data.path.replace('./out/','');
    let feed = new Feed({
      title: `bcd-watch: ${data.title}`,
      description: 'A feed that summarizes changes to BCD weekly',
      id: 'https://bcd-watch.igalia.com',
      link: 'https://bcd-watch.igalia.com',
      image: 'https://commons.wikimedia.org/wiki/File:Stars_Art_-_FREE_%2850210921903%29.jpg',
      // favicon: 'https://commons.wikimedia.org/wiki/File:Stars_Art_-_FREE_%2850210921903%29.jpg',
      updated: new Date(),
      copyright: 'All rights reserved, Igalia SL',
      generator: 'awesome mix', // optional, default = 'Feed for Node.js'
      feedLinks: {
        rss:  `https://bcd-watch.igalia.com/${directory}/feed.rss`,
        json: `https://bcd-watch.igalia.com/${directory}/feed.json`,
        atom: `https://bcd-watch.igalia.com/${directory}/feed.atom`,
      }, 
      author: {
        name: 'Igalia',
        email: 'info@igalia.com',
        link: 'https://igalia.com'
      }
    })

    meta.items.forEach(function (item) {
      if (!item.content) {
        console.error('NO CONTENT FOR ITEM')
      }

      feed.addItem({
        title: item.title,
        id: `https://bcd-watch.igalia.com/${item.file}`,
        link: `https://bcd-watch.igalia.com/${item.file}`,
        description: item.blurb,
        content: `${item.content}`,
        date: new Date(item.pubDate),
        image: item.img
      })

    })

    fs.writeFileSync(`${data.path}/feed.rss`, feed.rss2(), 'utf8');
    fs.writeFileSync(`${data.path}/feed.atom`, feed.atom1(), 'utf8');
    fs.writeFileSync(`${data.path}/feed.json`, feed.json1(), 'utf8');
}
