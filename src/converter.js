function convert(input, layout) {

    input = input.toLowerCase();
    let reverse = input;

    let identifier = "";
    for (let i = 0; i < input.length; i++) {
        if (/\D/.test(input[i]) && /\S/.test(input[i])) {
            identifier = input[i]
            break;
        }
    }


    if (layout.has(identifier)) {
        return [fromMaintoAlter(input, reverse, layout), 1];
    } else {
        return [fromAltertoMain(input, reverse, layout), 0];
    }

};

function fromMaintoAlter(input, reverse, layout) {

    layout.forEach(function(values, keys) {
        reverse = input.includes(keys) ? reverse.replaceAll(keys, values) : reverse.replaceAll(keys, " ");

    })

    //for (let char of input){
    //    reverse += curLayoutMap.has(char) ? curLayoutMap.get(char) : ' ';
    //}
    return reverse;
}

function fromAltertoMain(input, reverse, layout) {

    layout.forEach((values, keys) => {
        reverse = input.includes(values) ? reverse.replaceAll(values, keys) : reverse.replaceAll(values, " ");
    })

    return reverse
}

module.exports = {
    convert
};