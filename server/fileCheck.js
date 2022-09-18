module.exports.isImageFile = function(filename) {
    let lastIndexOfDot = filename.lastIndexOf('.'); 
    if (!lastIndexOfDot) return false;

    let extension = filename.substring(lastIndexOfDot).toLowerCase();
    let validExtensions = {".png": 1, ".jpg": 1, ".jpeg": 1}
    if (!(extension in validExtensions)) return false;

    return true;
}
