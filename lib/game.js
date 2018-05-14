'use strict';

const Quene = require('./models/data-structures/quene');

export default class Game {
  constructor () {
    this.
  }

this.testPhrase = /^<\w*>$/;
this.endBracket = />/;

this.scriptHandler=function(script)
{
    let keywordsString = '';
    let keywordsQuene = new Quene;
    while(this.testPhrase.exec(script) !== null)
    {
    this.appender(keywordsQuene,script);
    }
    return(keywordsQuene);
}

this.appender=function(quene,script)
{
    //This needs to save the category and check it against all prior categories
    //to assign it a unique identifier in case there are multiple of 1 category
    let dataValue=this.testPhrase.exec(script);
    let dataCate=dataValue[0];
    //keywordsString saves each prior dataValue return to a string and tests against it
    //so each node has a unique identifier
    keywordsString=`${keywordsString}${dataValue[0]}`;
    
    //slice needs to target end of returned string not beginning
    script.slice(0,this.endBracket.exec(script).index+1);

    while(keywordsString.search(dataValue[0]))
    {   dataValue[0]=`${dataValue[0]}1`;
        keywordsString=`${keywordsString}${dataValue[0]}`};
    quene.enquene(dataValue[0],dataCate);
}

}
