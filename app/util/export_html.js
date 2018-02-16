const i18n = new(require('../../translations/i18n'));
const path = require('path');
import swal from 'sweetalert';
var fs = require("fs");
module.exports = {
	exportHtml: function(id, currentBook, db, LTR){
		i18n.isRtl().then((res)=>{
	    	if(!res && LTR !== "RTL"){
	        	let htmlContent = '';
	        	let inlineData = `<!DOCTYPE html>
	                <html lang="en">
	                <head>
	                    <meta charset="utf-8">
	                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	                    <meta name="viewport" content="width=device-width, initial-scale=1">
	                    <meta name="description" content="">
	                    <style >
	                    p {
	                        font-size: 100%;
	                    }
	                    .newspaper ul li ol li:before {
	                        font-size: 62%
	                    }
	                     .chapter {
	                        font-size: 180%;
	                        }

	                    p {
	                        font-family: Helvetica;
	                    }

	                    .body {
	                        background-color: #f5f8fa;
	                        line-height: 100%;
	                    }

	                    .newspaper {
	                        -webkit-column-count: 2;
	                        -moz-column-count: 2;
	                        column-count: 2;
	                    }

	                    .chapter {
	                        display: inline-block;
	                        margin-left: 4px;
	                        float: left;
	                        text-align: right;
	                        margin-right: 5px;
	                    }

	                    .list {
	                        margin: 0 auto;
	                        padding-top: 0px;
	                    }
	                    .newspaper ul{float: left; width: 100%;}
	                    .newspaper ul li {
	                        list-style: none;
	                        float: left;
	                        display: block;
	                        width: 100%;
	                    }

	                    .newspaper ul li ol {
	                        counter-reset: item+1;
	                        list-style-type: none;
	                        margin: 0;
	                        padding: 0;
	                        margin-left: -16px;
	                    }

	                    .newspaper ul li ol li {
	                        display: block;
	                        float: left;
	                        width: 100%;
	                    }
	                    .newspaper ul li ol li:before {
	                       width: 3%;
	                    float: left;
	                    font-weight: bold;
	                    content: counter(item) " ";
	                    counter-increment: item;
	                    margin-right: 8px;
	                    padding-left: 10px;
	                    text-align: right;
	                    }
	                    .newspaper ul li ol li p {width: 90%; margin:0 0 10px 0; padding: 0 29px 0px 0px; float: left; box-sizing: border-box;}
	                    .firstLi {margin-bottom: 8px; line-height: 20px; width: 80%}

	                    @media only screen and (max-width: 1024px) {
	                        .newspaper ul li ol li p {
	                    width: 80%;
	                    margin: 0 0 10px 0;
	                    padding: 0 8px 0px 0px;
	                    float: left;
	                    line-height: 20px;
	                    box-sizing: border-box;
	                }
	                .newspaper ul li {
	                    list-style: none;
	                    float: left;
	                    display: block;
	                    width: 90%;
	                    padding-right: 21px;
	                }
	                .chapter {
	                        margin-right: 6px;
	                    width: 18%;
	                }
	                      }
	                @media only screen and (max-width: 768px) {
	                .chapter {
	                    margin-right: 4px;
	                    width: 31%;
	                }
	                }

	                    @media only screen and (max-width: 700px) {
	                    .newspaper ul li ol li p {
	                    width: 80%;
	                }
	                    .newspaper ul li ol li:before {
	                    width: 7%;
	                    }
	                    .chapter {
	                         display: inline-block;
	                    margin-left: -44px;
	                    float: right;
	                    text-align: right;
	                    margin-right: 12px;
	                    width: 100%;
	                }
	                    }
	                    .newspaper{margin-right: 2px}
	                    .firstLi {display: inline-flex;}

	                @media only print {
	                     .body {
	                        line-height: 120%;
	                       margin-top: 2px;
	                    }

	                }
	                    </style>
	</head>
	<body class="body">
	    <center><h1>${currentBook.book_name}</h1></center>
	    <div class="newspaper">`
	            var contentFlag = false;
	            db.get(currentBook._id).then(function(doc) { 
	                doc.chapters.map((obj, i) => {
	                    for( let i=0; i<obj.verses.length; i++){
	                        if (obj.verses[i].verse !== "" && obj.verses[i].verse !== null){
	                            contentFlag = true;
	                        }
	                        if(i==0){
	                            htmlContent += 
	                            `<ul class="list">
	                                <li>
	                                    <p class="firstLi"><span class="chapter">${obj.chapter}</span>${obj.verses[i].verse}</p>
	                                </li><li><ol>`
	                        }else{
	                            htmlContent += `
	                            <div><li><p>${obj.verses[i].verse}</p></li></div>`
	                        }
	                    }
	                    htmlContent+= `</ol></li></ul>`
	                    if(contentFlag)
	                        inlineData += htmlContent;
	                    htmlContent = '';
	                    contentFlag = false;
	                 })
	                inlineData+= '</div></body></html>'
	                db.get('targetBible').then((doc) => {
	                	let targetPath = doc.targetPath[0];
	                    let filepath = path.join(targetPath, `${currentBook.book_name}.html`);
	                    fs.writeFile(filepath, inlineData , function (err) {
		                    if (err) {
		                        swal("export", "Oops! error occured. Please try later", "error");
		                        return
		                    }else{
		                        swal("Successfully exported as html", `File exported at location: ${filepath}`, "success");
		                    }
	                    });   
	                }); 
	            });     
        } else {
                i18n.getLocale().then((locale) => {
            	let htmlContent = '';
            	let inlineData = `<!DOCTYPE html>
                <html lang="en" dir="rtl">

                <head>
                    <meta charset="utf-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta name="description" content="">
                    <style>

                        p {
                        font-size: 100%;
                    }
                    .newspaper ul li ol li:before {
                        font-size: 62%
                    }
                     .chapter {
                        font-size: 35px;
                        }

                    p {
                    font-family: Awami Nastaliq;
                    }

                    .body {
                        background-color: #f5f8fa;
                        line-height: 120%;
                    }

                    .newspaper {
                        -webkit-column-count: 2;
                        -moz-column-count: 2;
                        column-count: 2;
                    }
                    .list {
                        margin: 0 auto;
                        padding-top: 5px;
                    }
                   

                    .newspaper ul{float: right; width: 100%;}
                    .newspaper ul li {
                        list-style: none;
                        float: right;
                        display: block;
                        width: 100%;
                            margin-right: 16px;
                    }

                    .newspaper ul li ol {
                        counter-reset: item+1;
                        list-style-type: none;
                        margin: 0;
                        padding: 0;
                    }

                    .newspaper ul li ol li {
                        display: block;
                        float: right;
                        width: 100%;
                    }

                    .newspaper ul li ol li:before {
                        width: 3%;
                        float: right;
                        font-weight: bold;
                        content: counter(item, arabic-indic) "  ";
                        counter-increment: item;
                        margin-top: 3px;
                    }
                    .newspaper ul li ol li p {
                    width: 90%;
                    margin: 0 0 10px 0;
                    padding: 0 10px 0px 0px;
                    float: right;
                    box-sizing: border-box;
                    text-align: right;
                }

                ul li span.chapter { float: right; display: inline-block !important; min-height: 11px; width: 6%;}
                .firstLi {float: right;  text-align: right; margin-right: 23px; width: 60%}

                    @media only print {
                        .firstLi {width: 80%; margin-bottom: 0px;}
                        ul li span.chapter {margin-left: 5px}
                    }
        
                    </style>
                    </head>
                <body class="body">
                <center><h1>${currentBook.book_name}</h1></center>
                <div class="newspaper">`
                var contentFlag = false;
                db.get(currentBook._id).then(function(doc) {
                    doc.chapters.map((obj, i) => {
                        for( let i=0; i<obj.verses.length; i++){
                            if (obj.verses[i].verse !== "" && obj.verses[i].verse !== null){
                                contentFlag = true;
                            }
                            if(i==0){
                                htmlContent += 
                                `<ul class="list">
                                    <li>
                                        <p class="firstLi"><span class="chapter">${obj.chapter.toLocaleString('ar')}</span>${obj.verses[i].verse}</p>
                                    </li><li><ol>`
                            }else{
                                htmlContent += `
                                <li><p>${obj.verses[i].verse}</p></li>`
                            }
                        }
                        htmlContent+= `</ol></li></ul>`
                        if(contentFlag)
                            inlineData += htmlContent;
                        htmlContent = '';
                        contentFlag = false;
                     })
                    inlineData+= '</div></body></html>'
                    db.get('targetBible').then((doc) => {
                    	let targetPath = doc.targetPath[0];
                        let filepath = path.join(targetPath, `${currentBook.book_name}.html`);
                        fs.writeFile(filepath, inlineData , function (err) {
                        if (err) {
                            alertModal("export", "Oops! error occured. Please try later");
                            return;
                        }else{
                            alertModal("export", `File exported at location: ${filepath}`);
                        }
                        });    
                    }); 
                });     
                
                });
            }
            
        },(err)=> {
            alertModal("export", "Oops! error occured. Please try later");
        });
	}
}