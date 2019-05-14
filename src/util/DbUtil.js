const dataProvider = require(`${__dirname}/data-provider`);

const bibleJson = require(`${__dirname}/../lib/full_bible_skel.json`);
const refEnUlbJson = require(`${__dirname}/../lib/eng_ult.json`);
const refEnUdbJson = require(`${__dirname}/../lib/eng_ust.json`);
const refHiUlbJson = require(`${__dirname}/../lib/hin_irv.json`);
const refArbVdtJson = require(`${__dirname}/../lib/arb_vdt.json`);
const chunksJson = require(`${__dirname}/../lib/chunks.json`);
const refsConfigJson = require(`${__dirname}/../lib/refs_config.json`);
const langCodeJson = require(`${__dirname}/../lib/language_code.json`);

const populateDb = async ({db, bulkDocsArray}) => {
  console.log('\tDB needs setup\n');
  try {
    console.log('\tDB import data\n');
    bulkDocsArray.forEach(async (data) => {
      await db.bulkDocs(data);
    });
    console.log('\tSuccessfully setup DB.\n');
      //db.close();
    return true;
  } catch(err) {
    db.close();
    console.log('populateDb() Error: ', err);
    return false;
  };
};

const setupDb = async ({db, bulkDocsArray}) => {
  console.log('setupDb()\n');
  try {
    const info = await db.info();
    if (info.doc_count > 0) {
      console.log('\tDB exists\n');
      //db.close();
      return false;
    } else {
      const populated = await populateDb({db, bulkDocsArray});
      return populated;
    }
  } catch(err) {
    console.log('setupDb() Error: ', err);
    return false;
  }
}

const setupTargetDb = async () => {
  console.log('setupTargetDb()\n');
  try {
    const db = dataProvider.targetDb();
    const setup = await setupDb({db, bulkDocsArray: [bibleJson]});
    return setup;
  } catch(err) {
    console.log('setupTargetDb() Error: ', err);
    return false;
  }
};

const setupRefDb = async () => {
  console.log('setupRefDb()');
  try {
    const db = dataProvider.referenceDb();
    const bulkDocsArray = [
      refsConfigJson,
      refEnUlbJson,
      refEnUdbJson,
      refHiUlbJson,
      refArbVdtJson
    ];
    const setup = await setupDb({db, bulkDocsArray});
    await db.put(chunksJson);
    console.log('Successfully loaded reference texts.');
    return setup;
  } catch(err) {
    console.log('setupRefDb() Error: ' + err);
    return false;
  };
};

const setupLookupsDb = async () => {
  console.log('setupLookupsDb()');
  try {
    const db = dataProvider.lookupsDb();
    const setup = await setupDb({db, bulkDocsArray: [langCodeJson]});
    console.log('Successfully setup Looks up DB.');
    return setup;
  } catch(err) {
    console.log('setupLookupsDb() Error: ', err);
    return false;
  };
};

async function dbSetupAll() {
  console.log('dbSetup()');
  try {
    await setupTargetDb();
    await setupRefDb();
    await setupLookupsDb();
    return true;
  } catch(err) {
    console.log('dbSetup() Error: ' + err);
    return false;
  };
};


const destroyDbs = async () => {
  console.log('destroyDbs()');
  const targetDb = dataProvider.targetDb();
  let response;
  try {
    response = await targetDb.destroy();
    console.log('targetDB destroyed:', response);
    response = await targetDb.close();
    console.log('targetDB closed:', response);
	} catch(err) {
    console.log(err);
    await targetDb.close();
	};

  const refDb = dataProvider.referenceDb();
  try {
    response = await refDb.destroy();
    console.log('referenceDB destroyed:', response);
    response = await refDb.close();
    console.log('referenceDB closed:', response);
  } catch(err) {
    console.log(err);
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
