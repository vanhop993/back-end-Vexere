const multer = require("multer");


const upload = multer({
    // custom lưu file
    storage:multer.diskStorage({
        destination: "images",
        filename(req,file,done){// custom thay đổi tên
            let math = ["image/png", "image/jpeg","image/jpg"];
            if (math.indexOf(file.mimetype) === -1) {
              let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpg, jpeg or png.`;
              return done(errorMess, null);
            }
            const name = Date.now() + "-" + file.originalname;
            done(null,name)
        }
    })
});


module.exports = {upload}