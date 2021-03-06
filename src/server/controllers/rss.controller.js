const mongoose = require('mongoose');
const RSS = require('rss');

const postSchema = require('./../schemas/post.schema');

const Post = mongoose.model('posts', postSchema);

const MAX_ITEM_COUNT = 20;

module.exports = (app) => {
    app.get('/rss', (request, response) => Post.find()
        .sort('-date')
        .limit(MAX_ITEM_COUNT)
        .populate('author')
        .exec()
        .then(posts => {
            const feed = new RSS({
                title: 'WebPurple',
                description: 'Ryazan front-end community',
                feed_url: 'https://webpurple.herokuapp.com/rss',
                site_url: 'https://webpurple.herokuapp.com/',
            });

            posts.forEach(({ title, description, comment, url, date, author, image }) => {
                const item = {
                    title,
                    description: comment || description,
                    url,
                    date,
                    author: author && author.displayName,
                };
                if (image && image.length) {
                    const extention = image.substr(image.lastIndexOf('.') + 1);
                    item.enclosure = {
                        url: image,
                        type: `image/${extention}`,
                    };
                }
                feed.item(item);
            });

            response.setHeader('content-type', 'application/rss+xml');
            response.send(feed.xml({ indent: true }));
        }));
};
