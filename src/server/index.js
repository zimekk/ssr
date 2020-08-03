console.log('server')

let test = 1;

export default (chunks) => console.log(chunks)||({ ...chunks, test: test++})