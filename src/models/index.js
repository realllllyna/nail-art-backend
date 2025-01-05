const Category = require('./category');
const Entry = require('./entry');

// Set up relationships
Category.hasMany(Entry, {
    foreignKey: 'categoryId',
    as: 'entries',
    onDelete: 'SET NULL',
});

Entry.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category',
});

module.exports = {
    Category,
    Entry,
};
