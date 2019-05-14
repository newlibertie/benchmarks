const args = require('minimist')(process.argv.slice(2))

function getBoundInteger(value, lowBound, upBound, defaultValue)
{
    switch (typeof value)
    {
        case 'string' : value = parseInt(value);
        case "number" : return (value < lowBound ? lowBound : (value > upBound ? upBound : value));
        case 'undefined':
        default: return defaultValue;
    }
}

var loopCount              = getBoundInteger(args['loopCount'], 10,       100000,   100);
var baseNumberString      = getBoundInteger(args['baseNum'],    10, 99999999999999999999, 12345).toString();
var exponentNumberString = getBoundInteger(args['expNum'],     10,           999,    12).toString();
var moduloNumberString   = getBoundInteger(args['modNum'],     10,     999999999,   123).toString();

console.log('loopCount', loopCount);
console.log('baseNumberString', baseNumberString);
console.log('exponentNumberString', exponentNumberString);
console.log('moduloNumberString', moduloNumberString);
///////////////////////////////////////////////////////////

//import java.math.BigInteger;
//import java.security.SecureRandom;

var moduleStr = 'bigint-crypto-utils'
const bigintCryptoUtils = require(moduleStr);

var prime;
const primePromise = bigintCryptoUtils.prime(2048);
const bigInt1KBits = BigInt(2n ** 256n);
const bigInt256Bits = BigInt(2n ** 32n);
const bigIn32Bits = BigInt(2n ** 4n);

var errHandler = function(err) {
    console.log(err);
}

async function f() {
    let promise = primePromise.then(function(result) {
                    prime = result;
                }, errHandler);

    await promise.catch((err) => { console.log(err); }); // wait till the promise resolves (*)

    //val p = BigInteger.probablePrime(1000, new SecureRandom());
    var p = prime;
    //val g = new BigInteger(1000, new SecureRandom());
    var g = BigInt(bigintCryptoUtils.randBetween(bigInt1KBits));
    //val privateKey = new BigInteger(1000, new SecureRandom());
    var privateKey = BigInt(bigintCryptoUtils.randBetween(bigInt1KBits));
    //val publicKey =  g.modPow(privateKey, p)
    var publicKey = bigintCryptoUtils.modPow(g, privateKey, p)
    //var publicKey = (g ** privateKey) % p
    
    //println(s"private key ${privateKey}")
    console.log("private key ", privateKey)
    //println(s"public key ${publicKey}")
    console.log("public key ", publicKey)
    
    //val start = System.currentTimeMillis();
    nameTag = "elgamal pairs"
    var m,r,x,y;
    console.time(nameTag);
    for (var i = 1; i < loopCount; i++) {
        //var m = new BigInteger(32, new SecureRandom());
        m = bigintCryptoUtils.randBetween(bigIn32Bits);
        //var r = new BigInteger(1000, new SecureRandom());
        r = bigintCryptoUtils.randBetween(bigInt1KBits,m);
        //var x = g.modPow(r, p);
        x = bigintCryptoUtils.modPow(g, r, p)
//        x = (g ** r) % p;
        //var y = publicKey.modPow(r, p).multiply(m).mod(p); 
        y = (bigintCryptoUtils.modPow(publicKey, r, p) * m)%p; 
//        y = (((publicKey ** r) % p) * m) % p;

        //println(s"x = ${x}");
        console.log("x = ", x.toString())
        //println(s"y = ${y}");
        console.log("y = ", x.toString())
    }
    //val end = System.currentTimeMillis();
    console.timeEnd(nameTag);
}

f();
return
