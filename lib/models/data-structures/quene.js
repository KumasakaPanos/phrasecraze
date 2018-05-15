'ues strict';

const Node=require('./node');

module.exports=function()
{
    this.enqeune=function(content,content2=null)
    {
        if(!this.head)
        {this.head=new Node(content,content2);
        this.tail=this.head;}
        this.tail.next=new Node(content,content2);
        this.tail=this.tail.next;
    }

    this.dequene=function()
    {
        let returnValue=this.head.content;
        this.head=this.head.next;
    }
}