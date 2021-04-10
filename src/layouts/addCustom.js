


/*
let langs = readdirSync(__dirname)
    .filter(file => /^[a-z]{2}.json$/.test(file))
    .map(file => basename(file, '.json'))
    .sort();

*/


// The following code used to write a js file that contains a map of the curLayout
/*
function toStr(curMap){
    let tuples = []
    for (let key of curMap) {
      tuples.push([key, curMap[key]])
    }
    let keys = tuples.map(tuple => tuple[0][0]);
    let values = tuples.map(tuple => tuple[0][1]);

    let stringfy = "var curLayout = { \n";
    for(let i = 0; i<keys.length; i++){
        stringfy += '  ' +
        JSON.stringify(keys[i]) +
        ' : ' +
        JSON.stringify(values[i]) +
        ',\n';
     

    }
    return (stringfy)
}


function writeCurLayout() {
    updateChoosenLangs();

    let str = " \" \" : \" \" \n }";
    writeFileSync(join(__dirname, 'curLayout.js'), toStr(buildCurLayoutMap())
    + str );
}
*/