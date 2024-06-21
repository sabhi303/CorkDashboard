const mongoose = require('mongoose');
const { Schema } = mongoose; // Destructure Schema from mongoose

const themeSchema = new Schema({
    id: String,
    title: String,
    description: String,
    moreinfo: String,
    scrollref: String,
    charts: [{
        id: String,
        title: String,
        description: String,
        chartinfo: String,
        chartids: [String],
        buttons: [String],
        plotoptions: Object,
        sources: [{
            link: String,
            name: String
        }]
    }]
}, { collection: 'themes' }); // Specify the collection name 'themes'

const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;
