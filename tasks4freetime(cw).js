const first = [1, 2, 3, 4]
const second = [3, 4, 5, 6]

const intersection = (a, b) => a.filter(char => {
    return b.indexOf(char) >= 0
})
console.log(intersection(first, second))
