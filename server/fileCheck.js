const path = require("path");

//check for image extensions
module.exports.isImageFile = function(image) {
    let extension = path.extname(image.name);
    let validExtensions = {".png": 1, ".jpg": 1, ".jpeg": 1}
    
    if (!(extension in validExtensions)) return false;

    return true;
}

//extension excluding the dot
module.exports.getImageFileExtension = function(string) {
    let lastIndexOfDot = string.lastIndexOf('.');
    let extension = string.substring(lastIndexOfDot + 1).toLowerCase();
    return extension
}

//file name (everything before the extension dot)
module.exports.getImageFileName = function(string) {
    let lastIndexOfDot = string.lastIndexOf('.');
    let fileName = string.substring(0,lastIndexOfDot).toLowerCase();
    return fileName
}
