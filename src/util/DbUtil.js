const dataProvider = require(`${__dirname}/data-provider`);
const bibleJson = require(`${__dirname}/../lib/full_bible_skel.json`);
const refEnUlbJson = require(`${__dirname}/../lib/eng_ult.json`);
const refEnUdbJson = require(`${__dirname}/../lib/eng_ust.json`);
const refHiUlbJson = require(`${__dirname}/../lib/hin_irv.json`);
const refHiIrvJson = require(`${__dirname}/../lib/hin_irv_s5.json`);
const refArbVdtJson = require(`${__dirname}/../lib/arb_vdt.json`);
const chunksJson = require(`${__dirname}/../lib/chunks.json`);
const refsConfigJson = require(`${__dirname}/../lib/refs_config.json`);
const langCodeJson = require(`${__dirname}/../lib/language_code.json`);

const populateDb = async ({db, bulkDocsArray}) => {
  try {
    bulkDocsArray.forEach(async (data) => {
      await db.bulkDocs(data);
    });
      //db.close();
    return true;
  } catch(err) {
    db.close();
    return false;
  };
};

const setupDb = async ({db, bulkDocsArray}) => {
  try {
    const info = await db.info();
    if (info.doc_count > 0) {
      //db.close();
      return false;
    } else {
      const populated = await populateDb({db, bulkDocsArray});
      return populated;
    }
  } catch(err) {
    return false;
  }
}

const setupTargetDb = async () => {
  try {
    const db = dataProvider.targetDb();
    const setup = await setupDb({db, bulkDocsArray: [bibleJson]});
    return setup;
  } catch(err) {
    return false;
  }
};

const setupRefDb = async () => {
  try {
    const db = dataProvider.referenceDb();
    // db.open();
    let bible;
    const bulkDocsArray = [
      refsConfigJson,
      refEnUlbJson,
      refEnUdbJson,
      refHiUlbJson,
      refArbVdtJson,
      refHiIrvJson
    ];

    // Below code is for adding the stage 5 Hindi IRV into existing reference list,
    // The code checks for the Bible if it is not available then push it into db and
    // works for the app which updates from v1.4.0-beta.4 or lower version to above.
    db.get('refs').then(async(doc)=>{
      let array
      array = (doc.ref_ids)
      bible=(doc.ref_ids).find((value)=>value.ref_id==="hin_irv_s5")
      if (bible===undefined){
        const ref_entry= {
          "ref_id": "hin_irv_s5",
          "ref_lang_code": "hin",
          "ref_name": "Hindi-IRV-S5",
          "isDefault": true
        };
        array.push(ref_entry);
        doc.ref_ids=array;
        db.put(doc).then((res)=>{
          refHiIrvJson.forEach((val)=>{
            db.get(val._id).then((doc) => {
              val._rev = doc._rev;
              db.put(val)
            }, (err) => {
              db.put(val)
            })
          })
        })
      }
    })
    const setup = await setupDb({db, bulkDocsArray});
    await db.put(chunksJson);
    return setup;
  } catch(err) {
    return false;
  };
};

const setupLookupsDb = async () => {
  try {
    const db = dataProvider.lookupsDb();
    const setup = await setupDb({db, bulkDocsArray: [langCodeJson]});
    return setup;
  } catch(err) {
    return false;
  };
};

async function dbSetupAll() {
  try {
    await setupTargetDb();
    await setupRefDb();
    await setupLookupsDb();
    return true;
  } catch(err) {
    return false;
  };
};


const destroyDbs = async () => {
  const targetDb = dataProvider.targetDb();
  let response;
  try {
    response = await targetDb.destroy();
    response = await targetDb.close();
	} catch(err) {
    await targetDb.close();
	};

  const refDb = dataProvider.referenceDb();
  try {
    response = await refDb.destroy();
    response = await refDb.close();
  } catch(err) {
    await refDb.close();
	};

  return true;
};

const exportsAll = {
  dbSetupAll,
  destroyDbs,
  setupTargetDb,
  setupRefDb,
	setupLookupsDb,
};

module.exports = exportsAll;
