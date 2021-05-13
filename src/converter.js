function convert(input, layout, undefinedChar) {

    input = input.toLowerCase();
    let reverse = input;
    let undefinedOpt;

    switch (undefinedChar) {
        //case "Print":
        //    undefinedOpt = key;
        //    break;
        case "Space":
            undefinedOpt = " "
            break;
        case "Delete":
            undefinedOpt = ""
            break;
    }

    let identifier = "";
    for (let i = 0; i < input.length; i++) {
        if (/\D/.test(input[i]) && /\S/.test(input[i])) {
            identifier = input[i]
            break;
        }
    }


    if (layout.has(identifier)) {
        return [fromMaintoAlter(input, reverse, layout, undefinedOpt), 1];
    } else {
        return [fromAltertoMain(input, reverse, layout, undefinedOpt), 0];
    }

};

function fromMaintoAlter(input, reverse, layout, undefinedOpt) {

    layout.forEach(function(values, keys) {
        reverse = input.includes(keys) ? reverse.replaceAll(keys, values) : reverse.replaceAll(keys, undefinedOpt);

    })

    //for (let char of input){
    //    reverse += curLayoutMap.has(char) ? curLayoutMap.get(char) : ' ';
    //}
    return reverse;
}

function fromAltertoMain(input, reverse, layout, undefinedOpt) {

    layout.forEach((values, keys) => {
        reverse = input.includes(values) ? reverse.replaceAll(values, keys) : reverse.replaceAll(values, undefinedOpt);
    })

    return reverse
}

module.exports = {
    convert
};