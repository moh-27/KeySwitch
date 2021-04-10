const { readFileSync, readdirSync } = require('fs');
const { path, join, basename } = require('path');



function getAllLangs() {
    allLangs = readdirSync(__dirname)
        .filter(file => /.json$/.test(file))
        .map(file => basename(file, '.json'))

    return allLangs
}


function buildCurLayoutMap(choosen) {

    let LayoutMap = new Map();

    let fisrtLayout = JSON.parse(readFileSync(join(__dirname, choosen[0]) + '.json'));
    let secondLayout = JSON.parse(readFileSync(join(__dirname, choosen[1]) + '.json'));

    for (let i = 0; i < fisrtLayout.length; i++) {
        LayoutMap.set(fisrtLayout[i], secondLayout[i]);
    };
    //curLayoutMap = LayoutMap
    return LayoutMap;

}


module.exports = {
    getAllLangs,
    buildCurLayoutMap,
}