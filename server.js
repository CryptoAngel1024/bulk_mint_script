var fs = require('fs');

try {  
    var data = fs.readFileSync('wallet.txt', 'utf8');
    console.log(data.toString().split(/[\r\n]+/g));    
} catch(e) {
    console.log('Error:', e.stack);
}