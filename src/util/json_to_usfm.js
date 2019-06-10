module.exports = {
    toUsfm: function (book, stage, targetLangDoc) {
		var db = require(`${__dirname}/data-provider`).targetDb()
		var fs = require("fs"),
			path = require("path"),
			usfmContent = [];
		var filePath;
		usfmContent.push('\\id ' + book.bookCode);
		usfmContent.push('\\mt ' + book.bookName);
		return db.get(book.bookNumber).then((doc) => {
			var chapterLimit = doc.chapters.length;
			doc.chapters.forEach((chapter, index) => {
				usfmContent.push('\n\\c ' + chapter.chapter);
				usfmContent.push('\\p');
				chapter.verses.forEach((verse) => {
					// Push verse number and content.
					usfmContent.push('\\v ' + verse.verse_number + ' ' + verse.verse);
				});
				if(index === chapterLimit-1) {
                    var exportName = targetLangDoc.targetLang+"_"+ targetLangDoc.targetVersion+"_"+book.bookCode+"_"+stage+ "_" + getTimeStamp(new Date());
                    filePath = path.join(Array.isArray(book.outputPath) ? book.outputPath[0] : book.outputPath, exportName);
					filePath += '.usfm';
					fs.writeFileSync(filePath, usfmContent.join('\n'), 'utf8');
				}
			});
			return filePath;
		}).then((path) => {
			return path;
		}).catch((err) => {
			console.log(err);
		});
    }
};

function getTimeStamp(date) {
    var year = date.getFullYear(),
	// months are zero indexed
        month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1),
        day = (date.getDate() < 10 ? '0' : '') + date.getDate(),
        hour = (date.getHours() < 10 ? '0' : '') + date.getHours(),
        minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
        second = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    //hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
    //minuteFormatted = minute < 10 ? "0" + minute : minute,
    //morning = hour < 12 ? "am" : "pm";
    return (year.toString().substr(2,2) + month + day +  hour + minute + second).toString();
}

