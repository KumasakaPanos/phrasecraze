'use strict';

module.exports=new function(content, content2=null)
{
    //When the script is being parsed, content 1 will be the category, content 2 will be the unique identifier.
    //Content 3 is empty until the data is returned
    this.content=content;
    this.content2=content2;
    this.content3;
    this.next;
}