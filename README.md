# GS1Parser
A Simple GS1 Datamatrix Parser for Typescript

# NOTE
This parser has not been thoroughly tested and cannot properly scan most AIs. This is simply because I don't have enough test data and my scanner 
(YDHAA M800D) appears to preprocess the scans leaving just the decoded information. If you want to provide some test data or report bugs please feel free to leave a issue on GitHub or send me an email.
\
-> Does not support chaining of AIs \
-> Does not support variable length strings unless they are at the end or are exactly 20 characters.

# Sample Usage
```js
parseGS1('0107630031730428112010201725101910EF51');
```
Returns 
```js
{
    GTIN: '07630031730428',
    BatchNumber: 'EF51',
    ProductionDate: Tue Oct 20 2020 00:00:00 GMT+1100 (Australian Eastern Daylight Time),
    ExpirationDate: Sun Oct 19 2025 00:00:00 GMT+1100 (Australian Eastern Daylight Time),
    BestBeforeDate: null,
    SerialNumber: null    
}
```

Use the `-client.js` file for client side browser processing (They are missing the "export" statement on functions so they don't error)
