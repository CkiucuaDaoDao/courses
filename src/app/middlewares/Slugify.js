const slugify = require('slugify');
const removeAccents = require('remove-accents');

module.exports = function (next) {
    // Lấy tên của database
    const coursesName = removeAccents(this.name).toLowerCase();
  
    // Tạo slug từ tên database
    const slug = slugify(coursesName, { lower: true, replacement: '-' });
  
    // Gán slug vào trường slug trong mô hình dữ liệu
    this.slug = slug;
  
    next();
  }