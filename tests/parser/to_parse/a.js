

function test(t) {
    console.log(t)
}

function mult(x, y) {
    return x * y
}
 
const a = function (res, req) {
    const a = (() => 4)()
    console.log(a)
}