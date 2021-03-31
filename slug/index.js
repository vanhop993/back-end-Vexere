/**
 * slug dùng để convert chữ cái thành lowercase vs loại bỏ toàn bộ dấu trong tiếng việt
 */
const slugify = require('slugify');

const convertCode = (str) => 
    slugify(str, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'vi'       // language code of the locale to use
});

module.exports = convertCode;