'use strict';
const game=require('../game');

test('Testing the quene to have 2 node with an animal and an animal1', ()=>{
    let testScript='Mary had a <animal> who often fought with her <animal>';
    let testQuene=game.scriptHandler(testScript);
    expect(testQuene.head.content).toEqual('animal');
    expect(testQuene.head.content2).toEqual('animal');
    expect(testQuene.head.next.content).toEqual('animal1');
    expect(testQuene.head.next.content2).toEqual('animal');
})