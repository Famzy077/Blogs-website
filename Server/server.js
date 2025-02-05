// const http = require('http')
// const server = http.Server((req, res) => {
//     res.writeHead(200, {'content-type': 'text-plain'})
//     res.end('<h1>Hello World!</h1>')
// })

// server.listen(3000, () => {
//     console.log('Server is running on localhost:3000')
// })

// const express = require('express');
// const app = express();
// app.use((req, res, next) => {
//     console.log(`Request Method, ${req.method}: ${req.url}`)
//     next()
// })
// app.get('/',(req, res) => {
//     res.send('Welcome to homepage');
// })
// const port = 3000;
// app.listen(port, () => {
//     console.log('App running on port 3000')
// })
// const fs = require('fs').promises;
// async function copyFile() {
//     try {
//         const Data = await fs.readFile('input.txt', 'utf-8');
//         await fs.writeFile('output.txt', Data);
//         console.log('File copied successfully');
//     } catch (error) {
//         console.log(error)
//     }
// }
// copyFile()

// const express = require('express');
// const app = express();
// app.get('/api/res', (req, res) => {
//     const name = req.query.name || 'world';
//     res.send(`hello ${name}`)
// })
// app.listen(3000, () => {
//     console.log('App running on port 3000')
// })

const fs = require('fs').promises;
async function copyFile (){
    try {
        const data = await fs.readFile('input.txt', 'utf-8' );
        await fs.writeFile('output', data);
        console.log('Suceessfully copied')
    } catch (error) {
        console.log(error)
    }
}
copyFile()