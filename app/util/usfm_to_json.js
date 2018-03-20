
module.exports = {
    /*
      All keys of options are required!
      e.g: options = {lang: 'en', version: 'udb', usfmFile: '/home/test-data/L66_1 Corinthians_I.SFM', 'target': 'refs|target'}
    */

    toJson: function(options, callback) {
        try {
        	console.log(options)
            var lineReader = require('readline').createInterface({
                input: require('fs').createReadStream(options.usfmFile)
            });
            patterns = require('fs').readFileSync(`${__dirname}/patterns.prop`, 'utf8');
            var book = {},
                verse = [],
               	db = require(`${__dirname}/../util/data-provider`).targetDb(),
				refDb = require(`${__dirname}/../util/data-provider`).referenceDb(),
                c = 0,
                v = 0,
                usfmBibleBook = false,
                validLineCount = 0,
                id_prefix = options.lang + '_' + options.version + '_';
            book["scriptDirection"] = options.scriptDirection;
            book.chapters = [];
        } catch (err) {
            return callback(new Error('usfm parser error'));
        }
        lineReader.on('line', function(line) {
            // Logic to tell if the input file is a USFM book of the Bible.
            if (!usfmBibleBook)
                if (validLineCount > 3)
                    return callback(new Error('not usfm file'))

            validLineCount++;
            var line = line.trim();
            var splitLine = line.split(/ +/);
            if (!line) {
                validLineCount--;
                //Do nothing for empty lines.
            } else if (splitLine[0] == '\\id') {
                if (require(`${__dirname}/constants.js`).bookCodeList.includes(splitLine[1]))
                    usfmBibleBook = true;
                book._id = id_prefix + splitLine[1];
            } else if (splitLine[0] == '\\c') {
                book.chapters.push({
                    "verses": verse,
                    "chapter": parseInt(splitLine[1], 10)
                });
                verse = [];
                c++;
                v = 0;
            } else if (splitLine[0] == '\\v') {
                var verseStr = (splitLine.length <= 2) ? '' : splitLine.splice(2, splitLine.length - 1).join(' ');
                verseStr = replaceMarkers(verseStr);
                book.chapters[c - 1].verses.push({
                    "verse_number": parseInt(splitLine[1], 10),
                    "verse": verseStr
                });
                v++;
            } else if (splitLine[0].startsWith('\\s')) {
                //Do nothing for section headers now.
            } else if (splitLine.length == 1) {
                // Do nothing here for now.
            } else if (splitLine[0].startsWith('\\m')) {
                // Do nothing here for now
            } else if (splitLine[0].startsWith('\\r')) {
                // Do nothing here for now.
            } else if (c > 0 && v > 0) {
                var cleanedStr = replaceMarkers(line);
                book.chapters[c - 1].verses[v - 1].verse += ((cleanedStr.length === 0 ? '' : ' ') + cleanedStr);
            }
        });

        lineReader.on('close', function(line) {

            if (!usfmBibleBook)
                // throw new Error('not usfm file');
                return callback(new Error('not usfm file'))

            /*console.log(book);
              require('fs').writeFileSync('/Users/fox/output.json', JSON.stringify(book), {
              encoding: 'utf8',
              flag: 'a'
              });
              require('fs').writeFileSync('/Users/fox/output.json', ',\n', {
              encoding: 'utf8',
              flag: 'a'
              });*/

            //	    const PouchDB = require('pouchdb-core')
            //		  .plugin(require('pouchdb-adapter-leveldb'));
            if (options.targetDb === 'refs') {
                refDb.get(book._id).then(function(doc) {
                    book._rev = doc._rev;
                    book.scriptDirection = options.scriptDirection;
                    refDb.put(book);
                }).catch(function(err) {
                    refDb.put(book).then(function(doc) {
                        return callback(null, "Successfully loaded new refs");
                    }).catch(function(err) {
                        // console.log("Error: While loading new refs. " + err);
                        return callback("Error: While loading new refs. " + err);
                    });
                });
            } else if (options.targetDb === 'target') {
                const booksCodes = require(`${__dirname}/constants.js`).bookCodeList;
                var bookId = book._id.split('_');
                bookId = bookId[bookId.length - 1].toUpperCase();
                var i, j, k;
                for (i = 0; i < booksCodes.length; i++) {
                    if (bookId === booksCodes[i]) {
                        i++;
                        break;
                    }
                }
                db.get(i.toString()).then(function(doc) {
                    for (i = 0; i < doc.chapters.length; i++) {
                        for (j = 0; j < book.chapters.length; j++) {
                            if (book.chapters[j].chapter === doc.chapters[i].chapter) {

                                var versesLen = Math.min(book.chapters[j].verses.length, doc.chapters[i].verses.length);
                                for (k = 0; k < versesLen; k++) {
                                    var verseNum = book.chapters[j].verses[k].verse_number;
                                    doc.chapters[i].verses[verseNum - 1].verse = book.chapters[j].verses[k].verse;
                                    book.chapters[j].verses[k] = undefined;
                                }
                                //check for extra verses in the imported usfm here.
                                break;
                            }
                        }
                    }
                    db.put(doc).then(function(response) {
                        return callback(null, response);
                    }).catch(function(err) {
                        return callback('Error: While trying to save to DB. ' + err);
                    });
                });
            }
        });

        lineReader.on('error', function(lineReaderErr) {
            if (lineReaderErr.message === 'not usfm file')
            	return callback(options.usfmFile + ' is not a valid USFM file.')
            else
                return callback(new Error('usfm parser error'))
        });
    }
};

var patterns = "";

function replaceMarkers(str) {
    var patternsLine = patterns.split('\n');
    var pattern = '',
        replacement = '',
        pairFoundFlag = -1;
    for (var i = 0; i < patternsLine.length; i++) {
        if (str.length === 0)
            break
        if (patternsLine[i] === '' || patternsLine[i].startsWith('#'))
            continue;

        if (patternsLine[i].startsWith('>') && pairFoundFlag <= 0) {
            pattern = patternsLine[i].substr(1);
            pairFoundFlag = 0;
        } else if (patternsLine[i].endsWith('<') && pairFoundFlag === 0) {
            replacement = patternsLine[i].length === 1 ? '' : patternsLine[i].substr(0, patternsLine[i].length - 1);
            pairFoundFlag = 1;
        }

        if (pairFoundFlag === 1) {
            str = str.replace(new RegExp(pattern, 'gu'), replacement);
            pairFoundFlag = -1;
        }
    }
    return str;
}