const test = require('node:test');
const assert = require('node:assert/strict');

const InscriptionTSM = require('../src/models/InscriptionTSM');
const InscriptionTSP = require('../src/models/InscriptionTSP');

test('TSM y TSP mantienen los mismos campos en colecciones independientes', () => {
  assert.deepEqual(
    Object.keys(InscriptionTSM.schema.paths).sort(),
    Object.keys(InscriptionTSP.schema.paths).sort()
  );
  assert.equal(InscriptionTSM.collection.name, 'inscriptions');
  assert.equal(InscriptionTSP.collection.name, 'inscriptiontsps');
});
